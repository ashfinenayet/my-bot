const Discord = require("discord.js")



const randomPuppy = require('random-puppy');
const fetch = require("node-fetch");
const ytdl = require("ytdl-core");

const client = new Discord.Client()

var servers = {};
const queue = new Map();
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = "!";

//const serverQueue = queue.get(message.guild.id);


var sayings = new Array();
sayings[0] = "";
//insert as many saying as you like 
client.on("message", (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    if (msg.content.startsWith(prefix + "saying")) {
        var i = Math.floor(Math.random() * sayings.length);
        msg.reply(sayings[i]);


    } else if (msg.content === "!meme") {
        const subReddits = [
            'blursedimages', 'cursedimages'
        ];
        const i = Math.floor(Math.random() * subReddits.length);
        const randomSubreddit = subReddits[i];
        randomPuppy(randomSubreddit)
            .then((img) => {
                const embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setImage(img)
                    .setTitle("from /r/" + randomSubreddit)
                    .setURL("https://reddit.com/r/" + randomSubreddit);
                msg.channel.send(embed);
            })
            .catch(() => msg.reply("Could not find an image"));

        //msg.reply(subReddits[e])
    } else if (msg.content.startsWith("!weather")) {
        let zipCode = msg.content.split(" ")[1];
        if (
            zipCode === undefined ||
            zipCode.length != 5 ||
            parseInt(zipCode) === NaN
        ) {
            return msg.channel
                .send("The zipcode is incorrect. Try again with !weather (zipcode)")
                .catch(console.error);
        }
        let url =
            "http://api.openweathermap.org/data/2.5/weather?zip=" +
            zipCode +
            ",us&APPID=89788f412abb005a35dd260f88e56efd";

        fetch(url, { method: "get" })
            .then((response) => {
                let parsedWeather = response
                    .json()
                    .then((x) => {
                        return msg.channel.send(`
            🎯The current weather
              🏡 Location: ${x.name}, ${x.sys.country}
              🌁 Forecast: ${x.weather[0].main}
               🌡️ Current Temperature: ${Math.round(
                            ((x.main.temp - 273.15) * 9) / 5 + 32
                        )} °F
               ⬆️  High Temperature: ${Math.round(
                            ((x.main.temp_max - 273.15) * 9) / 5 + 32
                        )} °F
               ⬇️  Low Temperature: ${Math.round(
                            ((x.main.temp_min - 273.15) * 9) / 5 + 32
                        )} °F
                `);
                    })
                    .catch((e) => {
                        console.log("Error parsing JSON: " + e);
                    });
            })
            .catch((e) => {
                msg.channel.send("There was an error retrieving weather data: " + e);
            });
    }
});

client.on("guildMemberAdd", (member) => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(
        (ch) => ch.name === "member-log"
    );
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    msg.channel.send(`Welcome to the server, ${member}`);
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
        execute(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
        skip(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
        stop(message, serverQueue);
        return;
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Now playing: **${song.title}**`);
}
client.login("NzAxMTE1NzU3MTE0Njg3Njk5.Xv6ycA.gYsa47TKs0gMiOUMKR4snCEGfZ4")