const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timezone-converter")
        .setDescription("Get the time in a different timezone.")
        .addStringOption(option => option.setName("timezone").setDescription("The timezone to convert to.").setRequired(true).addChoices(
            {
                "name": "Greenwich Standard Time",
                "value": "Europe/London"
            },
            {
                "name": "Eastern Standard Time",
                "value": "America/New_York"
            },
            {
                "name": "Central Standard Time",
                "value": "America/Chicago"
            },
            {
                "name": "Pacific Standard Time",
                "value": "America/Los_Angeles"
            },
            {
                "name": "Eastern Daylight Time",
                "value": "America/New_York"
            },
            {
                "name": "Central Daylight Time",
                "value": "America/Chicago"
            },
            {
                "name": "Mountain Daylight Time",
                "value": "America/Denver"
            },
            {
                "name": "Pacific Daylight Time",
                "value": "America/Los_Angeles"
            },
            {
                "name": "British Summer Time",
                "value": "Europe/London"
            },
            {
                "name": "Central European Time",
                "value": "Europe/Berlin"
            },
            {
                "name": "Eastern European Time",
                "value": "Europe/Bucharest"
            },
            {
                "name": "Australian Eastern Standard Time",
                "value": "Australia/Sydney"
            },
            {
                "name": "Australian Central Standard Time",
                "value": "Australia/Adelaide"
            },
            {
                "name": "Australian Western Standard Time",
                "value": "Australia/Perth"
            },
            {
                "name": "Indian Standard Time",
                "value": "Asia/Kolkata"
            },
            {
                "name": "Japan Standard Time",
                "value": "Asia/Tokyo"
            },
            {
                "name": "China Standard Time",
                "value": "Asia/Shanghai"
            },
            {
                "name": "South Korea Standard Time",
                "value": "Asia/Seoul"
            },
            {
                "name": "Eastern Africa Time",
                "value": "Africa/Nairobi"
            },
            {
                "name": "Central Africa Time",
                "value": "Africa/Lagos"
            },
            {
                "name": "Mountain Africa Time",
                "value": "Africa/Windhoek"
            },
            {
                "name": "Central Indonesia Time",
                "value": "Asia/Makassar"
            },
            {
                "name": "Hawaii-Aleutian Standard Time",
                "value": "Pacific/Honolulu"
            },
            {
                "name": "Samoa Standard Time",
                "value": "Pacific/Samoa"
            }
        )),
    async execute(interaction) {
        
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const timezone = options.getString("timezone");

        const utcDate = new Date();
        const locale = 'en-US';

        const localDate = utcDate.toLocaleString(locale, {
            timeZone: timezone
        });

        const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setDescription(`${timezone} ➡️ ${localDate}`);

        await interaction.editReply({ embeds: [embed] });
    }
}