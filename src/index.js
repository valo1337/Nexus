require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Player } = require('discord-player');
const path = require('path');

const config = require('./config');
const CommandHandler = require('./utils/commandHandler');
const i18n = require('./utils/i18n');

// Server Management Modules
const serverManagement = require('./modules/serverManagement');
// Utility Modules
const utilityCommands = require('./modules/utilityCommands');
// Music Modules
const musicCommands = require('./modules/musicCommands');

// Import the snipe command to access its tracking function
const snipeCommand = require('./commands/snipe');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

// Create a new music player
const player = new Player(client);

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
    musicCommands.init(client, player, config);

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
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login to Discord
client.login(config.token); 