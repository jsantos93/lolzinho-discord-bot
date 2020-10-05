require('dotenv').config();

var moment = require('moment');
const { Client } = require('discord.js');
const { channel_id, channel } = require('../config/config.js');
const client = new Client();
client.db = require("quick.db");
client.request = new (require("rss-parser"));
client.config = require("../config/config.js");
const PREFIX = ";"

client.login(client.config.DISCORD_BOT_TOKEN);

const isValidCommand = (message, cmdName) => message.content.toLowerCase().startsWith(PREFIX + cmdName);

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`);
    lolTime();
    handleUploads();
});

client.on('message', (message) =>{
    if(message.author.bot === true) 
        return;
    if(message.content.toLowerCase() === "que horas são?"){
        message.reply(`Hora do Lolzinho!`)
    }
    else if(isValidCommand(message, "say")){
        sendAdmMessage(message.content.substring(5))
    }
});

function lolTime(){
    setInterval(() => {
        var hour = moment().hour()
        var minute = moment().minute()

        if(hour === 19 && minute === 00){
            // const channel = await client.channels.cache.get('762689749818408973');
            const channel = client.channels.cache.find(channel => channel.name === 'general')
            channel.send("𝓗𝓸𝓻𝓪 𝓭𝓸 𝓛𝓸𝓵𝔃𝓲𝓷𝓱𝓸!")
        }
    }, 20000)
}  

function handleUploads() {
    if (client.db.fetch(`postedVideos`) === null) client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${client.config.channel_id}`)
        .then(data => {
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                let channel = client.channels.cache.get(client.config.general_channel);
                if (!channel) return;
                let message = client.config.messageTemplate
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, Discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }
        });
    }, client.config.watchInterval);
}

async function sendAdmMessage(message){
    let channel =  client.channels.cache.get(client.config.general_channel)
    channel.send(message)
}