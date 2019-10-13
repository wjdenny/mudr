const iso6391 = require('iso-639-1')

// ## Strings
// Define all the strings that will be used to report to the logger, console, or client. Keeping them all together makes it easier to add language support and make other changes. Soon I need to refactor and move this into it's own module.

const Strings = {
	NEW_CONNECTION:       { 'en': (remoteHost) => { return `There is a new connection to the server from ${remoteHost}.` } },
	END_CONNECTION:       { 'en': (remoteHost) => { return `The connection from ${remoteHost}' has ended.` } },
	SERVER_GREETING:      { 'en': (gameTitle) => { return `Welcome to ${gameTitle}!` } },
	SERVER_READY:         { 'en': (port) => { return `The server is now listening on port ${port}.`} },
	E_INVALID_LANG:       { 'en': (lang) => { return new TypeError(`Localization initialized with an invalid language code (${lang}).`) }},
	E_UNSUPPORTED_LANG:   { 'en': (lang) => { return new TypeError(`Localization doesn\'t support the selected language (${lang}).`) }},
	E_UNSUPPORTED_STRING: { 'en': (string) => { return new TypeError(`Localization for the chosen string (${string}) isn\'t supported.`) }}
}

module.exports = function(lang = 'en') { 
	if (typeof lang !== 'string' || !iso6391.validate(lang)) { throw Strings.E_INVALID_LANG['en'](lang) }

	Object.keys(Strings).forEach((key) => { if ( !Strings[key][lang] ) { throw Strings.E_UNSUPPORED_LANG['en'](lang) } })

	return function (key, ...args) {
		if ( !Strings[key] ) { throw Strings.E_UNSUPPORTED_STRING['en'](key) }
		else { return Strings[key][lang](args) }
	}
}