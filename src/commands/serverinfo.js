const i18n = require('../utils/i18n');

module.exports = {
    name: 'serverinfo',
    description: () => i18n.t('commands:serverinfo.description'),
    execute: async (message, args) => {
        const guild = message.guild;
        if (!guild) return message.reply('This command can only be used in a server.');

        const serverEmbed = {
            color: 0x0099ff,
            title: i18n.t('commands:serverinfo.title', { serverName: guild.name }),
            fields: [
                { 
                    name: i18n.t('commands:serverinfo.fields.memberCount.name'), 
                    value: `${i18n.t('commands:serverinfo.fields.memberCount.total', { total: guild.memberCount })}\n` +
                           `${i18n.t('commands:serverinfo.fields.memberCount.humans', { humans: guild.members.cache.filter(m => !m.user.bot).size })}\n` +
                           `${i18n.t('commands:serverinfo.fields.memberCount.bots', { bots: guild.members.cache.filter(m => m.user.bot).size })}`, 
                    inline: true 
                },
                { 
                    name: i18n.t('commands:serverinfo.fields.createdOn.name'), 
                    value: i18n.t('commands:serverinfo.fields.createdOn.value', { date: guild.createdAt.toDateString() }), 
                    inline: true 
                },
                { 
                    name: i18n.t('commands:serverinfo.fields.owner.name'), 
                    value: `<@${guild.ownerId}>`, 
                    inline: true 
                },
                { 
                    name: i18n.t('commands:serverinfo.fields.channels.name'), 
                    value: `${i18n.t('commands:serverinfo.fields.channels.total', { total: guild.channels.cache.size })}\n` +
                           `${i18n.t('commands:serverinfo.fields.channels.text', { text: guild.channels.cache.filter(ch => ch.type === 0).size })}\n` +
                           `${i18n.t('commands:serverinfo.fields.channels.voice', { voice: guild.channels.cache.filter(ch => ch.type === 2).size })}`, 
                    inline: true 
                },
                { 
                    name: i18n.t('commands:serverinfo.fields.roles.name'), 
                    value: i18n.t('commands:serverinfo.fields.roles.total', { total: guild.roles.cache.size }), 
                    inline: true 
                }
            ],
            timestamp: new Date()
        };

        await message.channel.send({ embeds: [serverEmbed] });
    }
}; 