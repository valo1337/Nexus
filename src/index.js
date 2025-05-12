require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { Player } = require('discord-player');
const config = require('./config');

// Server Management Modules
const serverManagement = require('./modules/serverManagement');
// Utility Modules
const utilityCommands = require('./modules/utilityCommands');
// Music Modules
const musicCommands = require('./modules/musicCommands');

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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Initialize modules
    serverManagement.init(client, config);
    utilityCommands.init(client, config);
    musicCommands.init(client, player, config);
});

// Message Command Handler
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Delegate to specific module handlers
    if (serverManagement.handleCommand(command, message, args)) return;
    if (utilityCommands.handleCommand(command, message, args)) return;
    if (musicCommands.handleCommand(command, message, args)) return;
});

// Error Handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login to Discord
client.login(config.token); 