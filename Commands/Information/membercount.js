const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Discord = require("discord.js");
const QuickChart = require("quickchart-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("membercount")
        .setDescription("Shows the number of members in the server."),
    async execute(interaction) {
        const guild = interaction.guild;
        const totalMembers = guild.memberCount;
        const botMembers = guild.members.cache.filter(member => member.user.bot).size;
        const humanMembers = totalMembers - botMembers;
        const last24Hours = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 24 * 60 * 60 * 1000).size;
        const last7Days = guild.members.cache.filter(member => Date.now() - member.joinedTimestamp < 7 * 24 * 60 * 60 * 1000).size;
       


        const chart = new QuickChart();
        chart
            .setConfig({
                type: 'bar',
                data: {
                    labels: ['Total', 'Members', 'Bots', '24h', '7 days'],
                    datasets: [{
                        label: 'Member Count',
                        data: [totalMembers, humanMembers, botMembers, last24Hours, last7Days],
                        backgroundColor: ['#36a2eb', '#ffce56', '#ff6384', '#cc65fe', '#66ff99']
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: `Članovi servera ${guild.name}`
                        }
                    }
                },



            
            })

            .setWidth(500)
            .setHeight(300)
            .setBackgroundColor('#151515');
           


        const chartUrl = await chart.getShortUrl();

        const embed = new EmbedBuilder()

            .setTitle(`📙 │ INFORMATION`)
            .setColor('#ae7424')
            .setFooter({ text: `${guild.name}`, iconURL: "https://cdn.discordapp.com/avatars/1112727785627209758/f3dc27681387c69a1350f7cf121d3c16.webp?size=1024"})
            .setDescription(`Total: **${totalMembers}**\nMembers: **${humanMembers}**\nBots: **${botMembers}**\nLast 24h: **${last24Hours}**\nLast 7 days: **${last7Days}**`)
            .setImage(chartUrl);

        await interaction.reply({ embeds: [embed] });
    },
};