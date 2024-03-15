const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your actual tokens and API endpoint
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const instagramAPIEndpoint = 'YOUR_INSTAGRAM_API_ENDPOINT';

// Create a new Telegram bot instance
const bot = new TelegramBot(token, { polling: true });

// Command handler function to fetch Instagram data
async function handleInstagramCommand(msg) {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get(instagramAPIEndpoint);
        const instagramData = response.data;
        bot.sendMessage(chatId, `Here is the latest Instagram data: ${JSON.stringify(instagramData)}`);
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
        bot.sendMessage(chatId, 'Failed to fetch Instagram data. Please try again later.');
    }
}

// Command handler function to send a welcome message
function handleStartCommand(msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to the Instagram Telegram Bot. Use /instagram to get the latest Instagram data.');
}

// Command handler function to send help message
function handleHelpCommand(msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Commands:\n/instagram - Get the latest Instagram data\n/help - Show this help message');
}

// Middleware to handle unsupported commands
function handleUnsupportedCommand(msg) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Unsupported command. Use /help to see available commands.');
}

// Register command handlers
bot.onText(/\/instagram/, handleInstagramCommand);
bot.onText(/\/start/, handleStartCommand);
bot.onText(/\/help/, handleHelpCommand);

// Middleware to handle unsupported commands
bot.on('message', handleUnsupportedCommand);

// Error handling middleware
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

// Poll Instagram data every hour
setInterval(async () => {
    try {
        const response = await axios.get(instagramAPIEndpoint);
        const instagramData = response.data;
        console.log('Instagram data:', instagramData);
    } catch (error) {
        console.error('Error fetching Instagram data:', error);
    }
}, 3600000);
