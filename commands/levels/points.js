const { Command } = require('discord.js-commando');

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
      let score;
      if (message.guild) {
        score = client.getScore.get(message.author.id, message.guild.id);
        if (!score) {
          score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
        }
        score.points++;
        const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
        if(score.level < curLevel) {
          score.level++;
          message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
        }
        client.setScore.run(score);
      }
   
        return message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
      }
    };