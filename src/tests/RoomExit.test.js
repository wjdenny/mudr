const {assert, expect, should} = require('chai');
const Logger = require('../DefaultLogger.js');
const RoomExit = require('../RoomExit.js')
const Room = require('../Room.js');

Logger.transports.forEach((e) => { e.silent = true; });

suite('RoomExit', () => {
    suite('Constructor', () => { 
        test('can be constructed with the \'new\' keyword')
        test('requires a direction')
        test('requires a short description')
        test('requires a long description')
        test('requires a room to exit to')
    });

    suite('Events', () => {
        test('onOpen is chainable, returning the exit');
        test('onClose is chainable, returning the exit');
        test('onUnlock is chainable, returning the exit');
        test('onLock is chainable, returning the exit');
        test('onEnter is chainable, returning the exit');
        test('onOpen fires');
        test('onClose fires');
        test('onUnlock fires');
        test('onLock fires');
        test('onEnter fires');
    });
});