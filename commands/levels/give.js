const { Command } = require('discord.js-commando');

module.exports = class PauseCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'give',
        aliases: ['gift',],
        memberName: 'give',
        group: 'levels',
        description: 'give user of your choice points',
        guildOnly: true
      });
    }
    run(message) {
        if(!message.author.id === message.guild.owner) return message.reply("You're not the boss of me, you can't do that!");

        const user = message.mentions.users.first() || client.users.get(args[0]);
        if(!user) return message.reply("You must mention someone or give their ID!");
      
        const pointsToAdd = parseInt(args[1], 10);
        if(!pointsToAdd) return message.reply("You didn't tell me how many points to give...")
      
        // Get their current points.
        let userscore = client.getScore.get(user.id, message.guild.id);
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!userscore) {
          userscore = { id: `${message.guild.id}-${user.id}`, user: user.id, guild: message.guild.id, points: 0, level: 1 }
        }
        userscore.points += pointsToAdd;
      
        // We also want to update their level (but we won't notify them if it changes)
        let userLevel = Math.floor(0.1 * Math.sqrt(score.points));
        userscore.level = userLevel;
      
        // And we save it!
        client.setScore.run(userscore);
      
        return message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userscore.points} points.`);
      
      }
    };