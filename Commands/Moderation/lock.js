const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const LockSchema = require("../../Models/Lock.js");
const ms = require("ms"); // ms package is required for this command

module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel for a specific time.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option => 
    option.setName("time")
    .setDescription("Specify the time for the channel lockdown: (1m, 1h, 1d).")
    .setRequired(false)
    )
    .addStringOption(option => 
        option.setName("reason")
        .setDescription("Specify the reason for the channel lockdown.")
        .setRequired(false)
        ),

        async execute(interaction, client) {
            const { guild, channel, options } = interaction;

            const Reason = options.getString("reason") || "No reason specified.";
            const time = options.getString("time") || "No time specified / infinite."

            const embed = new EmbedBuilder()

            if(!channel.permissionsFor(guild.id).has("SendMessages"))
            return interaction.reply({
                embeds: [
                    embed.setColor("Red").setDescription("This channel is already locked.")
                ],
                ephemeral: true
            })

            channel.permissionOverwrites.edit(guild.id, {
                SendMessages: false,
            })

            interaction.reply({ embeds: [
                embed.setColor("Red").setDescription(`This channel is now locked for ${time} with reason ${Reason}.`)
            ]
            })
            const Time = options.getString("time");
            if (Time) {
                const ExpireDate = Date.now() + ms(Time);
                LockSchema.create({
                    GuildID: guild.id,
                    ChannelD: channel.id,
                    Time: ExpireDate,
                });

                setTimeout(async () => {
                    channel.permissionOverwrites.edit(guild.id, {
                        SendMessages: null,
                    });

                    interaction.editReply({ embeds: [
                        embed.setColor("Green").setDescription(`The lockdown with reason ${Reason} and length ${time} has been cancelled.`)
                    ]
                    })
                    .catch(() => {});

                    await LockSchema.deleteOne({ ChannelD: channel.id })
                }, ms(Time))
            }
        }
}