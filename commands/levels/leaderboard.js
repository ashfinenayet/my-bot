const { Command } = require('discord.js-commando');
const Discord = require("discord.js");
const db = require('quick.db');
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
  async run(client, message, args, tools) {
    db.startswith(`guildMessages_${message.guild.id}`, { sort: '.data' }).then(resp => {
      resp.length = 15;


      let finalOutput = '**Leaderboard:**\n\n';
      for (var i in resp) {
        finalOutput += `{client.users.get(resp[i].ID.split('_')[2]).username} -- ${resp[i].data} messages`;
      }

    });


    message.channel.send(finalOutput)


  }
}

