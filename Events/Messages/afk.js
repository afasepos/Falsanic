const afkModel = require("../../Models/Afk.js");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        afkModel.findOne({ Guild: message.guild.id, UserID: message.author.id }, async (err, data) => {
            if (data && data.Afk) { // Added a check for data existence
                data.Afk = false;
                data.save();
            }
            return;
        });

        const taggedMembers = message.mentions.users.map(user => user.id); // Fixed property name

        if (taggedMembers.length > 0) {
            taggedMembers.forEach(userID => {
                afkModel.findOne({ Guild: message.guild.id, UserID: userID }, async (err, data) => {
                    if (data && data.Afk) { // Added a check for data existence
                        message.reply("This user is currently **afk**.");
                    }
                    return;
                });
            });
        }
    }
};
