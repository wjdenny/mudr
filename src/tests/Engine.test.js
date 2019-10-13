const expect = require('chai').expect
const Engine = require('../Engine');
const iso6391 = require('iso-639-1');

const title = 'The Test Server', port = 4449, lang = 'en'
const game = new Engine({ title, port, lang })

suite('Engine', () => {
    test('has a string title', () => { expect(game.title).to.be.a('string') });
    test('has a numeric port', () => { expect(game.port).to.be.a('number') });
    test('has a clients Map', () => { expect(game.clients).to.be.an.instanceof(Map) });
    test('uses the provided title', () => { expect(game.title).to.equal(title) });
    test('uses the provided port', () => { expect(game.port).to.equal(port) });
    test('rejects a non-string title', () => { expect(() => { new Engine({ title: 1337 })}).to.throw(TypeError) });
    test('rejects a non-numeric port', () => { expect(() => { new Engine({ port: 'not a number' })}).to.throw(TypeError) });
    test('rejects a non-iso 639-1 language code', () => { expect(() => { new Engine({ lang: 'not a language code' })}).to.throw(TypeError) });
    test('has a start method', () => { expect(game.start).to.be.a('Function') });
    test('has a stop method', () => { expect(game.stop).to.be.a('Function') }); 
});