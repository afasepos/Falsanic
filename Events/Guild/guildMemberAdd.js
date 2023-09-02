const { MessageEmbed } = require("discord.js");
const Schema = require("../../Models/Welcome.js");

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    Schema.findOne({ Guild: member.guild.id }, async (err, data) => {
      if (err) {
        console.log(`Error fetching welcome data: ${err}`);
        return;
      }
      if (!data) return;

      try {
        const welcomeChannel = await member.guild.channels.fetch(data.Channel);
        if (!welcomeChannel) {
          console.log('Welcome channel not found or invalid.');
          return;
        }

        const welcomeEmbed = new MessageEmbed()
          .setTitle("**New member!**")
          .setDescription(data.Msg)
          .setColor(0x037821)
          .addFields({ name: 'Total Members', value: `${member.guild.memberCount}` })
          .setTimestamp();

        try {
          await welcomeChannel.send({ embeds: [welcomeEmbed] });
          console.log(`Welcome message sent in channel: ${welcomeChannel.name}`);
        } catch (error) {
          console.log(`Error sending welcome message: ${error}`);
        }

        if (data.Role) {
          const role = member.guild.roles.cache.get(data.Role);
          if (role) {
            member.roles.add(role);
          }
        }
      } catch (error) {
        console.log(`Error fetching welcome channel: ${error}`);
      }
    });
  }
};