const Client = require('./Client')
const { Command } = require('./Command')
const createServer = require('net').createServer
const Localization = require('./Localization')
const EventEmitter = require('events').EventEmitter

const E_INVALID_TITLE = new TypeError('Engine instance created with an invalid or missing title');
const E_INVALID_PORT  = new TypeError('Engine instance created with an invalid or missing port.');
const E_INVALID_LANG  = new TypeError('Engine instance created with an invalid or missing language code.');


// # The Game Engine
// The `Engine` class represents a game server, along the state of the game itself. 
class Engine {
	// ## Error handling
	// Operational errors are expected to be handled by the production users via the `EventEmitter` instance, but there are a few errors that might happen during construction that we are better off throwing immediateely.

	// ## Engine.constructor(options)
	// The constructor takes a single argument which is an object of configuration options for settings up the server.
	constructor( { title, port, lang = 'en' } = {} ) {

		// Validate the arguments.
		if ( typeof title !== 'string' || title === '' ) throw E_INVALID_TITLE
		if ( typeof port !== 'number' ) throw E_INVALID_PORT
		
		this.title = title
		this.port = port

		this.localization = Localization(lang)
		this.commandParser = Command;

		// `Engine.prototype.clients` is a private variable of a Map that contains all of the authenticated and connected clients. They are indexed by e-mail address/username in an effort to prevent players from having more than one connection at a time. In a later release, this should be configurable.
		this.clients = new Map();

		// When an Engine instance is intialized, it creates a `net.server` instance and attaches it to the engine.
		// Set the connect listener and bind the Engine instance to `this` and also pass the client instance for detailed reporting. The connect event listener is a static method defined in [Client.js].
		this.server = createServer(socket => {
			let client = new Client({ socket, engine: this });
			
			// ### Client management
			// We want to add this socket to the list of clients that are connected to the game. This will help the game keep track of them when we need to trigger any actions from the server such as broadcast messages or automatically save data.
			this.clients.set(socket, client)
		});

		this.events = new EventEmitter();
		this.server.on('error', error => { this.events.emit('server error', error) })
		this.server.on('close', () => { this.events.emit('server close') })
	}

	// ## Engine.prototype.start()
	// Start the server and return a Promise that is resolved when `server.listen` succeeds and rejected when it throw an error.
	start() { return new Promise((resolve, reject) => { this.server.listen(this.port, (error) => { if (error) reject(error); else resolve(this) }) }) }

	// ## Engine.prototype.stop();
	// Stop the server and return a Promise.
	//
	// <mark>**TODO**: automatically save all player characters before closing.</mark>
	stop() { return new Promise((resolve, reject) => { this.server.close(error => { if (error) reject(error); else resolve(this) }) }) }
}

module.exports = Engine