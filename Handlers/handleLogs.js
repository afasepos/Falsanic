const {EmbedBuilder, Events, AuditLogEvent} = require('discord.js');

function handleLogs(client) {
    const logSchema = require("../Models/Logs.js");

    async function send_log(guildId, embed) {
        const data = await logSchema.findOne({GuildId: guildId});
        if (!data) return;
        const logChannel = client.channels.cache.get(data.ChannelId);
        if (!logChannel) return;
        embed.setTimestamp();
        logChannel.send({embeds: [embed]})
    }




    client.on(Events.ChannelCreate, async channel => {

        channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelCreate,
        })
        .then(async audit => {
          
    
          const name = channel.name;
          const id = channel.id;
    
          const embed = new EmbedBuilder()
          .setColor('Green')
          .setAuthor({name: `Channel Created!`, iconURL: channel.guild.iconURL({dynamic: true})})
          .setDescription(`<#${id}> ${name}`)
          .setTimestamp()
          .setFooter({text: `Channel ID: ${id}`})
    
          return send_log(channel.guild.id, embed)
    
        })
      });

      client.on(Events.ChannelDelete, async channel => {
  
        channel.guild.fetchAuditLogs({
          type: AuditLogEvent.ChannelDelete,
        })
        .then(async audit => {
          
    
          const name = channel.name;
    
    
          const embed = new EmbedBuilder()
          .setColor('Red')
          .setAuthor({name: `Channel Deleted`, iconURL: channel.guild.iconURL({dynamic: true})})
          .setDescription(`Deleted Channel Name: **${name}**`)
          .setTimestamp()
          .setFooter({text: `Channel ID: ${channel.id}`})
    
          return send_log(channel.guild.id, embed)
    
        })
      })
    
      client.on(Events.GuildBanAdd, async member => {
    
        member.guild.fetchAuditLogs({
          type: AuditLogEvent.GuildBanAdd,
        })
        .then(async audit => {
    
          const name = member.user.username;
          const id = member.user.id;
    
    
          const embed = new EmbedBuilder()
          .setColor('Red')
          .setAuthor({name: 'Member Banned', iconURL: member.user.displayAvatarURL()})
          .setDescription(`<@${id}> ${name}`)
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp()
          .setFooter({text: `User ID: ${id}`})
    
          return send_log(member.guild.id, embed)
    
        })
      })
    
      client.on(Events.GuildBanRemove, async member => {
    
        member.guild.fetchAuditLogs({
          type: AuditLogEvent.GuildBanRemove,
        })
        .then(async audit => {
          
    
          const name = member.user.username;
          const id = member.user.id;
    
          
    
          const embed = new EmbedBuilder()
          .setColor('Green')
          .setAuthor({name: 'Member Unbanned', iconURL: member.user.displayAvatarURL()})
          .setDescription(`<@${id}> ${name}`)
          .setThumbnail(member.user.displayAvatarURL())
          .setTimestamp()
          .setFooter({text: `User ID: ${id}`})
    
          return send_log(member.guild.id, embed)
    
        })
      })
    
      client.on(Events.MessageDelete, async (message, member) => {
    
        message.guild.fetchAuditLogs({
          type: AuditLogEvent.MessageDelete,
        })
        .then(async audit => {
    
          if (message.author.bot) return;
          const mes = message.content;
    
          if (!mes) return;
    
          
    
          const embed = new EmbedBuilder()
          .setColor('Red')
          .setAuthor({name: `${message.author.tag}`, iconURL: message.member.displayAvatarURL()})
          .setDescription(`**Message sent by **<@${message.member.user.id}> **Deleted in** <#${message.channel.id}>\n${mes}`)
          .setImage(message.attachments.first()?.url || null)
          .setTimestamp()
          .setFooter({text: `Message ID: ${message.id}` });
          
          
          return send_log(message.guild.id, embed)
    
        })
      })
  
      client.on(Events.MessageDelete, async (message, member) => {
    
        message.guild.fetchAuditLogs({
          type: AuditLogEvent.MessageDelete,
        })
        .then(async audit => {
          
          
          if (message.author.bot) return;
    
          const mes = message.attachments.first()?.url;
    
          if (!mes) return;
    
          if (message.content.length >= 1) return;
  
          
    
          const embed = new EmbedBuilder()
          .setColor('Red')
          .setAuthor({name: `${message.member.user.tag}`, iconURL: message.member.displayAvatarURL()})
          .setDescription(`**Image sent by **<@${message.member.user.id}> **Deleted in** <#${message.channel.id}>`)
          .setImage(mes)
          .setTimestamp()
          .setFooter({text: `Message ID: ${message.id}` });
          
          
          return send_log(message.guild.id, embed)
    
        })
      })
    
      client.on(Events.MessageUpdate, async (message, newMessage) => {
    
        message.guild.fetchAuditLogs({
          type: AuditLogEvent.MessageUpdate,
        })
        .then(async audit => {
          
  
          
          if (message.author.bot) return;
          
          
          const mes = message.content;
          
    
          if (!mes) return;
          if (newMessage.content.includes('https://')) return;
          if (newMessage.content.includes('http://')) return;
    
    
          const embed = new EmbedBuilder()
          .setColor('Blue')
          .setAuthor({name: `${message.member.user.tag}`, iconURL: newMessage.member.displayAvatarURL()})
          .setDescription(`**Message sent by **<@${message.member.user.id}> **Edited in** <#${message.channel.id}> [Jump To Message](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${newMessage.id})`)
          .addFields({name: "Before", value: `${mes}`, inline: false})
          .addFields({name: "After", value: `${newMessage}`, inline: false})
          .setTimestamp()
          .setFooter({text: `Message ID: ${newMessage.id}` })
    
          return send_log(message.guild.id, embed)
    
        })
      })
    
      client.on(Events.GuildMemberAdd, async member => {
    
        member.guild.fetchAuditLogs({
          type: AuditLogEvent.GuildMemberAdd,
        })
        .then(async audit => {
          
  
          if (member.user.bot) return;
    
          const name = member.user.tag;
          const id = member.user.id;
    
    
          const embed = new EmbedBuilder()
          .setColor('Green')
          .setAuthor({name: 'Member Joined!', iconURL: member.displayAvatarURL()})
          .setDescription(`<@${id}> ${name}`)
          .setTimestamp()
    
          return send_log(member.guild.id, embed)
    
        })
      })
    
      client.on(Events.GuildMemberRemove, async member => {
    
        member.guild.fetchAuditLogs({
          type: AuditLogEvent.GuildMemberRemove,
        })
        .then(async audit => {
         
  
          if (member.user.bot) return;
    
          const name = member.user.tag;
          const id = member.user.id;
    
    
          const embed = new EmbedBuilder()
          .setColor('Red')
          .setAuthor({name: 'Member Left', iconURL: member.displayAvatarURL()})
          .setDescription(`<@${id}> ${name}`)
          .setTimestamp()
    
          return send_log(member.guild.id, embed)
    
        })
      })
    
}

module.exports = {handleLogs};