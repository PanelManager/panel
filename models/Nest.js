const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const NestModel = db.define("Nest", {
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    pteroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false,
    tableName: "nests",
})

NestModel.sync()

module.exports = NestModel;