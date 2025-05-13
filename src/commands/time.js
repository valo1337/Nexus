const moment = require('moment-timezone');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'time',
    description: 'Check the current time in a specific timezone or city',
    usage: '!time [timezone/city]',
    category: 'Utility',
    
    async execute(message, args) {
        // If no args, show current UTC time
        if (args.length === 0) {
            const utcTime = moment().utc().format('YYYY-MM-DD HH:mm:ss z');
            return message.reply(`Current UTC time: ${utcTime}`);
        }

        // Join args in case of multi-word city/timezone
        const location = args.join(' ');

        try {
            // Try to find the timezone
            const timezone = moment.tz.zone(location);
            
            if (timezone) {
                const localTime = moment().tz(location);
                
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`Time in ${location}`)
                    .addFields(
                        { name: 'Date', value: localTime.format('YYYY-MM-DD'), inline: true },
                        { name: 'Time', value: localTime.format('HH:mm:ss'), inline: true },
                        { name: 'Timezone', value: localTime.format('z'), inline: true }
                    )
                    .setFooter({ text: 'Powered by moment-timezone' });
                
                return message.reply({ embeds: [embed] });
            } else {
                // If no exact timezone match, suggest alternatives
                const possibleZones = moment.tz.names().filter(tz => 
                    tz.toLowerCase().includes(location.toLowerCase())
                );
                
                if (possibleZones.length > 0) {
                    const zoneList = possibleZones.slice(0, 5).join('\n');
                    return message.reply(`No exact match found. Did you mean one of these?\n${zoneList}`);
                }
                
                return message.reply('Could not find the specified timezone. Try using a valid timezone name like "America/New_York" or "Europe/London".');
            }
        } catch (error) {
            console.error('Time command error:', error);
            message.reply('An error occurred while fetching the time.');
        }
    }
}; 