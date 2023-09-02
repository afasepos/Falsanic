const countingSchema = require("../../Models/Counting.js");

const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageCreate",

    async execute(message) {

        const guildId = message.guild.id;

        if(message.author.bot) return;

        if(isNaN(message.content)) return;

        countingSchema.findOne({ GuildID: guildId }, async (err, data) => {
            
            const list = [

                `has done a mistake and ruined it at **${data.Count}**. \New number: \`1\` `,
                `is a loser and messed it up at **${data.Count}**. \New number: \`1\` `
            ]

            if (!data || !data.channel) return;

            if(message.channel.id === data.Channel) {
                if(message.author.id == data.LastPerson || message.content < data.Count || message.content > data.Count) {
                    const random = list[Math.floor(Math.random() * list.length)];

                    data.Count = 1;
                    data.LastPerson = ""
                    data.save();

                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`<@${message.author.id}> ${random}`)
                            .setColor("#FF5599")
                            .setTimestamp()
                        ]
                    }).then(msg => {
                        msg.react("😡")
                    })

                    return message.react("❌")
                }

                if(message.content == 100 && data.Count == 100) {
                    message.react("💯")
                } else {
                    message.react("✅")
                }

                data.Count++
                data.LastPerson = message.author.id
                data.save();

                if (err) {
                    console.log(err)
                }
            }
        })
    }
}