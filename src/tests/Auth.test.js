// const {assert, expect, should} = require('chai');
// const bcrypt = require('bcryptjs');
// const bcryptSaltRounds = 12;
// const mongoose = require('mongoose');
// const User = require('../User.js');

// setup((done) => {
//     mongoose.connect('mongodb://localhost/testDatabase');
//     const db = mongoose.connection;

//     db.on('error', (error) => { throw new Error(error) });
//     db.once('open', () => { done() });
// });

// suite('Database tests', () => {
//     test('should save a new user to the database', (done) => {
//         bcrypt.hash('test12345', bcryptSaltRounds)
//         .then((hashedPassword) => {
//             let user = User({ name: 'New User', email: 'new@user.com', password: hashedPassword });
//             user.save(done);
//         })
//         .catch((error) => { done(error) });
//     });

//     test('should reject a badly formed User', (done) => {
//         let user = User({ notName: 'New User' });
//         user.save(done);
//     });
// });