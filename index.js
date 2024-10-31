const restify = require('restify');
const { BotFrameworkAdapter } = require('botbuilder');
const mysql = require('mysql');

// Création du serveur Restify
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\nBot is listening on port ${server.url}`);
});

// Configuration de l'adaptateur Bot Framework
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// DATABASE_URL="mysql://root:root@127.0.0.1:8889/freelance-app?serverVersion=8.0.32&charset=utf8mb4"
// Configuration de la connexion à MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',       // Adresse de la base de données
    user: 'root',      // Nom d'utilisateur de la base de données
    password: 'root',     // Mot de passe de la base de données
    database: 'freelance-app'   // Nom de la base de données
});

// Établissement de la connexion MySQL
connection.connect((error) => {
    if (error) {
        console.error('Erreur de connexion à MySQL:', error);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
});

// Définition de l'endpoint pour recevoir les messages
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Vérifier si le type d'activité est un message
        if (context.activity.type === 'message') {
            // Exemple de requête MySQL
            connection.query('SELECT message FROM chatbot_responses WHERE id = 1', (error, results) => {
                if (error) {
                    console.error('Erreur de requête MySQL:', error);
                    context.sendActivity("Désolé, une erreur est survenue lors de la récupération des données.");
                    return;
                }

                // Envoyer la réponse au message de l'utilisateur
                const message = results[0]?.message || "Aucun message trouvé.";
                context.sendActivity(message);
            });
        } else {
            // Gérer d'autres types d'activité si nécessaire
            context.sendActivity(`[${context.activity.type} event detected]`);
        }
    });
});
