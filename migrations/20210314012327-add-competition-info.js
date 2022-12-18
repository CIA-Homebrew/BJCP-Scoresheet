"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Scoresheets", "deleted_at", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("Users", "deleted_at", {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("Flights", "deleted_at", {
      type: Sequelize.DATE,
    });

    await queryInterface.createTable("Competitions", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: {
        type: Sequelize.TEXT,
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
      },
      info: {
        type: Sequelize.TEXT,
      },
      instruction: {
        type: Sequelize.TEXT,
      },
      club: {
        type: Sequelize.TEXT,
      },
      clubLogo: {
        type: Sequelize.TEXT,
      },
      compLogo: {
        type: Sequelize.TEXT,
      },
      show_bjcp_logo: {
        type: Sequelize.BOOLEAN,
      },
      show_aha_logo: {
        type: Sequelize.BOOLEAN,
      },
      styleGuide: {
        type: Sequelize.TEXT,
      },
      sponsor: {
        type: Sequelize.JSON,
      },
      entryInfo: {
        type: Sequelize.JSON,
      },
      judgeInfo: {
        type: Sequelize.JSON,
      },
      options: {
        type: Sequelize.JSON,
      },
      colorScheme: {
        type: Sequelize.JSON,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("UserCompetitions", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      UserId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: true,
      },
      CompetitionId: {
        type: Sequelize.UUID,
        references: {
          model: "Competitions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: true,
      },
      isAdmin: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addColumn("Flights", "CompetitionId", {
      type: Sequelize.UUID,
    });

    const staticCompetitionId = uuidv4();

    // Create an empy competition
    await queryInterface
      .bulkInsert(
        "Competitions",
        [
          {
            id: staticCompetitionId,
            name: "Default Competition",
            slug: "default-competition",
            info: "The best competition in the World Wide Web!",
            instruction:
              "Please fill this form to the most comprehensive degree possible.",
            club: "Default",
            clubLogo: "/images/page-logos/club-logo.png",
            compLogo: "/images/page-logos/comp-logo.png",
            show_bjcp_logo: false,
            show_aha_logo: false,
            styleGuide: "BJCP2015",
            sponsor: null,
            entryInfo: null,
            judgeInfo: null,
            colorScheme: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { returning: true }
      )
      .then(async () => {
        await queryInterface.bulkUpdate("Flights", {
          CompetitionId: staticCompetitionId,
        });

        return queryInterface.sequelize
          .query(`SELECT * FROM "Users"`)
          .then(async ([users, statement]) => {
            if (!users.length) return Promise.resolve(null);

            const userMap = users.map((user) => ({
              id: uuidv4(),
              UserId: user.id,
              CompetitionId: staticCompetitionId,
              isAdmin: user.user_level,
              created_at: new Date(),
              updated_at: new Date(),
            }));

            return queryInterface.bulkInsert("UserCompetitions", userMap, {
              returning: true,
            });
          });
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Flights", "CompetitionId");

    await queryInterface.dropTable("UserCompetitions");
    await queryInterface.dropTable("Competitions");

    await queryInterface.removeColumn("Flights", "deleted_at");
    await queryInterface.removeColumn("Users", "deleted_at");
    await queryInterface.removeColumn("Scoresheets", "deleted_at");
  },
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
