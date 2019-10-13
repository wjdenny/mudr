const promisify = require('util').promisify,
      readline  = require('readline'),
      Socket    = require('net').Socket,
      Engine    = require('./Engine')

// ### Promsify readline
readline.Interface.prototype.question[promisify.custom] = function (prompt) { return new Promise(resolve => { readline.Interface.prototype.question.call(this, prompt, resolve) }) }
readline.Interface.prototype.questionAsync = promisify(readline.Interface.prototype.question);

const E_DISCONNECTED = new Error(`The client has already disconnected.`)
const E_SIGINT = new Error(`Client stream received SIGINT signal.`)
const E_INVALID_ENGINE = new Error(`Client instance created with an invalid Engine instance.`)
const E_INVALID_SOCKET = new Error(`Client instance created with an invalid socket.`)

class Client {
	constructor({ socket, engine } = {}) {
		// ### Argument Validation

		this.engine = engine;
		this.socket = socket;
		let L = this.engine.localization;

		this.stream = readline.createInterface(socket, socket);
		
		// ### MOTD / Welcome message 
		// A quick welcome message to let them know everything is good. Most MUDs use some kind of ASCII art in a "message of the day," or MOTD. There should be a configuration option in the constructor that lets you select a file to send or a function that returns the text to send.
		//
		// <mark>**TODO**: replace with MOTD option.</mark>
		this.send(L('SERVER_GREETING', this.engine.title));
		
		// ### Authentication
		// I won't bother with authentication right now, but just to ask for their email address and accept any password. This should be handled more appropriately very soon.
		(async () => { this.user = await this.authenticate() })();

		// ### Load characters
		this.characters = [ {} ]
		
		// ### Choose a character
		this.activeCharacter = this.characters[0]

		// ### Command loop and parsing
		this.stream.on('line', data => { 
			let commands = this.engine.commandParser.parse(data);
			console.log(commands)
			commands.forEach(i => { i.command.fn({ client: this, args: i.args }) })
		})

		// ### Error handling
		this.socket.on('error', error => { this.engine.events.emit('client error', error, client) })
	}

	get remoteHost() { return this.socket.remoteAddress.split(':').slice(-1)[0] }
	get remotePort() { return this.socket.remotePort }

	disconnect(message) { this.send(message); this.socket.end() }
	send(message) { this.socket.write(`${message}\n`) }

	async authenticate() { 
		let user = await this.stream.questionAsync('E-mail address: '); 
		let passwd = await this.stream.questionAsync('Password: '); 
		this.engine.events.emit('client authentication success', this)
		return { user, passwd } 
	}

	exec(string) { let cp = this.engine.commandParser; cp.exec(this, cp.parse(string)) }
}

module.exports = Client