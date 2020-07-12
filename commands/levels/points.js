const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const client = new Discord.Client();

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
      const user = client.users.get(data.user);
if (user && user.tag) {
  // code here
} else {
  // user does not exist..
}
      if (message.guild) {
        // We'll use the key often enough that simplifying it is worth the trouble.
        const key = `${message.guild.id}-${message.author.id}`;
        
        // Triggers on new users we haven't seen before.
        client.points.ensure(key, {
          user: message.author.id,
          guild: message.guild.id,
          points: 0,
          level: 1,
          lastSeen: new Date()
        });
        
        // Increment the points and save them.
        client.points.inc(key, "points");
        
        // Calculate the user's current level
        const curLevel = Math.floor(0.1 * Math.sqrt(client.points.get(key, "points")));
    
        // Act upon level up by sending a message and updating the user's level in enmap.
        if (client.points.get(key, "level") < curLevel) {
          message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
          client.points.set(key, curLevel, "level");
        }
      }
      
      return message.channel.send(`You currently have ${client.points.get(key, "points")} points, and are level ${client.points.get(key, "level")}!`);
    }
  
    };
    