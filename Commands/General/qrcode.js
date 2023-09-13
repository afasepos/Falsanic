const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qr-code')
        .setDescription('Create a QR code.')
        .addStringOption(option => option.setName('url').setDescription('The URL for the QR code.').setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const url = options.getString('url');

        const input = {
            method: 'GET',
            url: 'https://codzz-qr-cods.p.rapidapi.com/getQrcode',
            params: {
                type: 'url',
                value: url
            },
            headers: {
                'X-RapidAPI-Key': '28b79f5b17mshdc64728a79d9475p1b9074jsnbaa5a347d36d',
                'X-RapidAPI-Host': 'codzz-qr-cods.p.rapiadpi.com'
            }
        };

        try {
            const output = await axios.request(input);

            const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setImage(output.data.url)

            await interaction.editReply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            await interaction.editReply({ content: `That URL is not valid! Try again with a different URL.`});
        }
    }
}