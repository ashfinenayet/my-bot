const { Command } = require('discord.js-commando');
const Discord = require("discord.js");

module.exports = class LeaderboardCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'leaderboard',
        aliases: ['leader',],
        memberName: 'leaderboard',
        group: 'levels',
        description: 'shows top ten in the server',
        guildOnly: true
      });
    }
    run(message, client) {
        const filtered = client.points.array().filter( p => p.guild === message.guild.id );
  
        // Sort it to get the top results... well... at the top. Y'know.
        const sorted = filtered.sort((a, b) => a.points < b.points);
      
        // Slice it, dice it, get the top 10 of it!
        const top10 = sorted.splice(0, 10);
      
        // Now shake it and show it! (as a nice embed, too!)
        const embed = new Discord.RichEmbed()
          .setTitle("Leaderboard")
          .setAuthor(client.user.username, client.user.avatarURL)
          .setDescription("Our top 10 points leaders!")
          .setColor(0x00AE86);
        for(const data of top10) {
          embed.addField(client.users.get(data.user).tag, `${data.points} points (level ${data.level})`);
        }
        return message.channel.send({embed});
      
      }
    };