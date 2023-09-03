const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const logSchema = require("../../Models/Logs.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-logs')
        .setDescription('Set up logging channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('channel for logs')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        ),

        async execute(interaction) {
            const {channel, guildId, options} = interaction;

            const logChannel = options.getChannel('channel') || channel;
            const embed = new EmbedBuilder();

            try {
                const data = logSchema.findOne({ GuildID: guildId});
                if (!data) {
                    await logSchema.create({
                        GuildId: guildId,
                        ChannelId: logChannel.id,
                    });

                    embed.setDescription('Setup the log channel.')
                    .setColor('Green')
                    .setTimestamp();
                } else if (data) {
                    await logSchema.findOneAndDelete({GuildId: guildId})
                    await logSchema.create({
                        GuildId: guildId,
                        ChannelId: logChannel.id,
                    });

                    embed.setDescription('The log channel was successfully setupped.')
                    .setColor('Green')
                    .setTimestamp();
                }
            } catch (error) {
                embed.setDescription('Something went wrong. Please contact the bot developer.')
                .setColor('Red')
                .setTimestamp();
                console.log(error)
            }

            return interaction.reply({embeds: [embed], ephemeral: true})
            
        }
}