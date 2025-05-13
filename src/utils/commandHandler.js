import fs from 'fs';
import path from 'path';

export default class CommandHandler {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.commands = new Map();
    }

    // Dynamically load commands from a directory
    async loadCommands(commandsPath) {
        const commandFiles = fs.readdirSync(commandsPath)
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandPath = path.join(commandsPath, file);
            const command = await import(commandPath);
            
            if ('name' in command.default && 'execute' in command.default) {
                this.commands.set(command.default.name, command.default);
            }
        }
    }

    // Handle incoming commands
    async handleCommand(message) {
        // Ignore bot messages
        if (message.author.bot) return false;

        // Check if message starts with prefix
        if (!message.content.startsWith(this.config.prefix)) return false;

        const args = message.content.slice(this.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        console.log(`Command received: ${commandName}`);
        console.log('Full message:', message.content);
        console.log('Arguments:', args);

        // First, check if it's a moderation command
        const moderationModule = this.client.moderationCommands || await import('../modules/moderationCommands.js');
        try {
            if (moderationModule.handleCommand(commandName, message, args)) {
                console.log(`Moderation command processed: ${commandName}`);
                return true;
            }
        } catch (modError) {
            console.error(`Error in moderation command ${commandName}:`, modError);
        }

        // Then, check if it's a music command
        // const musicModule = this.client.musicCommands || await import('../modules/musicCommands.js');
        // if (musicModule.handleCommand(commandName, message, args)) return;

        // Check regular commands
        const command = this.commands.get(commandName);
        if (!command) {
            console.log(`Unknown command: ${commandName}`);
            return false;
        }

        try {
            await command.execute(message, args);
            console.log(`Regular command processed: ${commandName}`);
            return true;
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error);
            message.reply('There was an error trying to execute that command!');
            return false;
        }
    }

    // Get all loaded commands
    getAllCommands() {
        return Array.from(this.commands.entries());
    }
} 