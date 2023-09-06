const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const welcomeSchema = require('../../Models/Welcome.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-setup')
        .setDescription("Setup a welcome message for your Discord server.")
        .setDMPermission(false)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription("Please indicate the channel where you would like the welcome messages to be sent.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        ),
    async execute(interaction) {

        if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return await interaction.reply({ content: "The welcome system cannot be set up because you do not have the necessary permissions to do so.", ephemeral: true })

        const channel = interaction.options.getChannel('channel')

        welcomeSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {

            if (!data) {
                welcomeSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                });
            } else {
                await interaction.reply({
                    content: 'You have a welcome message system in place. To restart it, use the `/welcome-disable` command.',
                    ephemeral: true
                });
                return;
            }   

            // Auth System Setup Message
            await interaction.reply({
                content: `The welcome message system has been successfully implemented within the ${channel}.`,
                ephemeral: true
            })
        })
    }
}