import 'dotenv/config';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config.js';
import CommandHandler from './utils/commandHandler.js';
import i18n from './utils/i18n.js';

// Server Management Modules
import serverManagement from './modules/serverManagement.js';
// Utility Modules
import utilityCommands from './modules/utilityCommands.js';
// Music Modules
import musicCommands from './modules/musicCommands.js';
// Moderation Modules
import moderationCommands from './modules/moderationCommands.js';

// Import the snipe command to access its tracking function
import snipeCommand from './commands/snipe.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: GatewayIntentBits.Guilds | 
             GatewayIntentBits.GuildMessages | 
             GatewayIntentBits.MessageContent | 
             GatewayIntentBits.GuildMembers | 
             GatewayIntentBits.GuildVoiceStates | 
             GatewayIntentBits.GuildRoles | 
             GatewayIntentBits.GuildMessageReactions | 
             GatewayIntentBits.GuildPresences,
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction
    ]
});

// Initialize command handlers
const commandHandler = new CommandHandler(client, config);
client.commandHandler = commandHandler;
client.config = config;

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Initialize localization
    await i18n.init();
    
    // Initialize modules
    serverManagement.init(client, config);
    utilityCommands.init(client, config);
    moderationCommands.init(client, config);

    // Attach modules to client for easier access
    client.moderationCommands = moderationCommands;

    // Dynamically load commands
    commandHandler.loadCommands(path.join(__dirname, 'commands'));

    // Set up snipe message tracking
    snipeCommand.trackDeletedMessages(client);
});

// Message Command Handler
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    await commandHandler.handleCommand(message);
});

// Error Handling
client.on('error', (error) => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Login to Discord
client.login(config.token); 