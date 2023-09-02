const { 
Client,
GatewayIntentBits,
Partials,
Collection,
ActivityType
} = require("discord.js");
const YoutubePoster = require("discord-youtube");
const logs = require("discord-logs");
const express = require("express");
const http = require("http");
const { Server } = require("ws");
const path = require("path");

const port = 3000;
const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const { handleLogs } = require("./Handlers/handleLogs");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
   intents: [Object.keys(GatewayIntentBits)],
   partials: [Object.keys(Partials)],
});

logs(client, {
  debug: true
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true, // you can change this to false if you want the bot not to leave when it finishes the queqe of the songs.
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});
client.commands = new Collection();
client.config = require("./config.json");
client.giveawayConfig = require("./config.js");

['giveawayseventHandler', 'giveawaysManager'].forEach((x) => { // make sure it's in the right order.
  require(`./Utils/${x}`)(client);
})

client.on('ready', (client) => {
  setInterval(() => {
    let status = [
      { name: '1', type: ActivityType.Watching },
      { name: '2', type: ActivityType.Playing },
      { name: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} people 👀`, type: ActivityType.Watching },
      { name: `Bot by 121afaswpos`, type: ActivityType.Watching },
      {name: `${client.guilds.cache.size} servers!🤗`, type: ActivityType.Watching },
      { name: '/help', type: ActivityType.Playing },
      {name: `to world`, type: ActivityType.Competing },
    ];
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 4000); //refresh 4 seconds
});

module.exports = client;

client.login(client.config.token).then(() => {
  handleLogs(client);
  loadEvents(client);
  loadCommands(client);
});