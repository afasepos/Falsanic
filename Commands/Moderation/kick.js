const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the Discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
            option.setName("target")
            .setDescription("Select the user to be kicked.")
            .setRequired(true)
        )
    .addStringOption(option => 
           option.setName("reason")
           .setDescription("Reason for the kick.")
        ),
        
    async execute(interaction) {
        const {channel, options} = interaction;

        const user = options.getUser("target");
        const reason = options.getString("reason") || "No reason provided.";
        
        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`You can't take action on ${user.username} since the user has higher role than you.`)
            .setColor(0xc72c3b)

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
       
        await member.kick(reason);

        const embed = new EmbedBuilder()
             .setDescription(`Successfully kicked the ${user} with reason: ${reason}.`);

        await interaction.reply({
            embeds: [embed],
        });     
    }
}