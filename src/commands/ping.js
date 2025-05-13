const i18n = require('../utils/i18n');

module.exports = {
    name: 'ping',
    description: () => i18n.t('commands:ping.description'),
    execute: async (message, args) => {
        const sent = await message.channel.send('Pinging...');
        sent.edit(i18n.t('commands:ping.response', { 
            latency: sent.createdTimestamp - message.createdTimestamp 
        }));
    }
}; 