const Discord = require('discord.js') // Discord.js package, the core package of the project
const {token} = require('./config.json') // In my case, i have a file called config.json where i store optinal data like the token, the prefix etc.
const fs = require('fs') // fs (or file system) is a package that should be already installed on your machine by default. it's used to find and edit directories, files etc.
const chalk = require('chalk') // Chalk is used to give a stylish touch to the console. This is not important, but makes the console look very cute

//Initialize Collections and client
const client = new Discord.Client() // Some people call this bot, but mainly this is the real core of the project, without this, the bot wouldn't be able to start at all
client.commands = new Discord.Collection() //This collection will store the commands list
client.cooldowns = new Discord.Collection() //This collection will store the cooldown of each command

//Define Variables and constants
let cmdarray = [] // We will later need this to define the amount of the commands
let index = 1 // We will later need this to increase it according to the number of commands loaded
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js')) // This is used to filter

//Create Array of Commands
for(const file of commandFiles){
    let cmdname_= file.split('.')[0]
    cmdarray.push(cmdname_)
}

//Cute little green line to separate the commands loading from the CLI user input
console.log(chalk.green('-------------------------'))

//Iterate through all command files and load them
    for(const file of commandFiles){
        const command = require(`./commands/${file}`) //Require the command file
        client.commands.set(command.name, command) //Load the commands in the client
        const cmdname = file.split('.')[0] //Define the name of the command. Ex. if the file is called 'ping.js', it will split it to 'ping' and 'js', then it gets the first element ('ping)
        console.log(chalk.magenta(chalk.bold(`${cmdname} command loaded! [${index}/${cmdarray.length}]`))) //Logs the loaded command. Ex. if there are 4 commands, it will output in the following:
        /*
        help command loaded! [1/4]
        ping command loaded! [2/4]
        mute command loaded! [3/4]
        unmute command loaded! [4/4]
        */
        index++ //Everytime a command is loaded, the index ([index / 4]) will increase by one
    }

//Reset the index value
index = 1

//Another cute little green separator line to separate the commands loading from the events loading
    console.log(chalk.green('-------------------------'))

//Events loading
fs.readdir('./events', (err, files) =>{ // Reads the directory called events
    if (err) return console.log(chalk.red(err)) // If there is an error reading the events directory, returns a red error in the console
    files.forEach(file => { // Starts a forEach function, where the following code block is executed for every file in the events directory
        if (!file.endsWith('js')) return // Specifies that we are going to treat files that end with .js only (like ready.js, message.js)
        const event = require(`./events/${file}`) // Requires the event module directly from the directory. Ex. if the file is called ready.js, it will require PROJECT/events/ready.js
        const eventName = file.split('.')[0] // Just like we saw earlier (line 46), it's used to define the event name
        client.on(eventName, event.bind(null, client)) // Loads the events from the directory
        delete require.cache[require.resolve(`./events/${file}`)] // Deletes the cached data of the events
        console.log(chalk.blue(chalk.bold(`${eventName} loaded! [${index}/${files.length}]`))) // Just like earlier, we log the events loaded in a fancy way
        index++
    })
    
    console.log(chalk.green('-------------------------')) //Last Separator cause why not ¯\_(ツ)_/¯
})

client.login(token) //Finally, logs in with the token of the bot
