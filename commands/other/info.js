
const { Command } = require('discord.js-commando');
module.exports = class MemeCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'info',
        aliases: ['info', ],
        memberName: 'info',
        group: 'other',
        description: 'shares info about myself and the creator',
        guildOnly: true
      });
    }
    run(message) {
      message.say(
        'Made by @Kowabunga#0310 with :heart:. Check out my website https://ashfin.me/ and also https://github.com/ashfinenayet/my-bot for the full code. Ciao! '
      );
    }
  };