const { EmbedBuilder } = require('discord.js');

// Create a map to store recently deleted messages
const deletedMessages = new Map();

// Listener to track deleted messages
function trackDeletedMessages(client) {
    client.on('messageDelete', async (message) => {
        // Ignore bot messages and empty messages
        if (message.author.bot || !message.content) return;

        // Store the deleted message
        deletedMessages.set(message.channel.id, {
            content: message.content,
            author: message.author,
            timestamp: message.createdTimestamp,
            attachments: message.attachments
        });
    });
}

module.exports = {
    name: 'snipe',
    description: 'Retrieve the most recently deleted message in the channel. Requires Manage Messages permission.',
    usage: '!snipe',
    examples: [
        '!snipe - Shows the most recently deleted message in the current channel'
    ],
    permissions: ['Manage Messages'],
    trackDeletedMessages, // Export this function to be called in index.js
    execute: async (message, args) => {
        // Check if user has permissions to snipe
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('You do not have permission to use this command.');
        }

        // Get the deleted message for this channel
        const deletedMessage = deletedMessages.get(message.channel.id);

        if (!deletedMessage) {
            return message.reply('No recently deleted messages found in this channel.');
        }

        // Create an embed for the sniped message
        const snipeEmbed = {
            color: 0xFF0000,
            author: {
                name: deletedMessage.author.tag,
                icon_url: deletedMessage.author.displayAvatarURL()
            },
            description: deletedMessage.content,
            footer: { 
                text: `Deleted ${Math.round((Date.now() - deletedMessage.timestamp) / 1000)} seconds ago`
            }
        };

        // Add attachments if any
        if (deletedMessage.attachments && deletedMessage.attachments.size > 0) {
            const attachment = deletedMessage.attachments.first();
            snipeEmbed.image = { url: attachment.url };
        }

        await message.channel.send({ embeds: [snipeEmbed] });
    }
}; 