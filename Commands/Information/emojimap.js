const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojimap')
        .setDescription('View the list of emojis on the server.'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const emojis = interaction.guild.emojis.cache.map((e) => `${e} | \`${e}\``);
        const pageSize = 10;
        const pages = Math.ceil(emojis.length / pageSize);
        let currentPage = 0;

        const generateEmbed = (page) => {
            const start = page * pageSize;
            const end = start + pageSize;
            const emojiList = emojis.slice(start, end)
                .join('\n') || 'This server does not have any emojis.';

            const embed = new EmbedBuilder()
                .setTitle(`Emojis (Page ${page + 1} from ${pages})`)
                .setDescription(`${emojiList}`);
            return embed;
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Former')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary),
            );

        const message = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row], fetchReply: true });

        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'previous') {
                currentPage--;
                if (currentPage < 0) {
                    currentPage = pages - 1;
                }
            } else if (interaction.customId === 'next') {
                currentPage++;
                if (currentPage > pages - 1) {
                    currentPage = 0;
                }
            }
            try {
                await interaction.update({ embeds: [generateEmbed(currentPage)], components: [row] });
            } catch (error) {
                console.log('Error updating interaction:', error);
            }
        });
        
        collector.on('end', async () => {
            row.components.forEach((c) => {
                c.setDisabled(true);
            });
            try {
                await message.edit({ components: [row] });
            } catch (error) {
                console.log('Error editing message:', error);
            }
        });        
    },
};