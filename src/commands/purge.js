const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Bulk delete messages in a channel. Requires Manage Messages permission.',
    usage: '!purge <number_of_messages>',
    examples: [
        '!purge 10 - Deletes the last 10 messages in the channel',
        '!purge 50 - Deletes the last 50 messages in the channel'
    ],
    permissions: ['Manage Messages'],
    execute: async (message, args) => {
        // Check if user has permissions to purge messages
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('You do not have permission to use this command.');
        }

        // Check if a number of messages is specified
        if (args.length === 0) {
            return message.reply('Please specify the number of messages to delete.');
        }

        // Parse the number of messages
        const deleteCount = parseInt(args[0], 10);

        // Validate the number of messages
        if (isNaN(deleteCount) || deleteCount < 1 || deleteCount > 100) {
            return message.reply('Please provide a number between 1 and 100.');
        }

        try {
            // Fetch messages and delete them
            const fetched = await message.channel.messages.fetch({
                limit: deleteCount + 1 // Include the purge command message
            });

            // Bulk delete messages
            await message.channel.bulkDelete(fetched);

            // Send a confirmation message
            const confirmEmbed = {
                color: 0x00FF00,
                description: `🗑️ Deleted ${deleteCount} messages.`,
                footer: { 
                    text: `Purged by ${message.author.tag}`,
                    icon_url: message.author.displayAvatarURL()
                }
            };

            // Send a temporary confirmation message
            const confirmMessage = await message.channel.send({ embeds: [confirmEmbed] });

            // Delete the confirmation message after 5 seconds
            setTimeout(() => {
                confirmMessage.delete().catch(console.error);
            }, 5000);

        } catch (error) {
            console.error('Purge command error:', error);
            
            // Handle specific Discord API errors
            if (error.code === 50034) {
                return message.reply('Cannot delete messages older than 14 days.');
            }
            
            message.reply('There was an error trying to purge messages.');
        }
    }
}; 