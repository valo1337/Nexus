module.exports = {
    prefix: '!',
    token: process.env.DISCORD_TOKEN,
    
    // Server Management Settings
    welcomeChannel: null, // Set this to a specific channel ID
    autoRoles: [], // List of role IDs to assign to new members
    
    // Utility Settings
    weatherApiKey: process.env.WEATHER_API_KEY,
    
    // Music Settings
    maxQueueSize: 50,
    leaveOnEndTimeout: 60000, // 1 minute
} 