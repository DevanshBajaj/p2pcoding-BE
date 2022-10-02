const {Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Problem', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        testCase: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        testCaseOutput: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
    });
};