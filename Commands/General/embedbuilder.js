const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  .setName('embed')
  .setDescription('Create a customizable embed.')
  .addSubcommand(subcommand => subcommand
    .setName('create')
    .setDescription('Create a custom embed.')
    .addStringOption(option => option.setName('title').setDescription('Set the title of this embed.').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Set the description of this embed.').setRequired(true))
    .addStringOption(option => option.setName('color').setDescription('Sets the color of this embed.').setRequired(true))
    .addStringOption(option => option.setName('url').setDescription('Sets the url of the embed.'))
    .addStringOption(option => option.setName('image').setDescription('Sets the image of this embed.'))
    .addStringOption(option => option.setName('author').setDescription('Sets the author of this embed.'))
    .addStringOption(option => option.setName('author-icon').setDescription('Sets the author icon of this embed.'))
    .addStringOption(option => option.setName('author-url').setDescription('Sets the author url of this embed.'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Sets the thumbnail of this embed.'))
    .addStringOption(option => option.setName('field-name').setDescription('Sets the field-name of this embed.'))
    .addStringOption(option => option.setName('field-value').setDescription('Sets the field-value of this embed.'))
    .addStringOption(option => option.setName('footer').setDescription('Sets the footer of this embed.'))
    .addStringOption(option => option.setName('footer-icon').setDescription('Sets the footer icon of this embed.')))
    .addSubcommand(subcommand => subcommand
    .setName('edit')
    .setDescription('Edit an embed message.')
    .addStringOption(option => option.setName('id').setDescription('Provide the id of the embed you want to edit.').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Provide the updated description of this embed.').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('Provide the updated title of the embed.'))
    .addStringOption(option => option.setName('color').setDescription('Provide the new color of the embed.'))
    .addStringOption(option => option.setName('url').setDescription('Provide the new URL of the embed.'))
    .addStringOption(option => option.setName('image').setDescription('Provide the new image of the embed.'))
    .addStringOption(option => option.setName('author').setDescription('Provide the new author of this embed.'))
    .addStringOption(option => option.setName('author-icon').setDescription('Provide the new author-icon of the embed.'))
    .addStringOption(option => option.setName('author-url').setDescription('Provide the new author-url of the embed.'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Provide the new thumbnail of the embed.'))
    .addStringOption(option => option.setName('field-name').setDescription('Provide a field-name for this embed.'))
    .addStringOption(option => option.setName('field-value').setDescription('Provide a field-value for this embed.'))
    .addStringOption(option => option.setName('footer').setDescription('Provide a footer for this embed.'))
    .addStringOption(option => option.setName('footer-icon').setDescription('Provide a footer-icon for this embed.')))
    .addSubcommand(subcommand => subcommand
    .setName('delete')
    .setDescription('Delete an embed message.')
    .addStringOption(option => option.setName('id').setDescription('Provide the id of the embed you want to delete.').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
    
    const { options } = interaction;

    const title = options.getString('title');
    const url = options.getString('url');
    const description = options.getString('description');
    const color = options.getString('color');
    const image = options.getString('image');
    const author = options.getString('author');
    const authorIcon = options.getString('author-icon');
    const authorUrl = options.getString('author-url');
    const thumbnail = options.getString('thumbnail');
    const fieldN = options.getString('field-name') || ' ';
    const fieldV = options.getString('field-value') || ' ';
    const footer = options.getString('footer') || ' ';
    const footericon = options.getString('footer-icon');
    const Id = options.getString('id');

  if (options.getSubcommand() === 'edit') {
  const editEmbed = await interaction.channel.messages.fetch(Id).catch(() => null);

  if (!editEmbed || !editEmbed.embeds[0]) {
    return await interaction.reply({ content: 'Oops, parece que te has equivocado de mensaje.', ephemeral: true });
  }

  const targetEmbed = editEmbed.embeds[0];

const fieldOptions = {
  name: options.getString('field-name'),
  value: options.getString('field-value'),
  inline: false
};

const fields = [];
if (fieldOptions.name || fieldOptions.value || fieldOptions.inline) {
  fields.push(fieldOptions);
}

  const editedEmbed = new EmbedBuilder()
    .setColor(options.getString('color') || targetEmbed.color)
    .setTitle(options.getString('title') || targetEmbed.title)
    .setURL(options.getString('url') || targetEmbed.url)
    .setDescription(options.getString('description') || targetEmbed.description)
    .setImage(options.getString('image') || targetEmbed.image)
    .setAuthor({ name: options.getString('author') || targetEmbed.author, iconURL: options.getString('author-icon') || targetEmbed.authorIcon, url: options.getString('author-url') || targetEmbed.authorUrl })
    .setThumbnail(options.getString('thumbnail') || targetEmbed.thumbnail)
    .setFields(fields)
    .setFooter({ text: options.getString('footer') || targetEmbed.footer, iconURL: options.getString('footer-icon') || targetEmbed.footericon })

  await editEmbed.edit({ embeds: [editedEmbed] });

  return await interaction.reply({ content: 'Embed editado con éxito.', ephemeral: true });
}


    if (options.getSubcommand() === 'delete') {
      const editEmbed = await interaction.channel.messages.fetch(Id).catch(() => null);

      if (!editEmbed || !editEmbed.embeds[0]) {
        return await interaction.reply({ content: 'Oops, looks like you sent the wrong message.', ephemeral: true });
      }

      await editEmbed.delete();
      return await interaction.reply({ content: "The embed was removed successfully.", ephemeral: true });
    }

    if (image) {      
      if (!image.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.' })
  }

    if (thumbnail) {
      if (!thumbnail.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.' })
    }

    if (footericon) {
      if (!footericon.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.' })
    }

    if (url) {
      if (!url.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.' })
    }

    if (authorUrl) {
      if (!footericon.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.' })
    }

    if (authorIcon) {
      if (!authorIcon.startsWith('https')) return await interaction.reply({ content: 'Oops, it looks like you entered an invalid url.' })
    }

const fieldOptions = {
  name: options.getString('field-name'),
  value: options.getString('field-value'),
  inline: false
};

const fields = [];
if (fieldOptions.name || fieldOptions.value || fieldOptions.inline) {
  fields.push(fieldOptions);
}

    const embed = new EmbedBuilder()
    .setAuthor({ name: author, iconURL: authorIcon, url: authorUrl })
    .setTitle(title)
    .setURL(url)
    .setDescription(description)
    .setColor(color)
    .setImage(image)
    .setThumbnail(thumbnail)
    .setFields(fields)
    .setFooter({ text: footer, iconURL: footericon })

    await interaction.reply({ content: 'The embed has been successfully sent.', ephemeral: true });

    await interaction.channel.send({ embeds: [embed] });
  }
}