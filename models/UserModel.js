const { DataTypes } = require("sequelize");
const db = require("../handlers/db");

const UserModel = db.define("User", {
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    pteroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    ipAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    verifiedEmail: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: false,
    tableName: "users",
})

UserModel.sync()

module.exports = UserModel