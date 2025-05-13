const i18n = require('../utils/i18n');

module.exports = {
    name: '8ball',
    description: 'Ask the magic 8-ball a yes or no question',
    execute: async (message, args) => {
        if (args.length === 0) {
            return message.reply(i18n.t('commands:8ball.noQuestion'));
        }

        const responses = [
            ...i18n.t('commands:8ball.responses.positive'),
            ...i18n.t('commands:8ball.responses.neutral'),
            ...i18n.t('commands:8ball.responses.negative')
        ];

        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const embed = {
            color: 0x0099ff,
            title: i18n.t('commands:8ball.title'),
            description: `**Question:** ${args.join(' ')}\n**Answer:** ${response}`,
            footer: { text: 'Shake the 8-ball and get your fortune!' }
        };

        await message.channel.send({ embeds: [embed] });
    }
}; 