const {assert, expect, should} = require('chai');
const Room = require('../Room.js');
const Logger = require('../DefaultLogger.js');
const RoomExit = require('../RoomExit.js')

Logger.transports.forEach((e) => { e.silent = true; });

const roomOptions = {
    title: 'An empty void',
    description: 'Your senses go numb as you float effortlessly through a black empty void.',
    area: 'void'
}

suite("Room", () => {
    suite("Constructor", () => {
        test("can be constructed with the 'new' keyword", () => {
            expect(() => { let room = new Room() }).not.to.throw(/constructor/);
        })
        
        test("constructor requires an object argument", () => {
            expect(() => { let room = new Room("This won't work") }).to.throw(/object/);
        })

        test("constructor requires a title", () => { 
            expect(() => { let room = new Room( {} ) }).to.throw(/title/);
        });

        test("constructor requires a description", () => { 
            expect(() => { let room = new Room( { title: 'A valid title'} ); }).to.throw(/description/);
        });

        test("address generates an address for the room", () => {
            expect(new Room({ 
                title: 'A valid title', 
                description: 'This is a short, but valid description.',
                name: 'valid-room',
                area: 'void'
            }).address).to.equal('void/valid-room');
        })

        test('rooms are assigned an incrementing number', () => {
            let rooms = [ new Room( roomOptions ), new Room( roomOptions ) ];
            expect(rooms[0].id).to.equal(rooms[1].id-1);
        })

        suite('createExit', () => {
            test('is a function', () => {
                let room = new Room( roomOptions );
                expect(room.createExit).to.be.a('function');
            });

            test('is chainable, returning the room object', () => {
                let room = new Room( roomOptions );
                let otherRoom = new Room({ ...roomOptions, title: 'Another room' });
    
                r = room.createExit({ direction: 'east', to: otherRoom });
                expect(r).to.be.an.instanceOf(Room);
            });

            test('adds the given exit to its list of exits', () => {
                let room = new Room( roomOptions )
                let otherRoom = new Room({ ...roomOptions, title: 'Another room' })
                
                room.createExit({ direction: 'east', to: otherRoom, short: 'the doorway' })
                expect(room.exits.size).to.equal(1);
            })
        });

        suite('Room events', () => { 
            test('onEnter is chainable, returning the room', () => {
                let room = new Room( roomOptions );

                expect(room.onEnter).to.be.a('function')
                expect(room.onEnter(() => {})).to.be.an.instanceOf(Room);
            });

            test('onLeave is chainable, returning the room', () => {
                let room = new Room( roomOptions );

                expect(room.onLeave).to.be.a('function')
                expect(room.onLeave(() => {})).to.be.an.instanceOf(Room);
            });

            test('onTick is chainable, returning the room', () => {
                let room = new Room( roomOptions );

                expect(room.onTick).to.be.a('function')
                expect(room.onTick(() => {})).to.be.an.instanceOf(Room);
            });

            test('onAction is chainable, returning the room', () => {
                let room = new Room( roomOptions );

                expect(room.onAction).to.be.a('function')
                expect(room.onAction(() => {})).to.be.an.instanceOf(Room);
            });

            test('onEnter fires', () => {
                let room = new Room( roomOptions );
                room.onEnter((...args) => { expect(args).to.have.lengthOf(2) });
                room.eventEmitter.emit('enter', {}, {})
            });

            test('onLeave fires', () => {
                let room = new Room( roomOptions );
                room.onLeave((...args) => { expect(args).to.have.lengthOf(2) });
                room.eventEmitter.emit('leave', {}, {})
            });

            test('onTick fires', () => {
                let room = new Room( roomOptions );
                room.onTick((...args) => { expect(args).to.have.lengthOf(1) });
                room.eventEmitter.emit('tick', {})
            });

            test('onAction fires', () => {
                let room = new Room( roomOptions );
                room.onAction((...args) => { expect(args).to.have.lengthOf(1) });
                room.eventEmitter.emit('action', {})
            });
        });
    });
});