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
    console.log(err);
    jsonErrorProcessor(err, res);
  }
}

/**
 * Load Scoresheet List
 * @param req
 * @param res
 */
scoresheetController.loadScoresheetList = function (req, res) {
  Scoresheet.findAll({
    where: {
      user_id: req.user.id,
    },
  })
    .then((userScoresheets) => {
      flights = {};
      userScoresheets.forEach((scoresheet) => {
        flights[scoresheet.flight_key] = {};
      });

      return Flight.findAll({
        where: {
          id: Object.keys(flights),
        },
      }).then((userFlights) => {
        return [userScoresheets, userFlights];
      });
    })
    .then(([userScoresheets, userFlights]) => {
      const flightObject = {};
      userFlights.forEach((flight) => {
        flightObject[flight.id] = {
          ...flight.get({ plain: true }),
          scoresheets: userScoresheets
            .filter((scoresheet) => scoresheet.flight_key === flight.id)
            .map((scoresheet) => scoresheet.get({ plain: true })),
        };
      });

      res.render("loadScoresheetList", {
        user: req.user,
        scoresheets: userScoresheets.map((scoresheet) =>
          scoresheet.get({ plain: true })
        ),
        flights: flightObject,
        title: appConstants.APP_NAME + " - List Scoresheet",
      });
    })
    .catch((err) => {
      debug(err);
    });
};

/**
 * Initialize Scoresheet - either new or existing
 * @param req
 * @param res
 */
