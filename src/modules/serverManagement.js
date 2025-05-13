module.exports = {
    client: null,
    config: null,

    init(client, config) {
        this.client = client;
        this.config = config;

        // Welcome new members
        client.on('guildMemberAdd', async (member) => {
            // Auto-assign roles
            if (this.config.autoRoles && this.config.autoRoles.length > 0) {
                try {
                    for (const roleId of this.config.autoRoles) {
                        const role = member.guild.roles.cache.get(roleId);
                        if (role) await member.roles.add(role);
                    }
                } catch (error) {
                    console.error('Error assigning auto-roles:', error);
                }
            }

            // Send welcome message
            if (this.config.welcomeChannel) {
                const channel = member.guild.channels.cache.get(this.config.welcomeChannel);
                if (channel) {
                    channel.send(`Welcome to the server, ${member}! 🎉 We're glad you've joined us!`);
                }
            }
        });
    },

    handleCommand(command, message, args) {
        switch(command) {
        case 'kick':
            this.kickUser(message, args);
            return true;
        case 'ban':
            this.banUser(message, args);
            return true;
        case 'clear':
            this.clearMessages(message, args);
            return true;
        default:
            return false;
        }
    },

    async kickUser(message, args) {
        // Check permissions
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You do not have permission to kick members.');
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a valid member to kick.');
        }

        try {
            await member.kick(args.slice(1).join(' ') || 'No reason provided');
            message.channel.send(`${member.user.tag} has been kicked.`);
        } catch (error) {
            console.error('Kick error:', error);
            message.reply('I was unable to kick the member.');
        }
    },

    async banUser(message, args) {
        // Check permissions
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('You do not have permission to ban members.');
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply('Please mention a valid member to ban.');
        }

        try {
            await member.ban({ 
                reason: args.slice(1).join(' ') || 'No reason provided' 
            });
            message.channel.send(`${member.user.tag} has been banned.`);
        } catch (error) {
            console.error('Ban error:', error);
            message.reply('I was unable to ban the member.');
        }
    },

    async clearMessages(message, args) {
        // Check permissions
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to clear messages.');
        }

        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 1 || deleteCount > 100) {
            return message.reply('Please provide a number between 1 and 100 for the number of messages to delete.');
        }

        try {
            const fetched = await message.channel.messages.fetch({
                limit: deleteCount
            });
            await message.channel.bulkDelete(fetched);
            message.channel.send(`Cleared ${deleteCount} messages.`).then(msg => {
                setTimeout(() => msg.delete(), 2000);
            });
        } catch (error) {
            console.error('Clear messages error:', error);
            message.reply('I was unable to delete the messages.');
        }
    }
}; 