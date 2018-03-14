const Sequelize = require('sequelize');

const Product = sequelize => {
    product = sequelize.define('product', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(50)
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });
    sequelize.sync();
    return product;
};

module.exports = Product;
