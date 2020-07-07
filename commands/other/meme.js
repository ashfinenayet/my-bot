const Discord = require("discord.js");
const randomPuppy = require('random-puppy');
const { Command } = require('discord.js-commando');
module.exports = class MemeCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'meme',
        aliases: ['meme', 'reddit'],
        memberName: 'meme',
        group: 'other',
        description: 'shows an image from reddit',
        guildOnly: true
      });
    }
    execute(message){
        const subReddits = [
            "blursedimages",
            "cursedimages",
            'comedyheaven'
        ];
        const i = Math.floor(Math.random() * subReddits.length);
        const randomSubreddit = subReddits[i];
        randomPuppy(randomSubreddit)
            .then((img) => {
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setImage(img)
                    .setTitle("from /r/" + randomSubreddit)
                    .setURL("https://reddit.com/r/" + randomSubreddit);
                    message.channel.send(embed)
            })
            .catch((e) => message.reply("Could not find an image" + e));
    }
}