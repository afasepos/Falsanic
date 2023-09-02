const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option => 
        option.setName("target")
        .setDescription("Select the user to be banned.")
        .setRequired(true)
        )
    .addStringOption(option =>
        option.setName("reason")
        .setDescription("Type the reason to ban this user(if any).")
    ),
    
    async execute(interaction) {
        const {channel, options} = interaction;

        const user = options.getUser("target");
        const reason = options.getString("reason") || "No reason provided.";

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
        .setDescription(`You can't take action on ${user.username} since they have a higher role than you.`)
        .setColor(0xc72c3b);

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({embeds: [errEmbed], ephemeral: true});

        await member.ban({reason});
        
        const embed = new EmbedBuilder()
        .setDescription(`Successfully banned ${user} with reason: ${reason}.`)
        .setColor(0x5fb041)
        .setTimestamp()

        await interaction.reply({
            embeds: [embed]
        });
    }
}