const {Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Solution', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isWorking: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });
};