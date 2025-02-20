const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

function generateInstruction(actions, mediaTypes) {
    if (!actions || !actions.length) return "'actions' requis doivent être spécifiés !";

    let translatedMediaTypes;
    if (typeof mediaTypes === "string") {
        translatedMediaTypes = [mediaTypes];
    } else if (Array.isArray(mediaTypes)) {
        translatedMediaTypes = mediaTypes;
    } else {
        return "'mediaTypes' doit être une chaîne de caractères ou un tableau de chaînes !";
    }

    const mediaTypeTranslations = {
        "audio": "audio",
        "contact": "contact",
        "document": "document",
        "gif": "GIF",
        "image": "image",
        "liveLocation": "localisation en direct",
        "location": "localisation",
        "payment": "paiement",
        "poll": "sondage",
        "product": "produit",
        "ptt": "message vocal",
        "reaction": "réaction",
        "sticker": "sticker",
        "templateMessage": "message modèle",
        "text": "texte",
        "video": "vidéo",
        "viewOnce": "vue unique"
    };

    const translatedMediaTypeList = translatedMediaTypes.map(type => mediaTypeTranslations[type]);

    let mediaTypesList;
    if (translatedMediaTypeList.length > 1) {
        const lastMediaType = translatedMediaTypeList[translatedMediaTypeList.length - 1];
        mediaTypesList = translatedMediaTypeList.slice(0, -1).join(", ") + `, ou ${lastMediaType}`;
    } else {
        mediaTypesList = translatedMediaTypeList[0];
    }

    const actionTranslations = {
        "send": "Envoyer",
        "reply": "Répondre"
    };

    const instructions = actions.map(action => `${actionTranslations[action]}`);
    const actionList = instructions.join(actions.length > 1 ? " ou " : "");

    return `📌 ${actionList} ${mediaTypesList} !`;
}

function generateCommandExample(used, args) {
    if (!used) return "'used' doit être fourni !";

    if (!args) return "'args' doit être fourni !";

    const commandMessage = `Exemple : ${monospace(`${used.prefix + used.command} ${args}`)}`;
    return commandMessage;
}

function generatesFlagInformation(flags) {
    if (typeof flags !== "object" || !flags) return "'flags' doit être un objet !";

    const flagInfo = "Options :\n" +
        Object.entries(flags).map(([flag, description]) =>
            quote(`• ${monospace(flag)} : ${description}`)
        ).join("\n");

    return flagInfo;
}

function generateNotes(notes) {
    if (!Array.isArray(notes)) return "'notes' doit être un tableau de chaînes !";

    const notesInfo = "Remarques :\n" +
        notes.map(note =>
            quote(`• ${note}`)
        ).join("\n");

    return notesInfo;
}

module.exports = {
    generateInstruction,
    generateCommandExample,
    generatesFlagInformation,
    generateNotes
};