scoresheetController.initScoresheet = function (req, res) {
  // If we are provided with a scoresheet ID then load it
  if (req.body.scoresheetId || req.query.scoresheetId) {
    const scoresheetId = req.body.scoresheetId
      ? req.body.scoresheetId
      : req.query.scoresheetId;

    Scoresheet.findAll({
      where: {
        id: scoresheetId,
      },
    })
      .then((scoresheets) => {
        if (!scoresheets.length)
          throw new Error("No scoresheet found for given ID!");
        res.render("scoresheet", {
          user: req.user,
          scoresheet: scoresheets[0].get({ plain: true }),
          fingerprint: scoresheetId,
          title: appConstants.APP_NAME + " - Load Scoresheet",
        });
      })
      .catch((err) => {
        debug(err);
      });
  } else if (req.query.flightId) {
    // If we have a flight ID, then create a scoresheet with flight ID prepopulated
    const flightId = req.query.flightId;
    Flight.findOne({
      where: {
        id: flightId,
        created_by: req.user.id,
      },
    })
      .then((flight) => {
        Scoresheet.count({
          where: {
            flight_key: flight.id,
          },
        }).then((numScoresheets) => {
          if (flight) {
            let date = new Date(flight.date);
            res.render("scoresheet", {
              user: req.user,
              sess_date:
                date.getUTCFullYear() +
                "-" +
                ("0" + (date.getUTCMonth() + 1)).slice(-2) +
                "-" +
                ("0" + date.getUTCDate()).slice(-2),
              title: appConstants.APP_NAME + " - New Scoresheet",
              flightId: req.query.flightId,
              session_location: flight.location,
              flight_total: numScoresheets + 1,
              flight_position: numScoresheets + 1,
            });
          } else {
            res.status(401);
          }
        });
      })
      .catch((err) => {
        res.status(500);
        console.log(err);
      });
  } else {
    // If we do NOT have a scoresheet ID just give the user a clean sheet to start new
    let date = new Date(Date.now());
    res.render("scoresheet", {
      user: req.user,
      sess_date:
        date.getUTCFullYear() +
        "-" +
        ("0" + (date.getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getUTCDate()).slice(-2),
      title: appConstants.APP_NAME + " - New Scoresheet",
    });
  }
};

/**
 * Do Scoresheet Data Post
 * @param req
 * @param res
 */
scoresheetController.doScoresheetDataChange = function (req, res) {
  // Make sure we don't allow a regular submit we ONLY take our AJAX calls
  if (req.body._ajax !== "true") {
    // Just send them back to the edit page
    return res.redirect("/scoresheet/edit");
  }

  // strip the ajax property
  delete req.body._ajax;

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
  // Associate this scoresheet to the user
  ss.user_id = req.user.id;

  // Upsert the record
  Scoresheet.upsert(ss)
    .then((retData) => {
      // associate the sheet to the user

      // Returned Data
      let sheet = retData[0];
      let created = retData[1];

      //req.flash('success', 'Scoresheet Submitted');
      //res.redirect('/scoresheet/load');
      return res.send({ update: true, id: sheet.id });
    })
    .catch((err) => {
      debug(err);
      console.log(err);
      // Bad upsert send the error back to the AJAX caller
      return res.status(500).send({ update: false, id: null, error: err });
    });
};

scoresheetController.previewPDF = function (req, res) {
  let scoresheetId = req.body.scoresheetId;

  Scoresheet.findOne({
    where: {
      id: scoresheetId,
    },
  })
    .then((scoresheet) => {
      // Doing this because userId isn't a FK on Scoresheet and this is a really fugly workaround
      return Promise.all([
        User.findOne({
          where: {
            id: scoresheet.user_id,
          },
        }),
        Flight.findOne({
          where: {
            id: scoresheet.flight_key,
          },
        }),
      ]).then(([user, flight]) => {
        return [
          scoresheet.get({ plain: true }),
          user.get({ plain: true }),
          flight.get({ plain: true }),
        ];
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
      raw: true,
    });
    scoresheetIds = null;
  } else if (scoresheetIds) {
    scoresheetsDbPromise = Scoresheet.findAll({
      where: {
        id: scoresheetIds,
      },
      raw: true,
    }).then((scoresheets) => {
      // Verify user is authorized to access each scoresheet
      scoresheets.forEach((scoresheet) => {
        if (!(scoresheet.user_id === req.user.id || userIsAdmin)) {
          return Promise.reject("NOT_AUTHORIZED");
        }
      });

      return scoresheets;
    });
    entryNumbers = null;
  } else {
    scoresheetsDbPromise = Promise.reject("NOT_AUTHORIZED");
  }

  scoresheetsDbPromise
    .then((scoresheets) => {
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

      const flights = [
        ...new Set(scoresheets.map((scoresheet) => scoresheet.flight_key)),
      ];
      const users = [
        ...new Set(scoresheets.map((scoresheet) => scoresheet.user_id)),
      ];

      return Promise.all([
        User.findAll({
          where: {
            id: users,
          },
          raw: true,
        }),
        Flight.findAll({
          where: {
            id: flights,
            submitted: true,
          },
          raw: true,
        }),
      ]).then(([users, flights]) => {
        return scoresheets.reduce((acc, val) => {
          const currentFlight = flights.filter(
            (flight) => flight.id === val.flight_key
          );

          if (!currentFlight.length) {
            return {
              ...acc,
              [val.id]: {
                error: "flight not submitted",
              },
            };
          }

          return {
            ...acc,
            [val.id]: {
              scoresheet: val,
              user: users.filter((user) => val.user_id === user.id)[0],
              flight: currentFlight[0],
            },
          };
        }, {});
      });
    })
    .then((scoresheetObject) => {
      console.log(
        `Got ${Object.keys(scoresheetObject).length} scoresheets from db`
      );
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
      } else if (
        entryNumbers &&
        Object.values(scoresheetObject).reduce(
          (acc, scoresheet) =>
            acc.includes(scoresheet.entry_number)
              ? [...acc, scoresheet.entryNumbers]
              : acc,
          []
        ).length === 1
      ) {
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
      // zip.pipe(res);

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

        const sendPromises = Object.entries(groupedByEntryNumber).map(
          ([entry_number, scoresheet_data_array]) => {
            const pdfGenInputData = scoresheet_data_array.map(
              (scoresheetData) => ({
                scoresheet: scoresheetData.scoresheet,
                flight: scoresheetData.flight,
                judge: scoresheetData.user,
                images: static_image_paths,
              })
            );

            return pdfService
              .generateScoresheet("views/bjcp_modified.pug", pdfGenInputData)
              .then((scoresheetBlobData) => {
                const fileName = `${pdfGenInputData[0].scoresheet.entry_number}.pdf`;

                zip.append(scoresheetBlobData, {
                  name: fileName,
                });

                zip.on("entry", (entryData) => {
                  if (entryData.name === fileName) {
                    console.log(`Added file ${fileName} to archive`);
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
            console.log(`All files added. Starting to compress zip file...`);
            return zip.finalize();
          })
          .then(() => {
            console.log(`Zip compression finished. File ready for download.`);
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
          (scoresheetData) => {
            return pdfService
              .generateScoresheet("views/bjcp_modified.pug", {
                scoresheet: scoresheetData.scoresheet,
                flight: scoresheetData.flight,
                judge: scoresheetData.user,
                images: static_image_paths,
              })
              .then((scoresheetBlobData) => {
                const fileName = `${scoresheetData.scoresheet.entry_number}.pdf`;

                zip.append(scoresheetBlobData, {
                  name: fileName,
                });

                zip.on("entry", (entryData) => {
                  if (entryData.name === fileName) {
                    console.log(`Added file ${fileName} to archive`);
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
            console.log(`All files added. Starting to compress zip file...`);
            return zip.finalize();
          })
          .then(() => {
            console.log(`Zip compression finished. File ready for download.`);
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
