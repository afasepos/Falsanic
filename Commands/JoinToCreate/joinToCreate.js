const { SlashCommandBuilder, Client, PermissionFlagsBits, ChannelType, GuildVoice } = require("discord.js");
const schema = require("../../Models/join-to-create.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup-jointocreate")
    .setDescription("Setup the join to create system.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(option =>
        option.setName("channel")
        .setDescription("Select the channel of the join to create system.")
        .addChannelTypes(ChannelType.GuildVoice)
        .setRequired(true)
    )
    .addNumberOption(option =>
        option.setName("userlimit")
        .setDescription("The user limit of every join to create channel.")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(true)
    ),

    async execute(interaction) {
        const { guild, options } = interaction;
        const channel = options.getChannel("channel");
        const userLimit = options.getNumber("userlimit");
    
        let data = schema.findOne({ Channel: channel.id });
        let joinVoiceChannelId = data._conditions.channel;
    
        if (joinVoiceChannelId !== data) {
          data = await schema.create({
            Guild: guild.id,
            Channel: channel.id,
            UserLimit: userLimit
          })
    
          await data.save();
          interaction.reply({ content: "The join to create system was set up successfully.", ephemeral: true });
        }
    }
}