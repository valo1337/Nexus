const { QueryType } = require('discord-player');
const ytdl = require('ytdl-core');

module.exports = {
    client: null,
    player: null,
    config: null,

    init(client, player, config) {
        this.client = client;
        this.player = player;
        this.config = config;

        // Event listeners for music player
        player.on('trackStart', (queue, track) => {
            queue.metadata.channel.send(`🎵 Now playing **${track.title}**!`);
        });

        player.on('queueEnd', (queue) => {
            queue.metadata.channel.send('Queue finished. Disconnecting...');
            queue.destroy();
        });
    },

    handleCommand(command, message, args) {
        switch(command) {
        case 'play':
            this.playCommand(message, args);
            return true;
        case 'pause':
            this.pauseCommand(message);
            return true;
        case 'resume':
            this.resumeCommand(message);
            return true;
        case 'skip':
            this.skipCommand(message);
            return true;
        case 'queue':
            this.queueCommand(message);
            return true;
        case 'stop':
            this.stopCommand(message);
            return true;
        default:
            return false;
        }
    },

    async playCommand(message, args) {
        if (!args.length) {
            return message.reply('Please provide a song name or YouTube URL.');
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to play music!');
        }

        const query = args.join(' ');

        try {
            const { track } = await this.player.play(voiceChannel, query, {
                nodeOptions: {
                    metadata: {
                        channel: message.channel,
                        requestedBy: message.author
                    },
                    selfDeaf: true,
                    volume: 50,
                    leaveOnEmpty: true,
                    leaveOnEnd: this.config.leaveOnEndTimeout
                },
                searchEngine: QueryType.AUTO
            });

            // Optional: Send track details
            const embed = {
                color: 0x0099ff,
                title: 'Added to Queue',
                description: `**${track.title}**`,
                fields: [
                    { name: 'Channel', value: track.author, inline: true },
                    { name: 'Duration', value: track.duration, inline: true }
                ],
                thumbnail: { url: track.thumbnail }
            };

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Play command error:', error);
            message.reply('Error playing the track. Please try again.');
        }
    },

    pauseCommand(message) {
        const queue = this.player.nodes.get(message.guild.id);
        
        if (!queue) {
            return message.reply('No music is currently playing.');
        }

        queue.node.pause();
        message.channel.send('⏸️ Paused the music.');
    },

    resumeCommand(message) {
        const queue = this.player.nodes.get(message.guild.id);
        
        if (!queue) {
            return message.reply('No music is currently paused.');
        }

        queue.node.resume();
        message.channel.send('▶️ Resumed the music.');
    },

    skipCommand(message) {
        const queue = this.player.nodes.get(message.guild.id);
        
        if (!queue) {
            return message.reply('No music is currently playing.');
        }

        queue.node.skip();
        message.channel.send('⏭️ Skipped the current track.');
    },

    queueCommand(message) {
        const queue = this.player.nodes.get(message.guild.id);
        
        if (!queue || !queue.isPlaying()) {
            return message.reply('No music is currently playing.');
        }

        const tracks = queue.tracks.map((track, index) => 
            `${index + 1}. **${track.title}** - ${track.duration}`
        );

        const currentTrack = queue.currentTrack;
        const queueEmbed = {
            color: 0x0099ff,
            title: 'Music Queue',
            description: `**Now Playing:** ${currentTrack.title} - ${currentTrack.duration}\n\n` +
                         (tracks.length ? 'Upcoming Tracks:\n' + tracks.slice(0, 10).join('\n') : 'No upcoming tracks'),
            footer: { text: `Total tracks in queue: ${tracks.length}` }
        };

        message.channel.send({ embeds: [queueEmbed] });
    },

    stopCommand(message) {
        const queue = this.player.nodes.get(message.guild.id);
        
        if (!queue) {
            return message.reply('No music is currently playing.');
        }

        queue.delete();
        message.channel.send('⏹️ Stopped the music and cleared the queue.');
    }
}; 