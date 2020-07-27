const { Command } = require('discord.js-commando');
module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dice',
      aliases: ['dice', 'roll'],
      memberName: 'dice',
      group: 'other',
      description: 'rolls a six sided dice for ya',
      guildOnly: true
    });
  }
  run(message) {
    var dice = 1 + Math.floor(Math.random() * 6);
    message.channel.send(dice);
  }
}