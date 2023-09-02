const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const TicketSetup = require("../../Models/TicketSetup.js");
const ticketSchema = require("../../Models/Ticket.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
        const { guild, member, customId, channel } = interaction;
        const { ManageChannels, SendMessages } = PermissionFlagsBits;

        if(!interaction.isButton()) return;

        if (!["close", "lock", "unlock", "claim"].includes(customId)) return;

        const docs = await TicketSetup.findOne({ GuildID: guild.id });

        if (!docs) return; 

        if (!guild.members.me.permissions.has((r) => r.id === docs.Handlers))
            return interaction.reply({ content: "I don't have permissions for this.", ephemeral: true });

        const embed = new EmbedBuilder().setColor("Aqua");

        ticketSchema.findOne({ ChannelID: channel.id }, async (err, data) => {
            if (err) throw err;
            if (!data) return;

            const fetchedMember = await guild.members.cache.get(data.MembersID);

            switch (customId) {
                case "close":
                    if (data.closed == true)
                        return interaction.reply({ content: "Ticket is already getting deleted.", ephemeral: true });

                    const transcript = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`,
                    });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });

                    const transcriptEmbed = new EmbedBuilder()
                        .setTitle(`Transcript Type: ${data.Type}\nId: ${data.TicketID}`)
                        .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                        .setTimestamp();

                    const transcriptProcesss = new EmbedBuilder()
                        .setTitle('Saving Transcript...')
                        .setDescription("Ticket will be closed in 10 seconds. Enable DM's for the ticket transcript.")
                        .setColor("Red")
                        .setFooter({ text: `${guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();

                    const res = await guild.channels.cache.get(docs.Transcripts).send({
                        embeds: [transcriptEmbed],
                        files: [transcript],
                    });

                    channel.send({ embeds: [transcriptProcesss] });

                    setTimeout(function () {
                        member.send({
                            embeds: [transcriptEmbed.setDescription(`Access your ticket Transcript: ${res.url}`)]
                        }).catch(() => channel.send('Couldn\'t send transcript to Direct Messages.'));
                        channel.delete();
                    }, 10000);

                    break;

                case "lock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "You don't have permissions to do that.", ephemeral: true });

                    if (data.Locked == false)
                        return interaction.reply({ content: "Ticket is already set to locked.", ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: true });
                    embed.setDescription("The ticket was successfully locked. 🔓");

                    data.MembersID.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: false });
                    });

                    return interaction.reply({ embeds: [embed] });

                case "unlock":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "You don't have permissions to do that.", ephemeral: true });

                    if (data.Locked == false)
                        return interaction.reply({ content: "Ticket is already set to unlocked.", ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
                    embed.setDescription("The ticket was unlocked successfully. 🔓");

                    data.MembersId.forEach((m) => {
                        channel.permissionOverwrites.edit(m, { SendMessages: true });
                    });

                    return interaction.reply({ embeds: [embed] });
                case "claim":
                    if (!member.permissions.has(ManageChannels))
                        return interaction.reply({ content: "You don't have permissions to do that.", ephemeral: true });

                    if (data.Claimed === true)
                        return interaction.reply({ content: `Ticket is already claimed by <@${data.ClaimedBy}>.`, ephemeral: true });

                    await ticketSchema.updateOne({ ChannelID: channel.id }, { Claimed: true, ClaimedBy: true });

                    embed.setDescription(`Ticket was successfully claimed by ${member}.`);

                    interaction.reply({ embeds: [embed] });

                    break;
            }
        });
    }
}