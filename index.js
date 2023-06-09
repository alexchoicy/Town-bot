const path = require('path');
require('dotenv').config();
require("./cronJobs/jobs.js");
const Discord = require('discord.js')
const {bot} = require("./discord/init.js");
const fs = require("fs");


function setCommand(commandName, command){
    bot.commands.set(commandName, command);
    console.log("Loaded command: "+commandName);
}

function readCommands(directory, subDirectory = ""){
    
    const dirPath = path.resolve(__dirname, directory);
    const commands = fs.readdirSync(dirPath);

    for(const file of commands){
        const commandName = file.split(".");
        if(commandName[1]){
            const command = require(dirPath+`/${file}`);

            setCommand((subDirectory ? subDirectory+"-" : subDirectory) +commandName[0], command);
        }
        else{
            return readCommands(directory+"/"+commandName[0], commandName[0]);
        }
    }
}

    bot.commands = new Discord.Collection()
    readCommands('./discord/slash_commands');

// function readEvent(directory, subDirectory = ""){
//     const eventsPath = path.resolve(__dirname, directory);
//     const events = fs.readdirSync(eventsPath);

//     for(const file of events){
//         const eventName = file.split(".");
//         if(eventName[1]){
//             const event = require(eventsPath+`/${file}`);

//             bot.on(eventName.name, event.execute(null, bot));
//         }
//     }
// }

// readEvent('./Events');



bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
	const { commandName } = interaction;
    const subCommand = interaction.options.getSubcommand(false);
    bot.commands.get(subCommand ? `${commandName}-${subCommand}` : commandName)?.run(bot,interaction);   
});

