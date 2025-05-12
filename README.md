# Nexus Discord Bot

A feature rich Discord bot named Nexus, providing server management, utility, and music playback capabilities.

## Features

### Server Management
- Automatic role assignment
- Welcome messages
- Kick and ban users
- Clear messages

### Utility Commands
- Weather information
- Server info
- Ping latency
- Create polls
- Set reminders

### Music Playback
- Play songs from YouTube
- Queue management
- Pause, resume, skip tracks
- Show current queue

## Prerequisites

- Node.js (v16 or higher)
- Discord Bot Token
- OpenWeatherMap API Key (optional)

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/nexus-discord-bot.git
cd nexus-discord-bot
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with your tokens
```
DISCORD_TOKEN=your_discord_bot_token
WEATHER_API_KEY=your_openweathermap_api_key
```

## Usage

Start the bot:
```bash
npm start
```

### Commands

#### Server Management
- `!kick @user [reason]`: Kick a user
- `!ban @user [reason]`: Ban a user
- `!clear <number>`: Delete recent messages

#### Utility
- `!ping`: Check bot latency
- `!weather <city>`: Get current weather
- `!poll <question> <option1> <option2> ...`: Create a poll
- `!remind <time><unit> <message>`: Set a reminder
- `!serverinfo`: Display server details

#### Music
- `!play <song/url>`: Play a song
- `!pause`: Pause current track
- `!resume`: Resume paused track
- `!skip`: Skip current track
- `!queue`: Show current queue
- `!stop`: Stop playback and clear queue

## Configuration

Modify `src/config.js` to customize Nexus bot behavior:
- Change command prefix
- Set welcome channel
- Configure auto-roles
- Adjust music player settings

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License 