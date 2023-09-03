const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../Models/autoroleSchema.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeautorole')
    .setDescription('Remove the current autorole configuration'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return await interaction.reply({ content: ':x: You do not have the permissions to manage roles.', ephemeral: true });
    }

    const autoRole = await AutoRole.findOneAndDelete({ guildId: interaction.guildId });
    if (!autoRole) {
      return await interaction.reply({ content: ':x: No autorole configuration found for this server.', ephemeral: true });
    }
    
    await interaction.reply({ content: '✅ Autorole configuration has been removed.', ephemeral: true });
  },
};