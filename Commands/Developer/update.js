const { SlashCommandBuilder, PermissionFlagsBits, ActivityType, EmbedBuilder } = require("discord.js");

const userId = "1079844716243341373";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Update the bot status.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("activity")
                .setDescription("Update the bot's activity.")
                .addStringOption(option =>
                    option.setName("type")
                        .setDescription("Pick an activity.")
                        .setRequired(true)
                        .addChoices(
                            { name: "Playing", value: "Playing" },
                            { name: "Streaming", value: "Streaming" },
                            { name: "Listening", value: "Listening" },
                            { name: "Watching", value: "Watching" },
                            { name: "Competing", value: "Competing" },
                        )
                )
                .addStringOption(option =>
                    option.setName("activity")
                        .setDescription("Set your current activity.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("status")
                .setDescription("Update the bot's status.")
                .addStringOption(option =>
                    option.setName("type")
                        .setDescription("Pick a status.")
                        .setRequired(true)
                        .addChoices(
                            { name: "Online", value: "online" },
                            { name: "Idle", value: "idle" },
                            { name: "Do not Disturb", value: "dnd" },
                            { name: "Invisible", value: "invisible" },
                        )
                )
        ),
    async execute(interaction, client) {
        try {
            const userId = interaction.user.id;
            if (userId !== "1079844716243341373") {
                return interaction.reply("You are not eligible to execute this command because you are not the bot developer.");
            }

            const { options } = interaction;
            const sub = options.getSubcommand();

            let type;

            if (sub === "activity") {
                type = options.getString("type");
                const activity = options.getString("activity");

                switch (type) {
                    case "Playing":
                        client.user.setActivity(activity, { type: ActivityType.Playing });
                        break;
                    case "Streaming":
                        client.user.setActivity(activity, { type: ActivityType.Streaming });
                        break;
                    case "Listening":
                        client.user.setActivity(activity, { type: ActivityType.Listening });
                        break;
                    case "Watching":
                        client.user.setActivity(activity, { type: ActivityType.Watching });
                        break;
                    case "Competing":
                        client.user.setActivity(activity, { type: ActivityType.Competing });
                        break;
                    default:
                        throw new Error("Invalid activity type. Please choose one of the available options.");
                }
            } else if (sub === "status") {
                type = options.getString("type");

                switch (type) {
                    case "online":
                        client.user.setPresence({ status: "online" });
                        break;
                    case "idle":
                        client.user.setPresence({ status: "idle" });
                        break;
                    case "dnd":
                        client.user.setPresence({ status: "dnd" });
                        break;
                    case "invisible":
                        client.user.setPresence({ status: "invisible" });
                        break;
                    default:
                        throw new Error("Invalid status type. Please choose one of the available options.");
                }
            }

            const embed = new EmbedBuilder();
            return interaction.reply({ embeds: [embed.setDescription(`Successfully updated your ${sub} to **${type}**.`)] });
        } catch (error) {
            console.log(error);
            return interaction.reply("An error occurred while updating the bot status. Please try again.");
        }
    }
};
