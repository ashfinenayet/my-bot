const Discord = require("discord.js");
const { Structures } = require("discord.js");
const { CommandoClient } = require("discord.js-commando");
const path = require('path');
const { prefix, token } = require('./config.json');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');




const fs = require('fs')

Structures.extend('Guild', function(Guild) {
    class MusicGuild extends Guild {
      constructor(client, data) {
        super(client, data);
        this.musicData = {
          queue: [],
          isPlaying: false,
          nowPlaying: null,
          songDispatcher: null,
          volume: 1
        };
        this.triviaData = {
          isTriviaRunning: false,
          wasTriviaEndCalled: false,
          triviaQueue: [],
          triviaScore: new Map()
        };
      }
    }
    return MusicGuild;
  });
const client = new CommandoClient({
    commandPrefix: prefix,
    owner: '352293239014817793',
    unknownCommandResponse: false
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['music', 'Music Command Group'],
        ['other', 'Miscellaneous Command Group'],
        ['admin', 'Administrative Command Group'],
        ['news', 'News Command Group'],
        ['levels', 'Points Command Group']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}
client.on("ready", () => {
    client.user.setActivity("You", { type: "WATCHING" })
    console.log(`Logged in as ${client.user.tag}!`);
   
  });

  const Enmap = require("enmap");
  client.points = new Enmap({name: "points"});

//const serverQueue = queue.get(message.guild.id);

  
  /* END POINTS ATTRIBUTION. Now let's have some fun with commands. */

  // As usual, we stop processing if the message does not start with our prefix.
  

  // Also we use the config prefix to get our arguments and command:
  
  
  // Let's build some useful ones for our points system.

 

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



client.login(token)