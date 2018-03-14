const Sequalize = require('sequelize');
const sequalize = new Sequalize('tema2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: log => {
        console.log(log);
    }
});

sequalize
    .authenticate()
    .then(_ => {
        console.log('Connections to database successfull');
    })
    .catch(_ => {
        console.error('Unable to connect to database');
    });
module.exports = sequalize;
