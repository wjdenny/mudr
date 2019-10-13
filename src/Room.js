const EventEmitter = require('events').EventEmitter;
function* RoomNumberGenerator() { let n = 0; while (true) { yield n++ } }
let roomNumberGenerator = RoomNumberGenerator();
let RoomExit = require('./RoomExit.js')

class Room {
    static names = [];

    constructor(options) {
        if (typeof options !== 'object') { throw new Error('Constructor argument must be an object.')}
        if (!options.title) { throw new Error('Room objects must have a title.' )}
        if (!options.description) { throw new Error('Room objects must have a description.' )}

        let defaults = {
            id: null,
            name: 'room',
            title: 'An empty room',
            description: 'You are floating in a vast empty space. You\'re not even sure if you\'re still alive.',
            area: 'none',
            exits: new Map()
        }

        options = { ...defaults, ...options }

        this.description = options.description;
        this.area = options.area;

        this.id = Room.assignRoomNumber();
        this.name = options.name;
        this.exits = new Map();

        this.eventEmitter = new EventEmitter();
    }

    static assignRoomNumber() { return roomNumberGenerator.next().value }
    get address() { return `${this.area}/${this.name || this.id}` }

    toString() { return JSON.stringify(this); }

    createExit(options) { 
        let exit = new RoomExit({ options });
        this.exits.set(exit.direction, exit);
        return this;
    }
    
    onEnter(listener) { this.eventEmitter.on('enter', listener); return this; }
    onLeave(listener) { this.eventEmitter.on('leave', listener); return this; }
    onTick(listener) { this.eventEmitter.on('tick', listener); return this; }
    onAction(listener) { this.eventEmitter.on('action', listener); return this; }

    emitEnter(creature, direction) { this.eventEmitter.emit('enter', creature, direction) }
    emitLeave(creature, direction) { this.eventEmitter.emit('leave', creature, direction) }
    emitTick(tick) { this.eventEmitter.emit('tick', tick) }
    emitAction(action) { this.eventEmitter.emit('action', action) }
}

module.exports = Room;