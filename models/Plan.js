const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const PlanModel = db.define("Plan", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    cpu: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ram: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    disk: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    swap: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    allocations: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    backups: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    databases: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    eggs: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    nodes: {
        type: DataTypes.TEXT,
        allowNull: false
    }

}, {
    timestamps: false,
    tableName: "plans",
})

PlanModel.sync()

module.exports = PlanModel