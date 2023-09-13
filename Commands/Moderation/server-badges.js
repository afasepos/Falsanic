const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("server-badges")
    .setDescription("Find the total number of users with each profile badge.")
    .setDMPermission(false),
  async execute(interaction, client) {

    let counts = {};

    const guild = interaction.guild;
    await guild.members.fetch(); // Fetch all the members of the guild

    for (const member of guild.members.cache.values()) {
      const userFlags = member.user.flags?.toArray() || []; // Get the flags of the user
      for (const flag of userFlags) {
        if (counts[flag]) {
          counts[flag]++;
        } else {
          counts[flag] = 1;
        }
      }
    }

    const staff = '<:DiscordStaff:1110756566451359856>'
    const partner = '<:Partner:1110756630984916992>'
    const moderator = '<:CertifiedModerator:1110756565063045150>'
    const hypesquad = '<:Hypesquad:1110756570549198868>'
    const bravery = '<:Bravery:1110756556850614344>'
    const brilliance = '<:Brilliance:1110756559748862083>'
    const balance = '<:Balance:1110756555265167470>'
    const bughunter1 = '<:BugHunter1:1110756561137172480>'
    const bughunter2 = '<:BugHunterLevel2:1110756563230146581>'
    const activedeveloper = '<:ActiveDeveloper:1110756581643141201>'
    const verifieddeveloper = '<:VerifiedBotDeveloper:1110756634503958648>'
    const earlysupporter = '<:EarlySupporter:1110756569320267847>'
    const verifiedbot = '<:VerifiedBot:1110756633237270548>'

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('Server Badges')
      .setDescription(`
        ${staff} **${counts['Staff'] || 0}**
        ${partner} **${counts['Partner'] || 0}**
        ${moderator} **${counts['CertifiedModerator'] || 0}**
        ${hypesquad} **${counts['Hypesquad'] || 0}**
        ${bravery} **${counts['HypeSquadOnlineHouse1'] || 0}**
        ${brilliance} **${counts['HypeSquadOnlineHouse2'] || 0}**
        ${balance} **${counts['HypeSquadOnlineHouse3'] || 0}**
        ${bughunter1} **${counts['BugHunterLevel1'] || 0}**
        ${bughunter2} **${counts['BugHunterLevel2'] || 0}**
        ${activedeveloper} **${counts['ActiveDeveloper'] || 0}**
        ${verifieddeveloper} **${counts['VerifiedDeveloper'] || 0}**
        ${earlysupporter} **${counts['PremiumEarlySupporter'] || 0}**
        ${verifiedbot} **${counts['VerifiedBot'] || 0}**\n
    `)

    await interaction.reply({ embeds: [embed] });
  },
};