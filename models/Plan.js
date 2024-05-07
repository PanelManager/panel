const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const PlanModel = db.define("Plan", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
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
    }

}, {
    timestamps: false,
    tableName: "plans",
})

PlanModel.sync()

module.exports = PlanModel