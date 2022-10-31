const Discord = require('discord.js');
const fs = require('fs');
const lineReader = require('line-reader');

const client = new Discord.Client();

const prefix = '~'

client.once('ready', () => { console.log('Censor online'); });

client.on('message', message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send('pong!');
        }
    } else if (command === 'sort') {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            var textarray = [];
            var y = 0;
            var z = 0;
            lineReader.eachLine("./censorlist.txt", function (line, last) {
                if (last) {
                    textarray[y] = line;
                    textarray.sort(function (a, b) { return b.length - a.length });
                    fs.writeFile("./censorlist.txt", "", function (err) { });
                    for (z = 0; z < textarray.length; z++) {
                        fs.appendFile("./censorlist.txt", textarray[z] + "\r\n", function (err) { });
                    }
                } else {
                    textarray[y] = line;
                    y++
                }
            });
            message.channel.send('Censor list has been sorted!');
        }
    }
    else if (command === 'censor') {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            var x = 0;
            var phrase = "";
            var textarray = [];
            var y = 0;
            var z = 0;
            for (x = 0; x < args.length; x++) {
                phrase = phrase.concat(args[x], " ");
            }
            phrase = phrase.toLowerCase();
            fs.appendFile("./censorlist.txt", phrase.trim() + "\r\n", function (err) { if (err) { message.channel.send('Failed to add phrase to list, please try again later'); } else { message.channel.send(phrase.trim() + ' has been added to the censor list'); } });
            lineReader.eachLine("./censorlist.txt", function (line, last) {
                if (last) {
                    textarray[y] = line;
                    textarray.sort(function (a, b) { return b.length - a.length });
                    fs.writeFile("./censorlist.txt", "", function (err) { });
                    for (z = 0; z < textarray.length; z++) {
                        fs.appendFile("./censorlist.txt", textarray[z] + "\r\n", function (err) { });
                    }
                } else {
                    textarray[y] = line;
                    y++
                }
            });
        }
    }
    else {
        var str = message.content.toLowerCase();
        var re = /\|\|(.*?)\|\|/;
		var ra = /\r?\n|\r/g;
        var match;
        var needscensoring = "Please censor ";
        var censorneeded = false;
        while ((match = ra.exec(str)) !== null) {
            var str = str.replace(ra, "");
        }
        while ((match = re.exec(str)) !== null) {
            var str = str.replace(re, "");
        }
        lineReader.eachLine("./censorlist.txt", function (line, last) {
            var regtotest = new RegExp("\\b"+line+"\\b");
            if (last) {
                if (match = regtotest.exec(str)) {
                    censorneeded = true;
                    needscensoring = needscensoring.concat("||", line, "||", ", ");
                    if (censorneeded == true) {
                        needscensoring = needscensoring.concat("<@", message.author.id, ">", " Note: This is a new bot in progress, errors will occur; If your message is fine, ignore the bot.");
                        message.channel.send(needscensoring);
                    }
                } else {
                    if (censorneeded == true) {
                        needscensoring = needscensoring.concat("<@", message.author.id, ">", " Note: This is a new bot in progress, errors will occur; If your message is fine, ignore the bot.");
                        message.channel.send(needscensoring);
                    }
                }
            } else {
                if (match = regtotest.exec(str)) {
                    censorneeded = true;
                    needscensoring = needscensoring.concat("||", line, "||", ", ");
                    str = str.replace(line, "");
                }
            }
        })
    }
});


client.login('');

