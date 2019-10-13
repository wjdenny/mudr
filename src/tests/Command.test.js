const { expect } = require('chai');
const Client = require('../Client')
const sinon = require('sinon')

const { Command, UNKNOWN_COMMAND } = require('../Command');
const client = sinon.createStubInstance(Client)

let get = sinon.createStubInstance(Command)
let give = sinon.createStubInstance(Command)

Command.defs = new Map();
Command.defs.set('get', get);
Command.defs.set('give', give);

suite('Command', () => {
    suite('#clean', () => {
        let clean = Command.clean
        test('is a function', () => { expect(clean).to.be.a('function') })
        test('returns a string', () => { expect(clean('testing')).to.be.a('string') })
        test('removes extra spaces', () => { expect(clean('one   two')).to.equal('one two') })
        test('doesn\'t remove middle newlines', () => { expect(clean('one\ntwo')).to.equal('one\ntwo') })
        test('removes final whitespace', () => { expect(clean('testing ')).to.equal('testing') })
        test('removes final carriage returns', () => { expect(clean('testing\n')).to.equal('testing') })
    })

    suite('#tokenize', () => {
        let tokenize = Command.tokenize
        test('splits on new lines', () => { expect(tokenize('get one\ngive one')).to.have.length(2) })
        test('splits into word and single-quote delimited tokens', () => { expect(tokenize('get one \'long one\'')[0]).to.have.length(3) })
    })
    
    suite('#autocomplete', () => {
        let list = ['lo', 'long', 'longer', 'lonx'].sort()
        let auto = Command.autocomplete
        test('is a function', () => { expect(auto).to.be.a('function') })
        test('returns a string', () => { expect(auto('lo', list)).to.be.a('string') })
        test('returns the exact match if it exists', () => { expect(auto('lo', list)).to.equal('lo') })
        test('completes the rest of the string for the first item it matches the beginning of', () => {
            expect(auto('lon', list)).to.equal('long')
        })

    })

    suite('#parse', () => {
        let parse = Command.parse
        test('is a function', () => { expect(parse).to.be.a('function') })
        test('returns an array', () => { expect(parse('test')).to.be.an('array') })
        test('- of objects that have command and args keys', () => { expect(parse('give')[0]).to.have.keys(['command', 'args']) })
        test('returns special command for unrecognizable input', () => {
            expect(parse('whatever')[0].command).to.deep.equal(UNKNOWN_COMMAND)
        })
    })
})