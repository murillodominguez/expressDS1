const Sequelize = require('sequelize');
sequelize = new Sequelize('work', 'root', '',
{
    host:'localhost',
    dialect:'mysql'
});

module.exports = {
    Sequelize,
    sequelize
}