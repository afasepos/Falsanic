const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, GuildCategory } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("create-channel")
    .setDescription("Create a Discord channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option => 
        option.setName("channeltype")
        .setDescription("Set the type of the channel.")
        .setRequired(true)
        .addChoices(
            { name: "Text Channel", value: "textchannel" },
            { name: "Voice Channel", value: "voicechannel" }
        )
        )
        .addStringOption(option =>
        option.setName("channelname")
        .setDescription("Set the name of the channel.")
        .setRequired(true)
        )
        .addChannelOption(option =>
        option.setName("parent")
        .setDescription("Set the parent of the channel.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
        option.setName("permission-role")
        .setDescription("The permission roles for the channel.")
        .setRequired(true)
        )
        .addRoleOption(option =>
        option.setName("everyone")
        .setDescription("The permission of role everyone.")
        .setRequired(true)
        ),

        async execute(interaction) {
            const { guild, member, options } = interaction;
        
            const { ViewChannel, ReadMessageHistory, SendMessages, Connect, Speak } = PermissionFlagsBits;
        
            const channeltype = options.getString("channeltype");
            const channelname = options.getString("channelname");
            const category = options.getChannel("parent");
            const permissions = options.getRole("permission-role");
            const everyone = options.getRole("everyone");
        
            if (channeltype === "textchannel") {
                await guild.channels.create({
                    name: `${channelname}`,
                    type: ChannelType.GuildText,
                    parent: category, // Use 'category' instead of 'parent'
        
                    permissionOverwrites: [
                        {
                            id: permissions,
                            allow: [ViewChannel, SendMessages, ReadMessageHistory]
                        },
                        {
                            id: everyone,
                            deny: [ViewChannel, SendMessages, ReadMessageHistory]
                        }
                    ]
                });
            }
        
            if (channeltype === "voicechannel") {
                await guild.channels.create({
                    name: `${channelname}`,
                    type: ChannelType.GuildVoice,
                    parent: category, // Use 'category' instead of 'parent'
        
                    permissionOverwrites: [
                        {
                            id: permissions,
                            allow: [ViewChannel, Connect, Speak]
                        },
                        {
                            id: everyone,
                            deny: [ViewChannel, Connect, Speak]
                        }
                    ]
                });
            }
        
            await interaction.reply({ content: "The channel was successfully created.", ephemeral: true });
        }        
}