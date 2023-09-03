const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const logSchema = require("../../Models/Logs.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete-logs')
        .setDescription('Delete a logging channel from the database.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

        async execute(interaction) {
            const { channel, guildId, options } = interaction;

            const embed = new EmbedBuilder();

            try {
                const data = logSchema.findOne({ GuildID: guildId });
                if (!data) {
                    embed.setDescription('You must setup a log channel to delete a log channel.')
                    .setColor('Green')
                    .setTimestamp();
                } else if (data) {
                    await logSchema.findOneAndDelete({ GuildId: guildId });

                    embed.setDescription('Log channel has been successfully deleted!')
                    .setColor('Green')
                    .setTimestamp();
                }
            } catch (error) {
                embed.setDescription('Something went wrong. Please contact the bot developer.')
                .setColor('Red')
                .setTimestamp();
                console.log(error)
            }

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
}