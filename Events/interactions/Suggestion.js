const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const suggestionSchema = require("../../Models/Suggestion.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const { member, guildId, customId, message } = interaction;

        if (!interaction.isButton()) return;

        if (customId == "suggest-accept" || customId == "suggest-decline") {
            if (!member.permissions.has(PermissionFlagsBits.Administrator))
                return interaction.reply({ content: "You do not have permissions to accept or decline a suggestion.", ephemeral: true });

            suggestionSchema.findOne({ GuildID: guildId, MessageID: message.id }, async (err, data) => {
                if (err) throw err;

                if (!data)
                    return interaction.reply({ content: "No data was found.", ephemeral: true });

                const embed = message.embeds[0];

                if (!embed)
                    return interaction.reply({ content: "No data was found.", ephemeral: true });

                switch (customId) {
                    case "suggest-accept":
                        embed.fields[2] = { name: "Status", value: "Accepted", inline: true };
                        const acceptedEmbed = new EmbedBuilder(embed).setColor("Green");

                        await message.edit({ embeds: [acceptedEmbed] });
                        break;
                    case "suggest-decline":
                        embed.fields[2] = { name: "Status", value: "Declined", inline: true };
                        const declinedEmbed = new EmbedBuilder(embed).setColor("Red");

                        await message.edit({ embeds: [declinedEmbed] });
                        break;
                }

                // Interaction was already processed, no need to reply again here
            });
            
            // Interaction reply moved outside the switch statement and the findOne callback
            interaction.reply({ content: "The action was successfully executed.", ephemeral: true });
        }
    }
}
