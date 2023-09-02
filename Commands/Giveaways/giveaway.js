const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const ms = require("ms");
const client = require("../../index.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Fully completed giveaway system.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("start")
                .setDescription("🎉 Starts a giveaway.")
                .addStringOption(option =>
                    option.setName("length")
                        .setDescription("Enter the length of the giveaway.")
                        .setRequired(true)
            )
            .addStringOption(option =>
                option.setName("prize")
                    .setDescription("Set a prize for the winner to win.")
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName("winners")
                    .setDescription("Enter the number of winners (default is 1).")
                    .setRequired(false)
            )
            .addChannelOption(option =>
                option.setName("channel")
                    .setDescription("Specify the channel where to send the giveaway.")
                    .setRequired(false)
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("pause")
                .setDescription("⏸️ Pauses a giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify the message-id of the giveaway you want to pause.")
                        .setRequired(true)
                )  
        )    
        .addSubcommand(subcommand =>
            subcommand.setName("unpause")
                .setDescription("⏯️ Unpauses a giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify the message-id of the giveaway you want to unpause.")
                        .setRequired(true)
                )  
        )    
        .addSubcommand(subcommand =>
            subcommand.setName("end")
                .setDescription("⏹️ Ends a giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify the message-id of the giveaway you want to end.")
                        .setRequired(true)
                )  
        )    
        .addSubcommand(subcommand =>
            subcommand.setName("reroll")
                .setDescription("🔃 Selects a new giveaway winner.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify the message-id of the giveaway you want to reroll the winner.")
                        .setRequired(true)
                )  
        )    
        .addSubcommand(subcommand =>
            subcommand.setName("delete")
                .setDescription("🚮 Deletes the giveaway.")
                .addStringOption(option =>
                    option.setName("message-id")
                        .setDescription("Specify the message-id of the giveaway you want to unpause.")
                        .setRequired(true)
                )  
        ),
        
        async execute(interaction) {
            const { options, channel, guildId } = interaction;
            
            const sub = options.getSubcommand();

            const errorEmbed = new EmbedBuilder().setColor("Red");
            const successEmbed = new EmbedBuilder().setColor("Green");

                if(sub === "start") {
                    const gChannel = options.getChannel("channel") || channel;
                    const duration = ms(options.getString("length"));
                    const winnerCount = options.getInteger("winners") || 1;
                    const prize = options.getString("prize");

                    if (isNaN(duration)) {
                        errorEmbed.setDescription("Enter the correct giveaway length format. `1d, 1h, 1s, 1m`!");
                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                    }

                    return client.giveawaysManager.start(gChannel, {
                        duration: duration,
                        winnerCount,
                        prize,
                        messages: client.giveawayConfig.messages
                    }).then(async () => {
                        if (client.giveawayConfig.giveawayManager.everyoneMention) {
                            const msg = await gchannel.send("@everyone");
                            msg.delete();
                        }
                        successEmbed.setDescription(`The giveaway successfully started in ${gChannel}.`);
                        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                    }).catch((err) => {
                        console.log(err);
                        errorEmbed.setDescription(`Error \n\`${err}\``);
                        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                    });
            }

            const messageid = options.getString("message-id");
            const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === guildId && g.messageId === messageid);
            if (!giveaway) {
                errorEmbed.setDescription(`Giveaway with ID ${messageid} was not found in the database.`);
                return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (sub === "pause") {
                if (giveaway.isPaused) {
                    errorEmbed("This giveaway is already paused.");
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
                await client.giveawaysManager.pause(messageid, {
                    content: client.giveawayConfig.messages.paused,
                    infiniteDurationText: client.giveawayConfig.messages.infiniteDurationText,
                }).then(() => {
                    successEmbed.setDescription('⏸️ The giveaway has been successfully paused.').setColor("Blue");
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                    console.log(err);
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                });
            }

            if (sub === "unpause") {
                client.giveawaysManager.unpause(client).then(() => {
                    successEmbed.setDescription('▶️ The giveaway has been successfully unpaused.').setColor("Blue");
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                    console.log(err);
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                });
            }

            if (sub === "end") {
                client.giveawaysManager.end(client).then(() => {
                    successEmbed.setDescription('▶️ The giveaway has been successfully stopped.').setColor("Blue");
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                    console.log(err);
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                });
            }

            if (sub === "reroll") {
                await client.giveawaysManager.reroll(messageid, {
                    messages: {
                        congrat: client.giveawayConfig.messages.congrat,
                        error: client.giveawayConfig.messages.error
                    }
                }).then(() => {
                    successEmbed.setDescription(' 🎉  The giveaway has a new winner.').setColor("Gold");
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``).setColor("Red");
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                });
            }

            if (sub === "delete") {
                await client.giveawaysManager.delete(messageid).then(() => {
                    successEmbed.setDescription('🚮 The giveaway has been successfully deleted.').setColor("Blue");
                    return interaction.reply({ embeds: [successEmbed], ephemeral: true });
                }).catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``).setColor("Red");
                    return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                });
            }
        }
}