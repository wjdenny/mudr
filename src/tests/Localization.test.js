const {assert, expect, should} = require('chai');
const iso6391 = require('iso-639-1');
const Localization = require('../Localization.js');

let L;

setup(() => { L = Localization('en'); })

suite('Localization', () => {
    test('returns a Localization function', () => { expect(L).to.be.a('function') });
    test('rejects a non-string lang argument', () => { expect(() => { L = Localization(42) }).to.throw(TypeError) });
    test('rejects a non-ISO 639-1 lang argument', () => { expect(() => { L = Localization('not valid') }).to.throw(TypeError)});
    test('L function returns a string', () => { expect(L('SERVER_GREETING')).to.be.a('string'); });
    test('throws an error for an invalid key', () => { expect(() => { return L('not a valid key')}).to.throw(Error) });
});