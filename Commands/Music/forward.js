const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forward")
        .setDescription("Forward seconds in a song.")
        .addIntegerOption(option =>
            option.setName("seconds")
                .setDescription("Amount of seconds to forward. (10 = 10s).")
                .setMinValue(0)
                .setRequired(true)
        ),
        async execute(interaction) {
            const { options, member, guild } = interaction;
            const seconds = options.getInteger("seconds");
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

                const queue = await client.distube.getQueue(VoiceChannel);

                if (!queue) {
                    embed.setColor("Red").setDescription("There is no active queqe at the moment.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
                
                await queue.seek(queue.currentTime + seconds);
                embed.setColor("Blue").setDescription(`⏩ Successfully forwarded the song for \`${seconds}s\`.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });

            } catch (err) {
                console.log(err);

                embed.setColor("Red").setDescription("⛔ | Something went wrong...");   

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
}