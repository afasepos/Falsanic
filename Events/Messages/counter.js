const { EmbedBuilder } = require("discord.js");
const countingSchema = require("../../Models/Counting.js");

const messageCounts = new Map();
const cooldowns = new Map();

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const countingData = await countingSchema.findOne({ Guild: message.guild.id });
        if (!countingData) return;

        if (message.channel.id !== countingData.Channel) return;

        const number = parseInt(message.content);

        if (isNaN(number) || number.toString() !== message.content) return;

        const member = message.member;
        const messageCountKey = `${message.guild.id}-${member.id}`;
        const messageCount = messageCounts.get(messageCountKey) || 0;

        if (messageCount >= 10 && !cooldowns.has(messageCountKey)) {
            const cooldownTime = 10 * 1000; // 10 seconds cooldown
            const expirationTime = Date.now() + cooldownTime;
            cooldowns.set(messageCountKey, expirationTime);

            const cooldownEmbed = new EmbedBuilder()
                .setTitle('Cooldown')
                .setDescription(`You have reached the maximum message limit. Please wait ${cooldownTime / 1000} seconds before sending another number.`)
            .addFields({name: 'Last Number was', value: `${countingData.Count}`})
                .setColor('Yellow')
                .setTimestamp()
                .setFooter({ text: 'Cooldown' });

            await message.channel.send({ embeds: [cooldownEmbed], ephemeral: true });
            return;
        }

        if (countingData.Count === 0) {
            if (number !== 1) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle('Incorrect Number')
                    .setDescription('You must type 1 before continuing onto other numbers.')
                    .setTimestamp()
                    .setFooter({ text: `Incorrect Number At` })
                    .setColor('Red');

                await message.channel.send({ embeds: [errorEmbed] });
                return;
            }
        }

        if (number === countingData.Count + 1) {
            countingData.Count++;
            await countingData.save();

            const response = new EmbedBuilder()
                .setTitle(`Current number: ${countingData.Count}`)
                .setColor('Green');

            const reaction = await message.channel.send({ embeds: [response] });
            await reaction.react('✅');

            // Check if the quarter goal has been reached
            if (countingData.Count === Math.floor(countingData.MaxCount / 4)) {
                const quarterGoalEmbed = new EmbedBuilder()
                    .setTitle('Quarter Goal Reached!')
                    .setDescription(`You have reached a quarter of the goal. Keep going! Only ${countingData.MaxCount - countingData.Count} numbers left!`)
                    .setTimestamp()
                    .setFooter({ text: 'Quarter Goal Reached' })
                    .setColor('Blue');

                await message.channel.send({ embeds: [quarterGoalEmbed] });
            }

            // Check if the halfway goal has been reached
            if (countingData.Count === Math.floor(countingData.MaxCount / 2)) {
                const halfwayGoalEmbed = new EmbedBuilder()
                    .setTitle('Halfway Goal Reached!')
                    .setDescription(`You are halfway to the goal. ${countingData.MaxCount - countingData.Count} numbers left to reach the goal!`)
                    .setTimestamp()
                    .setFooter({ text: 'Halfway Goal Reached' })
                    .setColor('Purple');

                await message.channel.send({ embeds: [halfwayGoalEmbed] });
            }

            // Check if the maximum count has been reached
            if (countingData.Count === countingData.MaxCount) {
                const congratulationsEmbed = new EmbedBuilder()
                    .setTitle('Congratulations!')
                    .setDescription(`${message.author.username}, you have reached the goal of **${countingData.MaxCount}**! Well done!`)
                    .setTimestamp()
                    .setFooter({ text: 'Game Complete' })
                    .setColor('Gold');

                const congratsReact = await message.channel.send({ embeds: [congratulationsEmbed] });
                congratsReact.react('🏆');

                countingData.Count = 0;
                await countingData.save();
            }
        } else {
            const wrongNumberEmbed = new EmbedBuilder()
                .setTitle('Wrong Number')
                .setDescription(`${message.author.username} has ruined the fun at number **${countingData.Count}**.`)
                .setColor('Red')
                .setTimestamp()
                .setFooter({ text: 'Wrong Number' });

            await message.channel.send({ embeds: [wrongNumberEmbed] });

            countingData.Count = 0;
            await countingData.save();
        }

        // Increase the message count for the member
        messageCounts.set(messageCountKey, messageCount + 1);

        // Set the cooldown to 10 seconds if it's the 20th message
        if (messageCount === 19) {
            const cooldownTime = 10 * 1000; // 10 seconds cooldown
            const expirationTime = Date.now() + cooldownTime;
            cooldowns.set(messageCountKey, expirationTime);

            const cooldownEmbed = new EmbedBuilder()
                .setTitle('Cooldown')
                .setDescription(`You have reached the maximum message limit. Please wait ${cooldownTime / 1000} seconds before sending another number.`)
                .setColor('Yellow')
                .setTimestamp()
                .setFooter({ text: 'Cooldown' });

            await message.channel.send({ embeds: [cooldownEmbed], ephemeral: true });
        }

        setTimeout(() => {
            // Reset the message count for the member
            messageCounts.delete(messageCountKey);
        }, 60 * 1000); // Reset message count after 1 minute
    },
};