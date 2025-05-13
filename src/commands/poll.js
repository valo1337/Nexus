const i18n = require('../utils/i18n');

module.exports = {
    name: 'poll',
    description: 'Create an interactive poll with multiple options',
    execute: async (message, args) => {
        if (args.length < 3) {
            return message.reply(i18n.t('commands:poll.usage'));
        }

        const question = args[0];
        const options = args.slice(1);

        const pollEmbed = {
            color: 0x0099ff,
            title: i18n.t('commands:poll.title', { question }),
            description: options.map((opt, idx) => `${idx + 1}️⃣ ${opt}`).join('\n')
        };

        const pollMessage = await message.channel.send({ embeds: [pollEmbed] });
        
        // Add reaction options
        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(`${i + 1}️⃣`);
        }
    }
}; 