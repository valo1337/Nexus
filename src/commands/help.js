const i18n = require('../utils/i18n');

module.exports = {
    name: 'help',
    description: 'Shows all available commands or provides detailed info about a specific command',
    execute: async (message, args) => {
        // Get the command handler from the client
        const commandHandler = message.client.commandHandler;
        
        // If a specific command is requested
        if (args.length > 0) {
            const commandName = args[0].toLowerCase();
            const command = commandHandler.commands.get(commandName);
            
            if (!command) {
                return message.reply(`❌ No command found with name \`${commandName}\``);
            }
            
            // Create a detailed embed for the specific command
            const commandEmbed = {
                color: 0x0099ff,
                title: `📘 Command: ${message.client.config.prefix}${commandName}`,
                description: command.description ? 
                    (typeof command.description === 'function' ? command.description() : command.description) 
                    : 'No description available',
                fields: [
                    {
                        name: '📍 Usage',
                        value: `\`${message.client.config.prefix}${commandName}\``,
                        inline: false
                    }
                ],
                footer: {
                    text: 'Use !help to see all commands'
                },
                timestamp: new Date()
            };
            
            return message.channel.send({ embeds: [commandEmbed] });
        }
        
        // Get all commands
        const commands = commandHandler.getAllCommands();
        
        // Create an embed for the help message with categories
        const helpEmbed = {
            color: 0x0099ff,
            title: '🤖 Nexus Bot - Command Categories',
            description: `Use \`${message.client.config.prefix}help <command>\` for more info about a specific command.`,
            fields: [
                {
                    name: '🎮 Utility Commands',
                    value: commands
                        .filter(([name]) => ['ping', '8ball', 'poll', 'help', 'time'].includes(name))
                        .map(([name]) => `\`${message.client.config.prefix}${name}\``)
                        .join(', '),
                    inline: false
                },
                {
                    name: '🛡️ Moderation Commands',
                    value: commands
                        .filter(([name]) => ['snipe', 'purge'].includes(name))
                        .map(([name]) => `\`${message.client.config.prefix}${name}\``)
                        .join(', '),
                    inline: false
                },
                {
                    name: '🎵 Music Commands',
                    value: 'Use `!play <song/url>` to start playing music\n' +
                           '`!pause` - Pause the current song\n' +
                           '`!resume` - Resume paused song\n' +
                           '`!skip` - Skip to next song\n' +
                           '`!queue` - View current music queue\n' +
                           '`!stop` - Stop playing and clear queue',
                    inline: false
                },
                {
                    name: '⏰ Time Command',
                    value: '`!time [timezone/city]` - Check current time in a specific location',
                    inline: false
                }
            ],
            footer: {
                text: 'Use !help to see all commands'
            },
            timestamp: new Date()
        };
        
        return message.channel.send({ embeds: [helpEmbed] });
    }
};