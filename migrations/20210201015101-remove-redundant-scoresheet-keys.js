"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Scoresheets", "session_date");
    await queryInterface.removeColumn("Scoresheets", "session_location");
    await queryInterface.removeColumn("Scoresheets", "flight_total");
    await queryInterface.removeColumn("Scoresheets", "scoresheet_submitted");
    await queryInterface.removeColumn("Scoresheets", "judge_id");
    await queryInterface.removeColumn("Scoresheets", "judge_name");
    await queryInterface.removeColumn("Scoresheets", "judge_email");
    await queryInterface.removeColumn("Scoresheets", "judge_bjcp_id");
    await queryInterface.removeColumn("Scoresheets", "judge_bjcp_rank");
    await queryInterface.removeColumn("Scoresheets", "judge_cicerone_rank");
    await queryInterface.removeColumn(
      "Scoresheets",
      "judge_pro_brewer_brewery"
    );
    await queryInterface.removeColumn(
      "Scoresheets",
      "judge_industry_description"
    );
    await queryInterface.removeColumn("Scoresheets", "judge_judging_years");
    await queryInterface.removeColumn("Scoresheets", "user_id");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Scoresheets", "user_id", {
      type: Sequelize.UUID,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "session_date", {
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    });
    await queryInterface.addColumn("Scoresheets", "session_location", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "flight_total", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "scoresheet_submitted", {
      type: Sequelize.BOOLEAN,
      default: false,
    });
    await queryInterface.addColumn("Scoresheets", "judge_id", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "judge_name", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "judge_email", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "judge_bjcp_id", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "judge_bjcp_rank", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "judge_cicerone_rank", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Scoresheets", "judge_pro_brewer_brewery", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn(
      "Scoresheets",
      "judge_industry_description",
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    );
    await queryInterface.addColumn("Scoresheets", "judge_judging_years", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
