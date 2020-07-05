const Discord = require("discord.js")


const config = require('./config.json');


const ytdl = require("ytdl-core");

const client = new Discord.Client()
const fs = require('fs')
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}
var servers = {};
const queue = new Map();
client.on("ready", () => {
    client.user.setActivity("You", { type: "WATCHING" })
    console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = "!";

//const serverQueue = queue.get(message.guild.id);


var sayings = new Array();
sayings[0] = "spaghetti";
//insert as many saying as you like 
client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.content.startsWith(prefix + "saying")) {
        var i = Math.floor(Math.random() * sayings.length);
        message.reply(sayings[i]);


    } else if (message.content.startsWith(`${prefix}meme`)) {
        client.commands.get('meme').execute(message);
    } else if (message.content.startsWith(`${prefix}weather`)) {
        client.commands.get('weather').execute(message);
    } else if (message.content.startsWith(`${prefix}play`)) {
        client.commands.get('play').execute(message);
    } else if (message.content.startsWith(`${prefix}skip`)) {
        client.commands.get('skip').execute(message);

    } else if (message.content.startsWith(`${prefix}stop`)) {
        client.commands.get('stop').execute(message);
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
    message.channel.send(`Welcome to the server, ${member}`);
});




client.login(config.token)