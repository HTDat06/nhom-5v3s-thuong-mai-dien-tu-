
"use strict";

const { Sequelize } = require("sequelize");

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn("products", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("products", "is_active");
  }
};
