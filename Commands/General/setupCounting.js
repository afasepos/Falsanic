const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionFlagsBits, Guild } = require("discord.js");
const countingSchema = require("../../Models/Counting.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("counting")
    .setDescription("Configure the counting system.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand(subcommand =>
        subcommand.setName("setup")
        .setDescription("Set up the counting system.")
        .addChannelOption(option => 
        option.setName("channel")
        .setDescription("Set the channel to listen for counting.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
        )
        )
        .addSubcommand(subcommand =>
        subcommand.setName("mute")
        .setDescription("Mute a user from a counting channel.")
        .addUserOption(option =>
        option.setName("user")
        .setDescription("Select the user you want to mute.")
        .setRequired(true)
        )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("unmute")
            .setDescription("Unmute a user from a counting channel.")
            .addUserOption(option =>
            option.setName("user")
            .setDescription("Select the user you want to unmute.")
            .setRequired(true)
            )
            ),

            async execute(interaction) {
                const { options, guildId, guild, member } = interaction;

                const subcommand = options.getSubcommand()

                const channel = options.getChannel("channel")
                const user = options.getUser("user")

                const errEmbed = new EmbedBuilder()
                .setDescription("An error occured. Please try again or contact the bot developer.")
                .setColor("Red")
                .setTimestamp()

                switch(subcommand) {
                    case "setup":
                        countingSchema.findOne({ GuildID: guildId }, async (err, data) => {
                            if(!data) {
                            await countingSchema.create({
                                GuildID: guildId,
                                Channel: channel.id,
                                Count: 1,
                                LastPerson: ""
                        });
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`The counting system was successfully set up in ${channel}.`)
                                .setColor("#FF5599")
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })

                    } else if (!data) {
                        data.Channel = channel.id
                        data.save()

                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`Successfully replaced old channel with  ${channel}.`)
                                .setColor("#FF5599")
                                .setTimestamp()
                            ],
                            ephemeral: true
                        })
                    }
                    if (err) {
                        return interaction.reply({
                            embeds: [errEmbed],
                            ephemeral: true
                        })
                    }
                });
                break;
                case "mute":
                    countingSchema.findOne({ GuildID: guildId }, async (err, data) => {
                        if(!data) {
                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setDescription("You need to set up the counting system on the server first.")
                                    .setColor("#FF5599")
                                    .setTimestamp()
                                ],
                                ephemeral: true
                            })
                        } else if (data) {
                            const ch = guild.channels.cache.get(data.Channel)

                            ch.permissionOverwrites.edit(user.id, { SendMessages: false });

                            return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setFooter({ text: `${member.user.tag}`, iconURL: member.displayAvatarURL() })
                                    .setDescription(`You have successfully muted ${user}.`)
                                    .setColor("#FF5599")
                                    .setTimestamp()
                                ],
                                ephemeral: true
                            })
                        }
                        if (err) {
                            return interaction.reply({ embeds: [errEmbed], ephemeral: true })
                        }
                    })
                    break;
                    case "unmute":
                        countingSchema.findOne({ GuildID: guildId }, async (err, data) => {
                            if(!data) {
                                return interaction.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setDescription("You need to set up the counting system on the server first.")
                                        .setColor("#FF5599")
                                        .setTimestamp()
                                    ],
                                    ephemeral: true
                                })
                            } else if (data) {
                                const ch = guild.channels.cache.get(data.Channel)
    
                                ch.permissionOverwrites.edit(user.id, { SendMessages: true });
    
                                return interaction.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setFooter({ text: `${member.user.tag}`, iconURL: member.displayAvatarURL() })
                                        .setDescription(`You have successfully unmuted ${user}.`)
                                        .setColor("#FF5599")
                                        .setTimestamp()
                                    ],
                                    ephemeral: true
                                })
                            }
                            if (err) {
                                return interaction.reply({ embeds: [errEmbed], ephemeral: true })
                            }
                        })    
                        break;
            }                                     
}
}