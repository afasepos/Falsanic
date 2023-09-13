const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modname')
        .setDescription('Moderate a user\'s nickname.')
        .addUserOption(option => option.setName("user").setDescription('The user to moderate.').setRequired(true)),
    async execute(interaction) {

        // Check if the user has the BanMembers permission
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return await interaction.reply({ content: `You don't have the permissions to execute this command.`, ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const user = options.getUser('user');

        // Fetch the member from the guild
        const member = await interaction.guild.members.fetch(user.id).catch(err => {});

        if (!member) {
            return await interaction.editReply({ content: `⚠️ The user is not a member of this server.` });
        }

        const tagline = Math.floor(Math.random() * 1000) + 1;

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(`⚒️ I have set ${user.username}'s nickname to Moderated Nickname ${tagline}.`);

        try {
            await member.setNickname(`Moderated Nickname ${tagline}`);
        } catch (e) {
            return await interaction.editReply({ content: `⚠️ I wasn't able to complete this mod name!` });
        }

        await interaction.editReply({ embeds: [embed] });
    }
}
