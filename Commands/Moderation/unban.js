const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the discord server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName("userid")
            .setDescription("Type the Discord User you want to unban.")
            .setRequired(true)
        ),
    
    async execute(interaction) {
        const { options } = interaction;

        const user = options.getUser("userid");

        try {
            await interaction.guild.members.unban(user);

            const embed = new EmbedBuilder()
                .setDescription(`Successfully unbanned user ${user.tag} from the guild.`)
                .setColor(0x5fb041)
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
            });
        } catch(err) {
            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setDescription(`An error occurred while trying to unban the user.`)
                .setColor(0xc72c3b);
            
            interaction.reply({ embeds: [errEmbed], ephemeral: true });    
        }
    }
};
