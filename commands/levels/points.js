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
        return message.reply(`You currently have ${score.points} points and are level ${score.level}!`);
      }
    };