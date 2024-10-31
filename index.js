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

// Configuration de la connexion à MySQL
const connection = mysql.createConnection({
    host: 'localhost',       // Adresse de la base de données
    user: 'votre_nom_utilisateur',      // Nom d'utilisateur de la base de données
    password: 'votre_mot_de_passe',     // Mot de passe de la base de données
    database: 'votre_base_de_donnees'   // Nom de la base de données
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
