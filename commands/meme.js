const Discord = require("discord.js");
const randomPuppy = require('random-puppy');
module.exports = {
    name: 'meme',
    description: "sends a random image from reddit!",
    execute(msg){
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
                msg.channel.send(embed).then().catch((e) => msg.reply("Could not send image: " + e));
            })
            .catch((e) => msg.reply("Could not find an image" + e));
    }
}