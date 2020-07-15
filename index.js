const Discord = require("discord.js");
const { Structures } = require("discord.js");
const { CommandoClient } = require("discord.js-commando");
const path = require('path');

var db = require('quick.db')
require('dotenv').config();
const TOKEN = process.env.TOKEN;
const prefix = process.env.prefix;
const fs = require('fs')

Structures.extend('Guild', function (Guild) {
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




//const serverQueue = queue.get(message.guild.id);


/* END POINTS ATTRIBUTION. Now let's have some fun with commands. */

// As usual, we stop processing if the message does not start with our prefix.


// Also we use the config prefix to get our arguments and command:

client.on("message", async message => {
  db.add(`messages_${message.guild.id}_${message.author.id}`, 1)
  let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`)

  let messages;
  if (messagefetch == 25) messages = 25; //Level 1
  else if (messagefetch == 65) messages = 65; // Level 2
  else if (messagefetch == 115) messages = 115; // Level 3
  else if (messagefetch == 200) messages = 200; // Level 4
  else if (messagefetch == 300) messages = 300; // Level 5

  if (!isNaN(messages)) {
    db.add(`level_${message.guild.id}_${message.author.id}`, 1)
    let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`)

    let levelembed = new Discord.MessageEmbed()
      .setDescription(`${message.author}, You have leveled up to level ${levelfetch}`)
    message.channel.send(levelembed)
  }
})
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



client.login(TOKEN);