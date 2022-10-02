const {Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Activity', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        }
    });
};