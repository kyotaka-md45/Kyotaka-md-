// Modules et dépendances nécessaires
const pkg = require("./package.json");
const { monospace, italic, quote } = require("@mengkodingan/ckptw");

// Configuration
global.config = {
    // Informations de base sur le bot
    bot: {
        name: "KYOTAKA-md", // Nom du bot
        prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i, // Caractères autorisés pour les préfixes de commande
        phoneNumber: "2250575130788", // Numéro de téléphone du bot (optionnel si utilisation du QR code)
        thumbnail: "", // Image miniature du bot
        website: "", // Lien du groupe WhatsApp du bot
        groupJid: "", // JID du groupe du bot (optionnel si "requireBotGroupMembership" est désactivé)

        // Configuration de l'authentification de session du bot
        authAdapter: {
            adapter: "default", // Choix de l'adaptateur: 'default', 'mysql', 'mongo', 'firebase'

            // Configuration MySQL
            mysql: {
                host: "localhost:3306", // Nom d'hôte
                user: "Pharouk", // Nom d'utilisateur
                password: "kyo45", // Mot de passe
                database: "kyotaka-md" // Nom de la base de données
            },

            // Configuration MongoDB
            mongodb: {
                url: "mongodb://localhost:27017/ckptw-wabot" // URL de connexion
            },

            // Configuration Firebase
            firebase: {
                tableName: "Kyotaka", // Nom de la table
                session: "state" // Nom de la session
            }
        }
    },

    // Messages personnalisés du bot pour certaines situations
    msg: {
        admin: quote("⛔ Cette commande est réservée aux administrateurs du groupe !"), // Message pour les commandes réservées aux admins
        banned: quote("⛔ Vous ne pouvez pas exécuter cette commande car vous avez été banni par le propriétaire !"), // Message pour les utilisateurs bannis
        botAdmin: quote("⛔ Impossible d'exécuter cette commande car le bot n'est pas administrateur du groupe !"), // Message si le bot n'est pas admin
        botGroupMembership: quote("⛔ Vous ne pouvez pas exécuter cette commande car vous n'êtes pas membre du groupe du bot ! Tapez '/botgroup' pour obtenir le lien du groupe."), // Message si l'utilisateur ne fait pas partie du groupe
        coin: quote("⛔ Vous ne pouvez pas exécuter cette commande car vous n'avez pas assez de pièces !"), // Message si l'utilisateur manque de pièces
        cooldown: quote("🔄 Cette commande est en cooldown, veuillez patienter..."), // Message de cooldown
        group: quote("⛔ Cette commande ne peut être utilisée que dans un groupe !"), // Message pour les commandes de groupe uniquement
        owner: quote("⛔ Cette commande est réservée au propriétaire du bot !"), // Message pour les commandes réservées au propriétaire
        premium: quote("⛔ Vous ne pouvez pas exécuter cette commande car vous n'êtes pas un utilisateur Premium !"), // Message pour les utilisateurs non Premium
        private: quote("⛔ Cette commande ne peut être utilisée qu'en message privé !"), // Message pour les commandes en privé uniquement
        restrict: quote("⛔ Cette commande a été restreinte pour des raisons de sécurité !"), // Message de restriction de commande

        watermark: `@${pkg.name} / v${pkg.version}`, // Watermark avec le nom et la version du bot
        footer: italic("bot en période de test 🫠"), // Footer des messages du bot
        readmore: "".repeat(4001), // Texte "Lire la suite"
        note: "", // Note

        wait: quote("🔄 Veuillez patienter..."), // Message d'attente
        notFound: quote("❎ Aucun résultat trouvé ! Réessayez plus tard."), // Message quand rien n'est trouvé
        urlInvalid: quote("❎ URL invalide !") // Message en cas d'URL invalide
    },

    // Informations du propriétaire du bot
    owner: {
        name: "", // Nom du propriétaire du bot
        organization: "", // Organisation du propriétaire
        id: "2250575130788", // Numéro de téléphone du propriétaire
        co: [""] // Co-propriétaires du bot
    },

    // Clés API
    APIKey: {
        nexoracle: "free_key@maher_apis", // Clé API fournie par Maher Zubair
        ssateam: "root" // Clé API fournie par Fainshe
    },

    // Configuration des stickers du bot
    sticker: {
        packname: "", // Nom du pack de stickers
        author: "" // Auteur du pack de stickers
    },

    // Paramètres du système du bot
    system: {
        alwaysOnline: false, // Le bot reste toujours en ligne
        autoMention: true, // Le bot mentionne automatiquement une personne dans ses réponses
        autoRead: false, // Le bot lit automatiquement les messages
        autoTypingOnCmd: true, // Afficher "en train d'écrire..." lors du traitement d'une commande
        cooldown: 10 * 1000, // Délai entre deux commandes (ms)
        port: 3000, // Port (si le bot est utilisé avec un serveur)
        restrict: false, // Restreindre l'accès aux commandes
        requireBotGroupMembership: false, // Exiger d'être membre du groupe du bot
        selfOwner: false, // Le bot est son propre propriétaire
        selfReply: true, // Le bot peut répondre à ses propres messages
        timeZone: "Afrique/Abidjan", // Fuseau horaire du bot
        useCoin: false, // Activer le système de pièces
        usePairingCode: false, // Utiliser un code de jumelage pour la connexion
        useServer: false // Faire fonctionner le bot avec un serveur
    }
};
