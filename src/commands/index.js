// This needs to be inherited from the Engine

const L = require('../Localization')('en');

function score(client) {
	client.send(L('divider'))
	client.send(`Account: ${client.user}             IP: ${client.socket.remoteHost}`)
}

module.exports = { score }