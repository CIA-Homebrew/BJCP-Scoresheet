const fs = require("fs");
const archiver = require("archiver");
const debug = require("debug")("aha-scoresheet:scoresheetController");
const crypto = require("crypto");
const tmp = require("tmp");

const Scoresheet = require("../models").Scoresheet;
const User = require("../models").User;
const Flight = require("../models").Flight;

const pdfService = require("../services/pdf.service");
const appConstants = require("../helpers/appConstants");
const errorConstants = require("../helpers/errorConstants");

const scoresheetController = {};

function jsonErrorProcessor(err, res) {
  if (errorConstants[err]) {
    res.status(400).json({
      errors: [
        {
          code: err,
          message: errorConstants[err],
        },
      ],
    });
  } else {
    debug(err);
    res.status(500).json(true);
  }
}

scoresheetController.initScoresheet = function (req, res) {
  if (req.body.scoresheetId || req.query.scoresheetId) {
    // Load scoresheet directly from id
    const scoresheetId = req.body.scoresheetId
      ? req.body.scoresheetId
      : req.query.scoresheetId;

    res.render("scoresheet", {
      scoresheetId: scoresheetId,
      title: appConstants.APP_NAME + " - Scoresheet",
    });
  } else if (req.body.flightId || req.query.flightId) {
    // Create a new scoresheet in a flight
    const flightId = req.body.flightId ? req.body.flightId : req.query.flightId;

    res.render("scoresheet", {
      flightId: flightId,
      title: appConstants.APP_NAME + " - Scoresheet",
    });
  } else {
    throw new Error("No scoresheet or flight found!");
  }
};

scoresheetController.doScoresheetDataChange = function (req, res) {
  // Make sure we don't allow a regular submit we ONLY take our AJAX calls
  if (req.body._ajax !== "true") {
    // Just send them back to the edit page
    return res.redirect("/scoresheet/edit");
  }

  // strip the ajax property and update userId props
  delete req.body._ajax;
  delete req.body.noUpdateUserId;

  const ss = {};

  /**
   * There may be a cleaner way of doing this but just for sanity only map the known keys
   */
  Object.keys(Scoresheet.rawAttributes).map((key, index) => {
    ss[key] = req.body[key];
  });

  // Filter an "empty string" or null ID
  if (!ss.id || ss.id === "") {
    delete ss.id;
  }

  // Upsert the record
  Scoresheet.upsert(ss)
    .then((retData) => {
      // Returned Data
      let sheet = retData[0];
      let created = retData[1];

      return res.send({ update: true, id: sheet.id });
    })
    .catch((err) => {
      debug(err);
      // Bad upsert send the error back to the AJAX caller
      return res.status(500).send({ update: false, id: null, error: err });
    });
};

scoresheetController.getScoresheetData = function (req, res) {
  const scoresheetId = req.body.scoresheetId;
  // TODO: limit to admin
  const userId = req.user.id;

  Scoresheet.findOne({
    where: {
      id: scoresheetId,
    },
    include: {
      model: Flight,
      include: User,
    },
  }).then(async (scoresheetData) => {
    if (!scoresheetData) throw new Error("No scoresheet found!");

    let user = scoresheetData.Flight.User.sanitize();

    let flight = scoresheetData.Flight.get({ plain: true });
    flight.flight_total = await Scoresheet.findAndCountAll({
      where: { FlightId: flight.id },
    }).then((result) => result.count);
    delete flight.User;

    res.json({
      scoresheet: scoresheetData,
      flight: flight,
      user: user,
    });
  });
};

scoresheetController.getIncompleteScoresheetsInFlight = function (req, res) {
  const flightId = req.body.flightId;
  // TODO: limit to admin
  const userId = req.user.id;

  Scoresheet.findAll({
    where: {
      FlightId: flightId,
    },
  }).then(async (scoresheetData) => {
    if (!scoresheetData) throw new Error("No scoresheet found!");

    const scoresheetsWithZeroScoreEntries = scoresheetData
      .filter((scoresheet) => {
        return [
          "aroma_score",
          "appearance_score",
          "flavor_score",
          "mouthfeel_score",
          "overall_score",
        ].filter((key) => scoresheet[key] == 0).length;
      })
      .map((scoresheet) => scoresheet.entry_number);

    res.json(scoresheetsWithZeroScoreEntries);
  });
};

