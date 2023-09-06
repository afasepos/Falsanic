const { EmbedBuilder } = require("discord.js");
const welcomeSchema = require("../../Models/Welcome.js");

const welcomeMessages = [
    `Welcome to the server`,
    `Hey there, welcome`,
    `Howdy, glad you're here`,
]

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const guildId = member.guild.id;

        welcomeSchema.findOne({ Guild: guildId }, (err, data) => {
            if (data) {
                const channelId = data.Channel;
                const channel = member.guild.channels.cache.get(channelId);

                if (channel) {
                    const memberUsername = member.user.username;
                    const memberThumbnail = member.user.displayAvatarURL({ size: 256 });

                    const randomMessageIndex = Math.floor(Math.random() * welcomeMessages.length);
                    const randomMessage = welcomeMessages[randomMessageIndex];

                    const userEmbed = new EmbedBuilder()
                        .setTitle(`${memberUsername}`)
                        .setDescription(`${randomMessage}\n\n» | Read the https://discord.com/channels/1069235053000933486/1069235889542287502\n» | Read the Announcements https://discord.com/channels/1069235053000933486/1069235803089281134\n» | Order Here https://discord.com/channels/1069235053000933486/1108699046656352387`)
                        .setImage(memberThumbnail)
                        .setTimestamp()
                        .setFooter({ text: "Welcome to our Discord server. We are so excited to have you join us."})

                    channel.send({
                        embeds: [userEmbed]
                    });
                }
            }
        });
    },
};