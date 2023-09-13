const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar of a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get the avatar of.')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const embed = {
            title: `${user.username}'s avatar`,
            image: {
                url: user.avatarURL({ size: 4096, dynamic: true })
            }
        };

        await interaction.reply({ embeds: [embed] });
    },
};