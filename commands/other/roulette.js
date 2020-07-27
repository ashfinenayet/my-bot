
const { Command } = require('discord.js-commando');

module.exports = class RouletteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roulette',
      group: 'other',
      memberName: 'roulette',
      description: 'live life on the edge(for safety reasons its a watergun)',
      throttling: {
        usages: 1,
        duration: 6
      }
    });
  }

  run(message) {
    let random = Math.random() * 100;
    // console.log(random);
    if (random < 100 / 6) {
      message.channel.send('🔥🔫 You died.');
      userToMute.addRole(muteRole);
      setTimeout(() => userToMute.removeRole(muteRole), muteTime);
    } else {
      message.channel.send('🚬🔫 You\'re safe... For now...');
    }
  }
};