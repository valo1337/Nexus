const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');
const fs = require('fs');

class I18nManager {
    constructor() {
        this.defaultLanguage = 'en';
        this.supportedLanguages = ['en', 'es', 'fr'];
        this.languagePreferencesPath = path.join(__dirname, '../data/language-preferences.json');
        this.languagePreferences = this.loadLanguagePreferences();
    }

    // Load language preferences from file
    loadLanguagePreferences() {
        try {
            if (fs.existsSync(this.languagePreferencesPath)) {
                return JSON.parse(fs.readFileSync(this.languagePreferencesPath, 'utf8'));
            }
            return {};
        } catch (error) {
            console.error('Error loading language preferences:', error);
            return {};
        }
    }

    // Save language preferences to file
    saveLanguagePreferences() {
        try {
            // Ensure the directory exists
            const dir = path.dirname(this.languagePreferencesPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(
                this.languagePreferencesPath, 
                JSON.stringify(this.languagePreferences, null, 2)
            );
        } catch (error) {
            console.error('Error saving language preferences:', error);
        }
    }

    async init() {
        await i18next
            .use(Backend)
            .init({
                lng: this.defaultLanguage,
                fallbackLng: this.defaultLanguage,
                backend: {
                    loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json')
                },
                ns: ['common', 'commands'],
                defaultNS: 'common',
                interpolation: {
                    escapeValue: false
                }
            });
        
        return this;
    }

    // Set language preference for a specific user
    setUserLanguage(userId, language) {
        if (this.supportedLanguages.includes(language)) {
            this.languagePreferences[userId] = language;
            this.saveLanguagePreferences();
            return true;
        }
        return false;
    }

    // Get language preference for a specific user
    getUserLanguage(userId) {
        return this.languagePreferences[userId] || this.defaultLanguage;
    }

    // Translate a key with optional parameters
    t(key, options = {}) {
        return i18next.t(key, options);
    }

    // Change language for a specific context
    changeLanguage(lng) {
        if (this.supportedLanguages.includes(lng)) {
            i18next.changeLanguage(lng);
            return true;
        }
        return false;
    }

    // Get current language
    getCurrentLanguage() {
        return i18next.language;
    }
}

module.exports = new I18nManager(); 