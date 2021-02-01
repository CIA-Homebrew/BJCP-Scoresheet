"use strict";

var bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      firstname: {
        type: DataTypes.STRING,
        isEmpty: {
          msg: "A first name is required.",
        },
      },
      lastname: {
        type: DataTypes.STRING,
        isEmpty: {
          msg: "A last name is required.",
        },
      },
      email: {
        type: DataTypes.STRING,
        isEmail: {
          msg: "Invalid email address provided.",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: DataTypes.STRING,
      bjcp_id: DataTypes.STRING,
      bjcp_rank: DataTypes.STRING,
      cicerone_rank: DataTypes.STRING,
      pro_brewer_brewery: DataTypes.STRING,
      industry_description: DataTypes.STRING,
      judging_years: DataTypes.STRING,
      user_level: {
        type: DataTypes.NUMBER,
        require: true,
        default: 0, // 0 = judge/basic user; 1 = head judge; 90 = admin
      },
      verification_id: DataTypes.STRING,
      password_reset_id: DataTypes.STRING,
      allow_automated_email: {
        type: DataTypes.BOOLEAN,
        default: true,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(10),
            null
          );
        },
      },
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.validatePasswordAsync = function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.hashPassword = function (password) {
    return bcrypt.hash(password, bcrypt.genSaltSync(10), null);
  };

  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Flight, {
      as: "flights",
      foreignKey: "created_by",
    });
  };

  return User;
};
