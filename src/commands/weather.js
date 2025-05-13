const axios = require('axios');
const i18n = require('../utils/i18n');

module.exports = {
    name: 'weather',
    description: 'Get current weather for a city',
    execute: async (message, args) => {
        // Check if city is provided
        if (args.length === 0) {
            return message.reply('Please provide a city name. Usage: !weather <city>');
        }

        const city = args.join(' ');
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return message.reply('Weather API key is not configured.');
        }

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city,
                    appid: apiKey,
                    units: 'metric' // Use Celsius
                }
            });

            const weatherData = response.data;
            const weatherEmbed = {
                color: 0x0099ff,
                title: `🌦️ Weather in ${weatherData.name}, ${weatherData.sys.country}`,
                fields: [
                    {
                        name: '🌡️ Temperature',
                        value: `${weatherData.main.temp}°C`,
                        inline: true
                    },
                    {
                        name: '💧 Humidity',
                        value: `${weatherData.main.humidity}%`,
                        inline: true
                    },
                    {
                        name: '💨 Wind Speed',
                        value: `${weatherData.wind.speed} m/s`,
                        inline: true
                    },
                    {
                        name: '☁️ Conditions',
                        value: weatherData.weather[0].description,
                        inline: true
                    }
                ],
                footer: { text: 'Data from OpenWeatherMap' }
            };

            await message.channel.send({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error('Weather API error:', error);
            message.reply(`Could not fetch weather for ${city}. Please check the city name.`);
        }
    }
}; 