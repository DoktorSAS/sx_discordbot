
/*
    Code Developed by DoktorSAS - Join in Sorex Discord To Report Any BUGS
    Version 1.0
    Description: This is a simple system to mange multi account of players, with this system
                 it's really hard for a hacker to steal another user's identity...

    For more info about SXAdminTool look the website or Join in the comunity:
    Discord: https://discord.io/Sorex on google, Discord.gg/nCP2y4J on discord or https://discord.com/invite/nCP2y4J
    Twitter: @SorexProject -> https://twitter.com/SorexProject
    Instagram: @SorexProject -> https://www.instagram.com/sorexproject/
    Youtube: SorexProject -> https://www.youtube.com/channel/UCP1SC3K8rg3fLAeRFlkM6cg
    
    If you want Donate to the project Donate to https://www.paypal.me/SorexProject 

    PS:
    Don't remove credits and don't try to sell the code to someone else, don't be an asshole scammer.
    I made this code to help the others, is a free tool with opensource to all
*/

const Discord = require('discord.js');
const bot = new Discord.Client();
const mysql = require('mysql');
var logChannelName = "log"; //Change the neme of the log channel if you don't like log 
var logChannelID = 'logChannelID'; //Write the ID of the log Channel
var logChannel = null;
var chatChannelName = "chat"; //Change the neme of the chat channel if you don't like chat 
var chatChannelID = 'chatChannelID'; //Write the ID of the chat Channel
var chatChannel = null;

const connection = mysql.createConnection({
  host     : 'localhost', //If you don't host the database on the same machine change localhost with the ip og the machine with the database
  port     : '3306', //If you use another port different then the defaul 3306 change it
  user     : 'root', //If your root name is anorher change the name
  password : '', //If you use password for the DB remeber to use it there
  database : 'sx_database', //if you don't use this database remember to change it
  charset : 'utf8mb4'
});

connection.connect(err => {
    console.log("SXAdminBot v1.0")
    console.log("Discord: Discord.ioSorex on google or https://discord.gg/nCP2y4J")
    console.log("Developed by DoktorSAS")
    console.log("============================================================================================")
    if(err) throw err;
    else{
    console.log("[SXAdminBot] Connected to the Database")
    console.log("[SXAdminBot] Loaded")
    }
});

const token = 'YOURTOKEN';

const prefix = 'sx!';

bot.on('ready', () =>{   
    bot.user.setActivity("DoktorSAS is mine owner", { type: "WATCHING"})
    bot.user.setStatus("online");
    logChannel = bot.channels.cache.get(logChannelID);
    chatChannel = bot.channels.cache.get(chatChannelID); 
    if(logChannel != undefined && chatChannel != undefined && chatChannel != "chatChannelID" && logChannel != "logChannelID"){
        setInterval(logChannelID_message, 4000);
    }else{
        console.log("SXAdmin: Not valid id or you did not change the ID, if the bot crash its becayse the Chat and Log CHANNEL ID are wrong")
    }
});

bot.on('message', message =>{
    const args = message.content.substring(prefix.length).split(" ");
    switch(args[0]){
        //Help Commands
        case 'help':
        case 'h':
            message.channel.send('**SXAdmin HELP** There a list of commands: \n sx!verifyme {username} {password}');
        break;
        case 'init':
            console.log(message.guild.channels.cache.find(channel => channel.name === logChannelName));
            if (message.guild.channels.cache.find(channel => channel.name === logChannelName)){
                message.guild.channels.cache.find(channel => channel.name === logChannelName).send("**This is the channel dedicated for the LOG**");
            }else{
                message.channel.send('**There no channel with this ID** \n Im creating the LOG channel for you');
                message.guild.channels.create(logChannelName);
            }
            if (message.guild.channels.cache.find(channel => channel.name === chatChannelName)){
                message.guild.channels.cache.find(channel => channel.name === chatChannelName).send("**This is the channel dedicated for the FIVEM CHAT**");
            }else{
                message.channel.send('**There no channel with this ID** \n Im creating the CHAT channel for you');
                message.guild.channels.create(chatChannelName);
            }
        break;
        case 'verifyme':
            if (args[1] != undefined){
                if(args[2] != undefined){
                    message.delete();
                    connection.query(`SELECT pin FROM sx_users WHERE username LIKE '`+args[1]+`' AND password LIKE '`+args[2]+`'`, function (err, res) {
                        if(res.length > 0){
                            message.author.send('**Thanks for Playing on This Server**\n**Your PIN: ** ' + res[0].pin);
                        }else{
                            message.channel.send("**Not Valid Arguments**\n Error: There no account with this password and this username"); 
                        }
                        });
                }else{
                    message.channel.send("**Missing Arguments**\n Error: Missing password");
                }
            }else{
                message.channel.send("**Missing Arguments**\n Error: Missing username and password");
            }
        break;
        }
});

function logChannelID_message(){
    connection.query(`SELECT * FROM sx_log WHERE id LIKE (SELECT last_id FROM sx_log  WHERE id = 1)`, function (err, res) {
        connection.query(`UPDATE sx_log SET max_id = (SELECT MAX(id) FROM sx_log)`, function (err, result) {});
        if(res.length > 0){
            connection.query(`SELECT * FROM sx_log WHERE id = 1`, function (err, r) {
                if(r[0].last_id > (r[0].max_id + 1)){
                    connection.query(`UPDATE sx_log SET last_id = '`+ (r[0].max_id + 1) + `' WHERE id = 1`, function (err, res) {});
                }else{
                    connection.query(`UPDATE sx_log SET last_id = '`+ (r[0].last_id + 1) +`'  WHERE id = 1`, function (err, res) {});
                }
            });
            var m = "["+res[0].data_of_msg+"]**"+res[0].username + "** *" + res[0].msg + "*";
            if(res[0].typology == "Chat"){
                chatChannel.send(m);
            }else{
                logChannel.send(m);
            }
        }
    });

    
}

bot.login(token);


