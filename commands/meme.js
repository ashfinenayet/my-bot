const Discord = require("discord.js");
const randomPuppy = require('random-puppy');
module.exports = {
    name: 'meme',
    description: "sends a random image from reddit!",
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
                    message.channel.send(embed).then().catch((e) => message.reply("Could not send image: " + e));
            })
            .catch((e) => message.reply("Could not find an image" + e));
    }
}