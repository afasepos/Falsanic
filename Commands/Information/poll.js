const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a poll and sent it on a certain channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option.setName("description")
                .setDescription("Describe the poll.")
                .setRequired(true)
        )
        .addChannelOption(option => 
            option.setName("channel")
                .setDescription("Where do you want to send the poll to?")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
        async execute(interaction) {
            const { options } = interaction;

            const channel = options.getChannel("channel");
            const description = options.getString("description");

            const embed = new EmbedBuilder()
                .setColor("Gold")
                .setDescription(description)
                .setTimestamp(); 

                try {
                    const m = await channel.send({ embeds: [embed] });
                    await m.react("✅"); // Unicode representation of check mark
                    await m.react("❌"); // Unicode representation of cross mark
                    await interaction.reply({ content: "The poll was successfully sent to the channel.", ephemeral: true });
                } catch (err) {
                    console.log(err);
                }
        }
}