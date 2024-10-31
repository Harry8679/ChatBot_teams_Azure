const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\nBot is listening on port ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Code pour gérer les messages du bot ici
    });
});
