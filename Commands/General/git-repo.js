const axios = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const languageEmojis = {
    javascript: '<:javascript:1115377003240104036>',
    typescript: '<:typescript:1115376994222362684>',
    html: '<:html:1115377002103455774> ',
    css: '<:css:1115376999356190832>',
    python: '<:python:1115378171999682570>',
    svelte: '<:svelte:1115378174314942564>',
    lua: '<:lua:1115376997049303251>',
    php: '<:php:1115376989562478613>',
    sass: '<:sass:1115376992930504745>',
    rust: '<:rust:1115376991621877830>',
    cplusplus: '<:cplusplus:1115382007850078228>',
    csharp: '<:csharp:1115382005157351434>',
    arch: '<:arch:1115382020600778772>',
    ruby: '<:ruby_logo:1115382015135580200>',
    java: '<:java:1115382690607276052>'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('git-repo')
        .setDescription('Get information about a GitHub repository')
        .addStringOption(option => option.setName('username')
            .setDescription('GitHub username')
            .setRequired(true)
        )
        .addStringOption(option => option.setName('repository')
            .setDescription('GitHub repository name')
            .setRequired(true)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const repository = interaction.options.getString('repository');

        try {
            const response = await axios.get(`https://api.github.com/repos/${username}/${repository}`);
            const repoData = response.data;

            const repoName = repoData.name;
            const repoDescription = repoData.description || '';
            const repoURL = repoData.html_url;
            const repoIconURL = repoData.owner.avatar_url;
            const repoLanguages = repoData.language;

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(repoName)
                .setURL(repoURL)
                .addFields(
                    { name: 'Owner', value: username },
                    { name: 'Repository', value: repository }
                )
                .setThumbnail(repoIconURL);

            // Check if repoDescription is not empty or null before setting it as the description
            if (repoDescription) {
                embed.setDescription(repoDescription.substring(0, 100));
            }

            // Add language emojis if available
            if (repoLanguages && languageEmojis[repoLanguages.toLowerCase()]) {
                embed.addFields({ name: 'Language', value: `${languageEmojis[repoLanguages.toLowerCase()]} ${repoLanguages}` });
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error);

            if (error.response && error.response.status === 404) {
                await interaction.reply({ content: 'The GitHub repository does not exist or it is set to private.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Failed to fetch repository information.', ephemeral: true });
            }
        }
    },
};
