const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const ServerModel = db.define("Server", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    pteroId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    eggId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nodeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, {
    timestamps: false,
    tableName: "servers",
})
ServerModel.sync()

module.exports = ServerModel;