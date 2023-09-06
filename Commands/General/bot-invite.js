const { SlashCommandBuilder, PermissionFlagsBits, OAuth2Scopes, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Create a custom invite for this bot.')
    .addStringOption(option => option.setName('permissions').setDescription('The permissions you want to add the bot (presets).').addChoices(
        { name: `View server (no mod permissions)`, value: `517547088960` },
        { name: `Basic Moderation (Manage roles, messages, emojis)`, value: `545195949136` },
        { name: `Advanced Moderation (Manage Server)`, value: `545195949174` },
        { name: `Administrator (every permission)`, value: `8` },
    ).setRequired(true)),
    async execute (interaction, client) {
        
        const { options } = interaction;
        const perms = options.getString('permissions');

        const link = client.generateInvite({
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
            permissions: [
                perms
            ],
        });
        const embed = new EmbedBuilder()
        .setColor("Blurple")

        if (perms !== '8') embed.setDescription(`🔗 I have generated an invite link using the permissions you selected! To view the specific permissions, click on the invite and continue with the selected server. \n \n⚠️ This bot may require **admin permissions** for to fully fuction! By not selecting the highest permissions for your server, you risk not being able to use all of this bots features. \n \n> ${link}`)
        else embed.setDescription(`🔗 I have generated an invite link using the permissions you selected! To view the specific permissions, click on the invite and continue with the selected server. \n \n> ${link}`)

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}