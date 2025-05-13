const axios = require('axios');

module.exports = {
    client: null,
    config: null,

    init(client, config) {
        this.client = client;
        this.config = config;
    },

    handleCommand(command, message, args) {
        switch(command) {
        case 'ping':
            this.pingCommand(message);
            return true;
        case 'weather':
            this.weatherCommand(message, args);
            return true;
        case 'poll':
            this.createPoll(message, args);
            return true;
        case 'remind':
            this.setReminder(message, args);
            return true;
        case 'serverinfo':
            this.serverInfoCommand(message);
            return true;
        default:
            return false;
        }
    },

    pingCommand(message) {
        const sent = Date.now();
        message.reply('Pong!').then(msg => {
            const timeTaken = Date.now() - sent;
            msg.edit(`Pong! Latency is ${timeTaken}ms.`);
        });
    },

    async weatherCommand(message, args) {
        if (args.length === 0) {
            return message.reply('Please provide a city name.');
        }

        const city = args.join(' ');
        try {
            const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: city,
                    appid: this.config.weatherApiKey,
                    units: 'metric'
                }
            });

            const weather = response.data;
            const embed = {
                color: 0x0099ff,
                title: `Weather in ${weather.name}, ${weather.sys.country}`,
                description: `${weather.weather[0].description}`,
                fields: [
                    { name: 'Temperature', value: `${weather.main.temp}°C`, inline: true },
                    { name: 'Feels Like', value: `${weather.main.feels_like}°C`, inline: true },
                    { name: 'Humidity', value: `${weather.main.humidity}%`, inline: true },
                    { name: 'Wind Speed', value: `${weather.wind.speed} m/s`, inline: true }
                ]
            };

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Weather error:', error);
            message.reply('Could not fetch weather information. Please check the city name.');
        }
    },

    async createPoll(message, args) {
        if (args.length < 3) {
            return message.reply('Please provide a poll question and at least two options.');
        }

        const question = args[0];
        const options = args.slice(1);

        const pollEmbed = {
            color: 0x00AE86,
            title: 'Poll',
            description: `**${question}**\n\n` + 
                options.map((option, index) => `${index + 1}️⃣ ${option}`).join('\n')
        };

        const pollMessage = await message.channel.send({ embeds: [pollEmbed] });
        
        // Add reaction buttons for voting
        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(`${i + 1}️⃣`);
        }
    },

    setReminder(message, args) {
        if (args.length < 2) {
            return message.reply('Usage: !remind <time> <message>. Example: !remind 1h Study for exam');
        }

        const timeArg = args[0];
        const reminderMessage = args.slice(1).join(' ');

        // Parse time
        const timeUnit = timeArg.slice(-1);
        const timeValue = parseInt(timeArg.slice(0, -1), 10);
        
        let milliseconds;
        switch(timeUnit) {
        case 'm': milliseconds = timeValue * 60 * 1000; break;
        case 'h': milliseconds = timeValue * 60 * 60 * 1000; break;
        case 'd': milliseconds = timeValue * 24 * 60 * 60 * 1000; break;
        default: 
            return message.reply('Invalid time format. Use m (minutes), h (hours), or d (days).');
        }

        message.reply(`Reminder set for ${timeArg}: ${reminderMessage}`);

        setTimeout(() => {
            message.author.send(`Reminder: ${reminderMessage}`);
        }, milliseconds);
    },

    serverInfoCommand(message) {
        const guild = message.guild;
        const serverEmbed = {
            color: 0x0099ff,
            title: `Server Info: ${guild.name}`,
            thumbnail: { url: guild.iconURL() },
            fields: [
                { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Created At', value: guild.createdAt.toDateString(), inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Total Channels', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'Total Roles', value: `${guild.roles.cache.size}`, inline: true }
            ]
        };

        message.channel.send({ embeds: [serverEmbed] });
    }
}; 