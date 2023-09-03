const { SlashCommandBuilder, EmbedBuilder, ChannelType, ModalBuilder,TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const { request } = require("https");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("feedback")
      .setDescription("Feedback our Discord Bot (Falsanic)."),
    async execute(interaction) {
  
          const modal = new ModalBuilder()
            .setTitle("feedback")
            .setCustomId("modal");
 
          const name = new TextInputBuilder()
            .setCustomId("name")
            .setRequired(true)
            .setLabel(`Provide me your Discord Name + Discord Tag`)
            .setPlaceholder("Eg: 121afaswpos (1079844716243341373)")
            .setStyle(TextInputStyle.Paragraph);
 
            const mark = new TextInputBuilder()
            .setCustomId("mark")
            .setRequired(true)
            .setLabel(`Out of 10, how many you will give to Falsanic`)
            .setPlaceholder("Eg: 10/10 or 8/10")
            .setStyle(TextInputStyle.Short);
 
            const feedbackfeeling = new TextInputBuilder()
            .setCustomId("feedbackfeeling")
            .setRequired(true)
            .setLabel(`Provide us what do you think about Falsanic`)
            .setPlaceholder("Your feeling that using Zenith (try to be positive)")
            .setStyle(TextInputStyle.Paragraph);
 
            const problem = new TextInputBuilder()
            .setCustomId("problem")
            .setRequired(true)
            .setLabel(`Problem when using Falsanic`)
            .setPlaceholder("Your problem that using Falsanic (try to tell all the problems)")
            .setStyle(TextInputStyle.Paragraph);
 
  
          const firstActionRow = new ActionRowBuilder().addComponents(name);
          const secondActionRow = new ActionRowBuilder().addComponents(mark);
          const thirdActionRow = new ActionRowBuilder().addComponents(feedbackfeeling);
          const fourthActionRow = new ActionRowBuilder().addComponents(problem);
 
  
          modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
  
          interaction.showModal(modal);
        }
    };