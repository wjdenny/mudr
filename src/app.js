const Engine = require('./Engine')

// // Create a Winston logger to use throughout the life of the server. We want to log errors to the error log file, but more information can be printed to the console.
// const { transports, createLogger, format } = require('winston');
// const logger = createLogger({
// 	format: format.combine(format.timestamp(), format.json()),
// 	transports: [
// 		new transports.Console({ level: 'verbose' }),
// 		new transports.File({ 
// 			filename: 'error.log',
// 			level: 'verbose'
// 		})
// 	]
// });

// Create a new instance of Engine with the desired title, port, and logger. If you're running this on a hosted platform, make sure to check their directions on assigning ports to your apps.
game = new Engine({
    title: 'Lords of Javascript',
    port: 4449,
    lang: 'en'
});

game.events.on('server error', erorr => { console.log(`Game error: ${error}.`) })
game.events.on('server close', () => { console.log(`Server has shut down.`) })
game.events.on('client connect', (client) => { console.log(`${client.remoteHost} has connected to the server.`) })
game.events.on('client authentication success', (client) => { console.log(`${client.user ? client.user.email : client.remoteHost} has authenticated with the server.`) })
game.events.on('client authentication fail', (client, email) => { console.log(`${client.remoteHost} has failed to authenticate as ${email}.`) })
game.events.on('client disconnect', (client) => { console.log(`${client.user.email} has disconnected from the server.`) })
game.events.on('client error', (error, client) => { console.log(`Error from ${client.user.email || client.remoteHost}: ${error}.` )})

// Start the game.
game.start();
