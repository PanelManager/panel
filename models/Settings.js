const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const SettingsModel = db.define("Settings", {
    key: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: "settings",
})

SettingsModel.sync()

module.exports = SettingsModel;