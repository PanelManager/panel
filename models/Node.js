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
    /*cpu: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },*/
    ram: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    disk: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: "nodes",
})

NodeModel.sync()

module.exports = NodeModel