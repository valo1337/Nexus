const i18n = require('../utils/i18n');

module.exports = {
    name: 'language',
    description: 'Change your preferred bot language',
    execute: async (message, args) => {
        // If no arguments, show current language
        if (args.length === 0) {
            const currentLang = i18n.getUserLanguage(message.author.id);
            return message.reply(
                `Your current language: ${currentLang}\n` +
                `Available languages: ${i18n.supportedLanguages.join(', ')}\n` +
                'Use !language <code> to change (e.g., !language es)'
            );
        }

        // Get the new language
        const newLanguage = args[0].toLowerCase();
        
        // Try to set the user's language
        if (i18n.setUserLanguage(message.author.id, newLanguage)) {
            // Optionally, change the bot's current language for this user
            i18n.changeLanguage(newLanguage);
            
            message.reply(`Your language preference has been set to ${newLanguage}`);
        } else {
            message.reply(`Unsupported language. Available: ${i18n.supportedLanguages.join(', ')}`);
        }
    }
}; 