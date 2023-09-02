const { Client, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler.js");
const { loadEvents } = require("../../Handlers/eventHandler.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload your commands or events.")
    .addSubcommand(subcommand =>
    subcommand.setName("commands")
    .setDescription("Reload your commands.")
    )
    .addSubcommand(subcommand =>
    subcommand.setName("events")
    .setDescription("Reload your events.")
    ),

    async execute(interaction, client) {
        
        const { user } = interaction;

        if (user.id !== "1079844716243341373") return interaction.reply({
            embeds: [new EmbedBuilder()
            .setColor("Red").setDescription("This command is only for the bot developers.")], ephemeral: true
        })

        const sub = interaction.options.getSubcommand()
        const embed = new EmbedBuilder()
        .setTitle("🖥️ Developer")
        .setColor("Blue")

        switch (sub) {
            case "commands": {
                loadCommands(client)
                interaction.reply({ embeds: [embed.setDescription("✅ The commands have been reloaded successfully.")] })
                console.log(`${user} has realoaded the commands.`)
            }
            break;
            case "events": {
                loadEvents(client)
                interaction.reply({ embeds: [embed.setDescription("✅ The events have been reloaded successfully.")] })
                console.log(`${user} has realoaded the events.`)
            }
            break;
            }
    }
}