scoresheetController.deleteScoresheet = function (req, res) {
  const scoresheetId = req.body.scoresheetId;
  const userId = req.user.id;
  const userIsAdmin = req.user.user_level > 0;

  const userQueryParams = userIsAdmin ? {} : { id: userId };

  Scoresheet.destroy({
    where: { id: scoresheetId },
    include: [
      {
        model: "Flight",
        include: [
          {
            model: "User",
            where: userQueryParams,
          },
        ],
      },
    ],
  })
    .then(() => {
      res.status(200).json(scoresheetId);
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

scoresheetController.previewPDF = function (req, res) {
  let scoresheetId = req.body.scoresheetId;

  Scoresheet.findOne({
    where: {
      id: scoresheetId,
    },
  })
    // Doing this because stupid query joins don't work and this is a really fugly workaround
    .then(async (scoresheet) => {
      return Flight.findOne({
        where: {
          id: scoresheet.FlightId,
        },
      }).then((flight) => {
        return User.findOne({
          where: {
            id: flight.UserId,
          },
        }).then((user) => {
          return [
            scoresheet.get({ plain: true }),
            user.get({ plain: true }),
            flight.get({ plain: true }),
          ];
        });
      });
    })
    .then(async ([scoresheet, user, flight]) => {
      // These need to be STATIC and not relative! They also MUST be png files.
      const static_image_paths = {
        bjcp_logo: "public/images/scoresheet-logos/bjcp-logo.png",
        aha_logo: "public/images/scoresheet-logos/aha-logo.png",
        club_logo: "public/images/scoresheet-logos/club-logo.png",
        comp_logo: "public/images/scoresheet-logos/comp-logo.png",
      };

      pdfService
        .generateScoresheet(
          "views/bjcp_modified.pug",
          {
            scoresheet: scoresheet,
            flight: flight,
            judge: user,
            images: static_image_paths,
          },
          true
        )
        .then((html) => {
          res.send(html);
        });
    });
};

scoresheetController.generatePDF = function (req, res) {
  let scoresheetIds = req.body.scoresheetIds || null;
  let entryNumbers = req.body.entryNumbers || null;
  const userIsAdmin = req.user.user_level;
  const requestId = crypto.randomBytes(16).toString("hex");

  const static_image_paths = {
    bjcp_logo: "public/images/scoresheet-logos/bjcp-logo.png",
    aha_logo: "public/images/scoresheet-logos/aha-logo.png",
    club_logo: "public/images/scoresheet-logos/club-logo.png",
    comp_logo: "public/images/scoresheet-logos/comp-logo.png",
  };

  let scoresheetsDbPromise = null;

  // Only admins may concatenate scoresheets by entry number
  if (entryNumbers && userIsAdmin) {
    scoresheetsDbPromise = Scoresheet.findAll({
      where: {
        entry_number: entryNumbers,
      },
      include: {
        model: Flight,
        include: User,
      },
    });
    scoresheetIds = null;
  } else if (scoresheetIds) {
    const selectorQueries = {};
    if (!userIsAdmin) {
      selectorQueries.UserId = req.user.id;
    }

    scoresheetsDbPromise = Scoresheet.findAll({
      where: {
        id: scoresheetIds,
      },
      include: {
        model: Flight,
        where: selectorQueries,
        include: User,
      },
    });
    entryNumbers = null;
  } else {
    scoresheetsDbPromise = Promise.reject("NOT_AUTHORIZED");
  }

  scoresheetsDbPromise
    .then((scoresheets) => {
      if (!scoresheets.length) return Promise.reject("NOT_AUTHORIZED");

      // Set up callback queue / download progress
      tmp.file((err, path, fd, cleanupCallback) => {
        if (err) throw err;

        scoresheetController.downloadStatusByRequestId[requestId] = {
          id: requestId,
          status: {
            total: scoresheets.length,
            completed: 0,
          },
          complete: false,
          userId: req.user.id,
          file: {
            path,
            fd,
            cleanupCallback,
          },
        };

        res.json({ requestId });
      });

      const flightTotalPromises = scoresheets.map((scoresheet) => {
        let flight = scoresheet.Flight;
        return Scoresheet.findAndCountAll({
          where: { FlightId: scoresheet.Flight.id },
        }).then((result) => {
          flight.flight_total = result.count;

          return {
            scoresheet,
            flight: flight,
            user: scoresheet.Flight.User,
          };
        });
      });

      return Promise.all(flightTotalPromises).then((scoresheetObjectsArray) => {
        return scoresheetObjectsArray.reduce((acc, scoresheetObject) => {
          acc[scoresheetObject.scoresheet.id] = scoresheetObject;
          return acc;
        }, {});
      });
    })
    .then((scoresheetObject) => {
      // If there's only one scoresheet being requested, we don't need to make an archive - just send the pdf
      if (Object.keys(scoresheetObject).length === 1) {
        const scoresheetData = Object.values(scoresheetObject)[0];

        return pdfService
          .generateScoresheet("views/bjcp_modified.pug", {
            scoresheet: scoresheetData.scoresheet,
            flight: scoresheetData.flight,
            judge: scoresheetData.user,
            images: static_image_paths,
          })
          .then((pdf) => {
            const requestStatus =
              scoresheetController.downloadStatusByRequestId[requestId];

            fs.writeFile(requestStatus.file.path, pdf, (err) => {
              if (err) throw err;

              scoresheetController.downloadStatusByRequestId[requestId] = {
                ...requestStatus,
                complete: true,
                status: {
                  total: 1,
                  completed: 1,
                },
              };

              // Hold onto data for 1 minute before cleanup
              setTimeout(() => {
                if (scoresheetController.downloadStatusByRequestId[requestId]) {
                  scoresheetController.downloadStatusByRequestId[
                    requestId
                  ].file.cleanupCallback();
                  delete scoresheetController.downloadStatusByRequestId[
                    requestId
                  ];
                }
              }, 60000);
            });
          });
      } else if (entryNumbers && [...new Set(entryNumbers)].length === 1) {
        const pdfGenInputData = Object.values(scoresheetObject).map(
          (scoresheetData) => ({
            scoresheet: scoresheetData.scoresheet,
            flight: scoresheetData.flight,
            judge: scoresheetData.user,
            images: static_image_paths,
          })
        );

        return pdfService
          .generateScoresheet("views/bjcp_modified.pug", pdfGenInputData)
          .then((pdf) => {
            const requestStatus =
              scoresheetController.downloadStatusByRequestId[requestId];

            fs.writeFile(requestStatus.file.path, pdf, (err) => {
              if (err) throw err;

              scoresheetController.downloadStatusByRequestId[requestId] = {
                ...requestStatus,
                complete: true,
                status: {
                  total: 1,
                  completed: 1,
                },
              };

              // Hold onto data for 1 minute before cleanup
              setTimeout(() => {
                if (scoresheetController.downloadStatusByRequestId[requestId]) {
                  scoresheetController.downloadStatusByRequestId[
                    requestId
                  ].file.cleanupCallback();
                  delete scoresheetController.downloadStatusByRequestId[
                    requestId
                  ];
                }
              }, 60000);
            });
          });
      }

      // If multiple scoresheets, set up the archive to pipe from pdf service to res
      const zip = archiver("zip");

      const requestStatus =
        scoresheetController.downloadStatusByRequestId[requestId];
      const writer = fs.createWriteStream(requestStatus.file.path);
      zip.pipe(writer);
      zip.setMaxListeners(Object.keys(scoresheetObject).length);

      zip.on("error", () => {
        throw new Error("File zipping failed!");
      });

      if (entryNumbers && entryNumbers.length) {
        // If we are processing an entry number request, we need to group together scoresheets into a single pdf by entry number
        const groupedByEntryNumber = Object.values(scoresheetObject).reduce(
          (acc, val) => {
            if (!val.scoresheet || val.error) {
              return { ...acc };
            }

            return {
              ...acc,
              [val.scoresheet.entry_number]: [
                ...(acc[val.scoresheet.entry_number] || []),
                val,
              ],
            };
          },
          {}
        );

        //  Update the total to reflect combined groupings
        scoresheetController.downloadStatusByRequestId[
          requestId
        ].status.total = Object.keys(groupedByEntryNumber).length;

        const sendPromises = Object.entries(groupedByEntryNumber).map(
          ([entry_number, scoresheet_data_array], idx) => {
            const pdfGenInputData = scoresheet_data_array.map(
              (scoresheetData) => ({
                scoresheet: scoresheetData.scoresheet,
                flight: scoresheetData.flight,
                judge: scoresheetData.user,
                images: static_image_paths,
              })
            );

            return pdfService
              .generateScoresheet(
                "views/bjcp_modified.pug",
                pdfGenInputData,
                false,
                1000 * idx
              )
              .then((scoresheetBlobData) => {
                const fileName = `${pdfGenInputData[0].scoresheet.entry_number}.pdf`;

                zip.append(scoresheetBlobData, {
                  name: fileName,
                });

                zip.on("entry", (entryData) => {
                  if (entryData.name === fileName) {
                    return Promise.resolve(true);
                  }
                });

                scoresheetController.downloadStatusByRequestId[
                  requestId
                ].status.completed += 1;
              });
          }
        );

        Promise.all(sendPromises)
          .then(() => {
            return zip.finalize();
          })
          .then(() => {
            scoresheetController.downloadStatusByRequestId[
              requestId
            ].complete = true;

            // Hold onto data for 1 minute before cleanup
            setTimeout(() => {
              if (scoresheetController.downloadStatusByRequestId[requestId]) {
                scoresheetController.downloadStatusByRequestId[
                  requestId
                ].file.cleanupCallback();
                delete scoresheetController.downloadStatusByRequestId[
                  requestId
                ];
              }
            }, 60000);
          });
      } else {
        // Each individual scoresheet ID will be mapped to a new PDF
        const sendPromises = Object.values(scoresheetObject).map(
          (scoresheetData, idx) => {
            return pdfService
              .generateScoresheet(
                "views/bjcp_modified.pug",
                {
                  scoresheet: scoresheetData.scoresheet,
                  flight: scoresheetData.flight,
                  judge: scoresheetData.user,
                  images: static_image_paths,
                },
                false,
                1000 * idx
              )
              .then((scoresheetBlobData) => {
                const fileName = `${scoresheetData.scoresheet.entry_number}.pdf`;

                zip.append(scoresheetBlobData, {
                  name: fileName,
                });

                zip.on("entry", (entryData) => {
                  if (entryData.name === fileName) {
                    return Promise.resolve(true);
                  }
                });

                scoresheetController.downloadStatusByRequestId[
                  requestId
                ].status.completed += 1;
              });
          }
        );

        Promise.all(sendPromises)
          .then(() => {
            return zip.finalize();
          })
          .then(() => {
            scoresheetController.downloadStatusByRequestId[
              requestId
            ].complete = true;

            // Hold onto data for 1 minute before cleanup
            setTimeout(() => {
              if (scoresheetController.downloadStatusByRequestId[requestId]) {
                scoresheetController.downloadStatusByRequestId[
                  requestId
                ].file.cleanupCallback();
                delete scoresheetController.downloadStatusByRequestId[
                  requestId
                ];
              }
            }, 60000);
          });
      }
    })
    .catch((err) => {
      jsonErrorProcessor(err, res);
    });
};

scoresheetController.getDownloadStatus = function (req, res) {
  const requestId = req.body.requestId || null;
  const requestObject =
    scoresheetController.downloadStatusByRequestId[requestId] || null;

  if (!requestObject) {
    res.status(404).json({
      error: "Could not find request id",
    });
  } else if (requestObject.userId !== req.user.id) {
    res.status(403).json({
      error: "Unauthorized user",
    });
  } else if (requestObject.complete) {
    res.set("Content-disposition", 'attachment; filename="scoresheets.zip"');
    res.set("Conent-type", "application/zip");
    res.status(201);
    fs.createReadStream(requestObject.file.path).pipe(res);

    // Clean up after response sent
    res.on("finish", () => {
      scoresheetController.downloadStatusByRequestId[
        requestId
      ].file.cleanupCallback();
      delete scoresheetController.downloadStatusByRequestId[requestId];
    });
  } else {
    res.status(202).json(requestObject.status);
  }
};

scoresheetController.downloadStatusByRequestId = {};

module.exports = scoresheetController;
