require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = "-"


client.once('ready', () => {
    console.log(`${client.user.username} has logged in`);
});

client.on('message', (message) =>{
    if(message.author.bot === true) 
        return;
    if(message.content.toLowerCase() === "que horas são?"){
        message.reply(`Hora do Lolzinho!`)
    }
});

client.on('message', (message)=>{
    if(message.author.bot === true) return;
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);
        
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
