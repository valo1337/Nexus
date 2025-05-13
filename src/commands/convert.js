const axios = require('axios');
const i18n = require('../utils/i18n');

module.exports = {
    name: 'convert',
    description: 'Convert currencies',
    execute: async (message, args) => {
        // Check if arguments are provided correctly
        if (args.length !== 3) {
            return message.reply('Usage: !convert <amount> <from_currency> <to_currency>');
        }

        const [amount, fromCurrency, toCurrency] = args;
        const apiKey = process.env.EXCHANGE_RATE_API_KEY;

        if (!apiKey) {
            return message.reply('Currency conversion API key is not configured.');
        }

        try {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.toUpperCase()}`);
            
            const exchangeRates = response.data.conversion_rates;
            const convertedAmount = (parseFloat(amount) * exchangeRates[toCurrency.toUpperCase()]).toFixed(2);

            const conversionEmbed = {
                color: 0x0099ff,
                title: '💱 Currency Conversion',
                description: '**Conversion Result:**\n' +
                             `${amount} ${fromCurrency.toUpperCase()} = ${convertedAmount} ${toCurrency.toUpperCase()}`,
                fields: [
                    {
                        name: '💹 Exchange Rate',
                        value: `1 ${fromCurrency.toUpperCase()} = ${exchangeRates[toCurrency.toUpperCase()]} ${toCurrency.toUpperCase()}`
                    }
                ],
                footer: { text: 'Rates from ExchangeRate-API' }
            };

            await message.channel.send({ embeds: [conversionEmbed] });
        } catch (error) {
            console.error('Currency conversion error:', error);
            message.reply('Could not convert currencies. Please check the currency codes.');
        }
    }
}; 