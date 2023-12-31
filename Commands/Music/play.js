const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song.")
        .addStringOption(option => 
            option.setName("query")
                .setDescription("Provide the name or url for the song.")
                .setRequired(true)
        ),
        async execute(interaction) {
            const { options, member, guild, channel } = interaction;

            const query = options.getString("query");
            const VoiceChannel = member.voice.channel;

            const embed = new EmbedBuilder();

            if (!VoiceChannel) {
                embed.setColor("Red").setDescription("You must be in a voice channel to execute music commands.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Red").setDescription(`You can't use the music player as it's already active in <#${guild.members.me.voice.channelId}>.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }    

            try {
                
                client.distube.play(VoiceChannel, query, { textChannel: channel, member: member });
                return interaction.reply({ content: "🎵 A request has been received." });

            } catch (err) {
                console.log(err);

                embed.setColor("Red").setDescription("⛔ | Something went wrong...");   

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
}