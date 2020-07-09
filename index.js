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
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!table['count(*)']) {
      // If the table isn't there, create it and setup the database correctly.
      sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
      // Ensure that the "id" row is always unique and indexed.
      sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
      sql.pragma("synchronous = 1");
      sql.pragma("journal_mode = wal");
    }
  
    // And then we have two prepared statements to get and set the score data.
    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
  });



//const serverQueue = queue.get(message.guild.id);
client.on("message", message => {
  if (message.author.bot) return;
  let score;
  if (message.guild) {
    score = client.getScore.get(message.author.id, message.guild.id);
    if (!score) {
      score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 1 }
    }
    score.points++;
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if(score.level < curLevel) {
      score.level++;
      message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
    }
    client.setScore.run(score);
  }
  

  
  // Command-specific code here!
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



client.login(token)