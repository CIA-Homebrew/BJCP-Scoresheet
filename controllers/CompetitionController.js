const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const Competition = require("../models").Competition;
let appConstants = require("../helpers/appConstants");
let debug = require("debug")("aha-scoresheet:competitionController");

const competitionController = {};

competitionController.getAllCompetitions = function (req, res) {
  Competition.findAll().then((competitions) => {
    res.json(competitions);
  });
};

competitionController.getCompetitionData = function (req, res) {
  const slug = req.params.competitionSlug;
  const competitionData = Competition.findOne({ where: { slug } });

  competitionData.then((data) => res.json(data));
};

competitionController.setCompetitionData = function (req, res) {
  const slug = req.params.competitionSlug;
  const updatedData = req.body;
  updatedData.slug = undefined;

  if (!["BJCP2015", "BJCP2021"].includes(updatedData.styleGuide)) {
    res.status(400).text("Invalid Style Guideline Type");
    return;
  }

  Competition.update(
    {
      ...updatedData,
    },
    {
      where: { slug },
      returning: true,
      plain: true,
    }
  )
    .then((competitionInfo) => {
      res.json(competitionInfo);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

competitionController.handleCompImageUpload = async function (req, res) {
  const tempPath = req.file.path;
  const compSlug = req.params.competitionSlug;
  const targetDir = path.join(__dirname, "../public/images/uploads/", compSlug);
  const targetPath = path.join(targetDir, "comp-logo.png");

  const dirExists = await fs.promises
    .stat(targetDir)
    .then((fsStat) => fsStat.isDirectory())
    .catch((err) => {
      return false;
    });

  if (!dirExists) {
    await fs.promises.mkdir(targetDir, { recursive: true });
    console.log("Created directory ", targetDir);
  }

  try {
    await sharp(tempPath)
      .resize({
        width: 500,
        height: 500,
      })
      .toFormat("png")
      .toFile(targetPath);

    console.log("Created file ", targetPath);

    await Competition.update(
      {
        compLogo: targetPath,
      },
      {
        where: { slug: compSlug },
      }
    );
    await fs.promises.rm(tempPath);
    res.redirect("/admin");
  } catch (err) {
    console.log(err);
    res.status(400).contentType("text/plain").end("Error uploading file");
  }
};

competitionController.handleClubImageUpload = async function (req, res) {
  const tempPath = req.file.path;
  const compSlug = req.params.competitionSlug;
  const targetDir = path.join(__dirname, "../public/images/uploads/", compSlug);
  const targetPath = path.join(targetDir, "club-logo.png");

  const dirExists = await fs.promises
    .stat(targetDir)
    .then((fsStat) => fsStat.isDirectory())
    .catch((err) => {
      return false;
    });

  if (!dirExists) {
    await fs.promises.mkdir(targetDir, { recursive: true });
    console.log("Created directory ", targetDir);
  }

  try {
    await sharp(tempPath)
      .resize({
        width: 500,
        height: 500,
      })
      .toFormat("png")
      .toFile(targetPath);

    console.log("Created file ", targetPath);

    await Competition.update(
      {
        clubLogo: targetPath,
      },
      {
        where: { slug: compSlug },
      }
    );

    await fs.promises.rm(tempPath);
    res.redirect("/admin");
  } catch (err) {
    console.log(err);
    res.status(400).contentType("text/plain").end("Error uploading file");
  }
};

module.exports = competitionController;
