const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {
        const { customId, values, guild, member } = interaction; // you need to destructure values from interaction first to use it below
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                interaction.reply({ content: "This is an outdated command. Please try again later." });
            }

            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            if (interaction.customId !== "verify") return;
            const role = interaction.guild.roles.cache.get('1134877050558218351');
            return interaction.member.roles
            .add(role)
            .then((member) =>
               interaction.reply({
                content: `The ${role} has been successfully assigned to you.`, 
                ephemeral: true,
            })
        );   
      }  else if(interaction.isSelectMenu()) {
        if (customId == "reaction-roles") {
          for (let i = 0; i < values.length; i++) {
            const roleId = values[i];

            const role = guild.roles.cache.get(roleId);
            const hasRole = member.roles.cache.has(roleId);

            switch (hasRole) {
                case true:
                   member.roles.remove(roleId);
                   break;
                case false:
                    member.roles.add(roleId);
                    break;    
            }
          }

          interaction.reply({ content: "Your roles has been successfully updated.", ephemeral: true });
        }
      } else {
        return;
      }
    },
};