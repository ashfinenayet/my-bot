const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const db = require('quick.db');

module.exports = class PointCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'points',
      aliases: ['show-points',],
      memberName: 'points',
      group: 'levels',
      description: 'shows current points',
      guildOnly: true
    });

  }
  async run(message) {
    if (!message.content.startsWith('!')) return;

    let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`)
    let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`)

    if (messagefetch == null) messagefetch = '0';
    if (levelfetch == null) levelfetch = '0';

    const embed = new Discord.MessageEmbed()
      .setDescription(`${message.author}, You Are Level: \`${levelfetch}\` & Have Sent: \`${messagefetch}\` Messages`)
      .setColor('#ff2052');

    message.channel.send(embed)
  }

};
