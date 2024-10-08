const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const EggModel = db.define("Egg", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    pteroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: "eggs",
})

EggModel.sync()

module.exports = EggModel