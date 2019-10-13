
class Command { 
    constructor({ name, short, long, fn } = {}) { 
        this.name = name; 
        this.short = short;
        this.long = long; 
        this.fn = fn; 
    } 

    // RegExp to use for tokenizing strings. This will take a string and group words separated by spaces but allow for single quotes to include spaces into one word.
    static RE_TOKENIZER = /'[^']*'|[^ ]+/g
    static RE_COMMAND_SEPARATOR = /\s*[;\n]\s*/

    static defs = new Map();
    static get list() { return Array.from(Command.defs.keys()) }
    static clean(input) { return input.replace(/ +/, ' ').replace(/\s$/, '') }
    static tokenize(input) { return input.split(Command.RE_COMMAND_SEPARATOR).map(i => i.match(Command.RE_TOKENIZER)) }
    static autocomplete(input, list) { 
        let re = new RegExp(`^${input}`); 
        if (list.includes(input)) { return input }
        else { return list.filter(n => re.test(n))[0] }
    }

    static parse(input) {
        input = Command.tokenize(Command.clean(input));
        input = input.filter(e => e !== null )
        input = input.map(e => { return { command: e[0], args: e.slice(1) }})
        input = input.map(e => { e.command = Command.autocomplete(e.command, Command.list); return e })
        input = input.map(e => { e.command = e.command ? Command.defs.get(e.command) : UNKNOWN_COMMAND; return e })
        return input;
    }
}

const UNKNOWN_COMMAND = new Command({ short: 'Huh?', fn: ({ client }) => { client.send('Huh!?') } });

Command.defs.set('quit', new Command({ 
    name: 'quit',
    short: 'disconnects from the server',
    fn: ({ client }) => { client.disconnect('Good-bye!') },
}));

Command.defs.set('look', new Command({
    name: 'look',
    short: 'look at something or someone',
    fn: ({ client, args }) => { let target = args[0]; client.send(`You look at ${target}.`) }
}));

module.exports = { Command, UNKNOWN_COMMAND }