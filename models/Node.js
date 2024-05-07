const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const NodeModel = db.define("Node", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    pteroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
}, {
    timestamps: false,
    tableName: "nodes",
})

NodeModel.sync()

module.exports = NodeModel