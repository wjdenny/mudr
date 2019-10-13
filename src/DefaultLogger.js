const { transports, createLogger, format } = require('winston');

module.exports = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [ new transports.File({ filename: 'error.log', level: 'error' }) ]
});