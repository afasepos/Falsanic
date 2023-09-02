const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Get a random meme from Reddit or Giphy!")
                    .addStringOption(option =>
            option.setName("platform")
                .setDescription("Select the meme platform that you want the meme to be generated from.")
                .setRequired(true)
                .addChoices(
                    { name: "Reddit", value: "reddit" },
                    { name: "Giphy", value: "giphy" }
                )
        ),

    async execute(interaction) {
        const { options } = interaction;

        const platform = options.getString("platform");

        // Use dynamic import() for node-fetch
        const fetchModule = await import("node-fetch");
        const fetch = fetchModule.default;

        async function redditMeme() {
            try {
                const res = await fetch('https://www.reddit.com/r/memes/random.json');
                const [meme] = await res.json();
        
                if (!meme || !meme.data || !meme.data.children || meme.data.children.length === 0) {
                    throw new Error("Invalid Reddit API response or no memes found.");
                }
        
                const title = meme.data.children[0].data.title;
                const url = meme.data.children[0].data.url;
                const author = meme.data.children[0].data.author;
        
                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setImage(url)
                    .setURL(url)
                    .setColor("Random")
                    .setFooter({ text: author });
        
                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.log(error);
                return interaction.reply({ content: "Sorry, could not fetch a meme from Reddit at the moment.", ephemeral: true });
            }
        }

        async function giphyMeme() {
            try {
                const res = await fetch('https://api.giphy.com/v1/gifs/random?api_key=I6vmAuAdpRUBR3a0Y9mzYJml6ccSJPm9&tag=&rating=g');
                const meme = await res.json();

                if (!meme || !meme.data || !meme.data.images || !meme.data.images.original || !meme.data.images.original.url) {
                    throw new Error("Invalid Giphy API response")
                }

                const title = meme.data.title;
                const url = meme.data.images.original.url;
                const link = meme.data.url;
                const author = meme.data.user?.display_name || "Unknown Author";
                const pf = meme.data.user?.avatar_url || null;

                const embed = new EmbedBuilder()
                    .setImage(url)
                    .setURL(link)
                    .setColor("Random");

                if (title) {
                    embed.setTitle(title);
                }

                if (author || pf) {
                    embed.setFooter({
                        text: author || "\u200B",
                        iconURL: pf || undefined
                    });
                }

                return interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.log(error);
                return interaction.reply({ content: "Sorry, could not fetch a meme from Giphy at the moment.", ephemeral: true });
            }
        }

        if (platform === "reddit") {
            return redditMeme();
        }

        if (platform === "giphy") {
            return giphyMeme();
        }

        // generating a random memeor showing an error if no platform selected
        if (!platform) {
            return interaction.reply({ content: "Please select a meme platform (Reddit or Giphy) using /meme command.", ephemeral: true });
        }

        const memes = [giphyMeme, redditMeme];
        const selectedMeme = platform === "giphy" ? giphyMeme : redditMeme;
        return selectedMeme();
    }
};
