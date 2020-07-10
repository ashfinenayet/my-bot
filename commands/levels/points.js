const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const client = new Discord.Client();
module.exports = class PauseCommand extends Command {
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
    run(message) {
      const key = `${message.guild.id}-${message.author.id}`;
      return message.channel.send(`You currently have ${client.points.get(key, "points")} points, and are level ${client.points.get(key, "level")}!`);
    }
  
    };