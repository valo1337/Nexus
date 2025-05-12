# 🤖 Nexus: Your All-in-One Discord Companion

![Nexus Bot Banner](https://img.shields.io/badge/Nexus-Discord%20Bot-blue?style=for-the-badge&logo=discord)

## 🌟 Interactive Discord Bot Experience

Nexus is not just another Discord bot - it's your server's ultimate companion! Designed to make server management, utility tasks, and music enjoyment seamless and fun.

## ✨ Feature Showcase

### 🛡️ Server Management
- 👥 Automatic role assignment
- 🎉 Customizable welcome messages
- 🚫 Moderation tools (kick, ban)
- 🧹 Message clearing

### 🧰 Utility Powerhouse
- 🌦️ Real-time weather updates
- 📊 Server information
- 🏓 Latency checks
- 📝 Interactive polls
- ⏰ Reminder system

### 🎵 Music Magic
- 🎧 YouTube song playback
- 📋 Advanced queue management
- ⏯️ Playback controls
- 🔍 Song search

## 🚀 Quick Start Guide

### Prerequisites
Before diving in, ensure you have:
- 💻 [Node.js](https://nodejs.org/) (v16 or higher)
- 🤖 [Discord Developer Account](https://discord.com/developers/applications)
- 🌐 [OpenWeatherMap API Key](https://openweathermap.org/api) (Optional)

### 1. Clone the Repository 🐑
```bash
git clone https://github.com/valo1337/Nexus.git
cd Nexus
```

### 2. Install Dependencies 📦
```bash
npm install
```

### 3. Bot Setup Wizard 🧙‍♂️

#### Step 1: Create Discord Application
1. Visit [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name your app "Nexus"
4. Go to the "Bot" section
5. Click "Add Bot."
6. 🔑 Copy your Bot Token (KEEP THIS SECRET!)

#### Step 2: Generate Bot Invite Link
1. In "OAuth2" > "URL Generator":
   - Select scopes: `bot`, `applications.commands`
   - Select bot permissions: `Administrator`
2. 🔗 Copy the generated invite link
3. Open the link in the browser to add to your server

### 4. Environment Configuration 🔧
Create a `.env` file in the project root:
```env
# Your Discord Bot Token (REQUIRED)
DISCORD_TOKEN=your_discord_bot_token

# Optional: Weather API for weather commands
WEATHER_API_KEY=your_openweathermap_api_key
```

### 5. Running the Bot 🤖

#### Development Mode
```bash
npm run dev
```
- Uses `nodemon` for auto-restart
- Great for testing and development

#### Production Mode
```bash
npm start
```
- Standard run mode
- Recommended for server deployment

## 🎮 Command Playground

### 🛡️ Server Management
- `!kick @user [reason]`: Remove a user
- `!ban @user [reason]`: Ban a troublemaker
- `!clear <number>`: Bulk delete messages

### 🧰 Utility Commands
- `!ping`: Check the bot's response time
- `!weather <city>`: Get instant weather
- `!poll "Question" "Option1" "Option2"`: Create polls
- `!remind <time> <message>`: Set reminders
- `!serverinfo`: Server health check

### 🎵 Music Commands
- `!play <song/url>`: Start the music
- `!pause`: Freeze the groove
- `!resume`: Continue jamming
- `!skip`: Next track, please!
- `!queue`: Show upcoming songs
- `!stop`: End the music session

## 🛠️ Customization Central

Modify `src/config.js` to personalize Nexus:
- Change command prefix
- Set welcome channel
- Configure auto-roles
- Adjust music player settings

## 🤝 Community Contributions

1. 🍴 Fork the repository
2. 🌿 Create a feature branch
3. 💡 Commit changes
4. 🚀 Push to branch
5. 📬 Open Pull Request

## 📋 Troubleshooting Companion

### Common Issues
- ❗ Bot offline? Check token
- 🔒 Permission problems? Verify bot permissions
- 🌐 API not working? Confirm API keys

### Debugging Tips
- Check the console for error messages
- Verify `.env` file configuration
- Ensure all dependencies are installed

## 🌐 Connect & Collaborate

🔗 Project Link: [https://github.com/valo1337/Nexus](https://github.com/valo1337/Nexus)

---
