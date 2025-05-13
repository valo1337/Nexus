const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor(client, config) {
        this.client = client;
        this.config = config;
        this.commands = new Map();
    }

    // Dynamically load commands from a directory
    loadCommands(commandsPath) {
        const commandFiles = fs.readdirSync(commandsPath)
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandPath = path.join(commandsPath, file);
            const command = require(commandPath);
            
            if ('name' in command && 'execute' in command) {
                this.commands.set(command.name, command);
            }
        }
    }

    // Handle incoming commands
    async handleCommand(message) {
        if (!message.content.startsWith(this.config.prefix)) return false;

        const args = message.content.slice(this.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = this.commands.get(commandName);
        if (!command) return false;

        try {
            await command.execute(message, args);
            return true;
        } catch (error) {
            console.error(`Error executing ${commandName}:`, error);
            message.reply('There was an error trying to execute that command!');
            return false;
        }
    }
}

module.exports = CommandHandler; 