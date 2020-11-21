let openFlightDataModal = () => {};
let openScoresheetDataModal = () => {};
let openUserDataModal = () => {};

let updateFlightData = () => {};
let updateScoresheetData = () => {};
let updateUserData = () => {};

let downloadPdf = () => {};

const Users = {};
const Scoresheets = {};
const Flights = {};
const fetchAllData = () => {
  return fetch("/admin/alldata")
    .then((response) => {
      return response.json();
    })
    .then(({ scoresheets, flights, users }) => {
      users.forEach((user) => {
        Users[user.id] = user;
      });
      flights.forEach((flight) => {
        Flights[flight.id] = flight;
      });
      scoresheets.forEach((scoresheet) => {
        Scoresheets[scoresheet.id] = scoresheet;
      });
    });
};

const updateAllTables = () => {
  fetchAllData().then(() => {
    updateTable("#scoresheets", Scoresheets);
    updateTable("#judges", Users);
    updateTable("#flights", Flights);

    $("#flightModalUser").html("<option selected disabled>Select...</option>");
    Object.values(Users).forEach((user) => {
      $("#flightModalUser").append(new Option(user.email, user.id));
    });
  });
};

const updateTable = (tableId, datalist) => {
  if ($(tableId).find("table").hasClass("dataTable")) {
    $(tableId).find("table").DataTable().destroy();
  }
  const dataKeys = [];
  let htmlOut = "";
  $(tableId)
    .find("[data-key]")
    .each((idx, val) => {
      dataKeys.push($(val).attr("data-key"));
    });
  Object.values(datalist).forEach((listing) => {
    htmlOut += `<tr>
			${dataKeys
        .map((val, idx) => {
          if (idx === 0) {
            return `<td><a class="link-style" role="button" onclick="openDataModal('${tableId}','${
              listing.id
            }')"> ${val
              .split(",")
              .map((key) => getDataValueByKey(listing, key))
              .join(" ")} </a></td>`;
          } else {
            return `<td> ${val
              .split(",")
              .map((key) => getDataValueByKey(listing, key))
              .join(" ")} </td>`;
          }
        })
        .join("")}
		</tr>`;
  });
  $(tableId).find("tbody").html(htmlOut);
  $(tableId).find("table").DataTable({
    autoWidth: true,
  });
};

const resizeAllTables = () => {
  $("#scoresheets").find("table").DataTable().adjust().draw();
  $("#judges").find("table").DataTable().adjust().draw();
  $("#flights").find("table").DataTable().adjust().draw();
};

const getDataValueByKey = (listItem, key) => {
  // Overrides for database key values
  let value = listItem[key];

  if (key === "created_by" || key === "user_id") {
    const userId = listItem[key];
    value = `<a role="button" class="link-style" onclick="openDataModal('#judges','${userId}')">${Users[userId]?.firstname} ${Users[userId]?.lastname}</a>`;
  } else if (key === "flight_key") {
    const flightId = listItem[key];
    value = `<a role="button" class="link-style" onclick="openDataModal('#flights','${flightId}')">${Flights[flightId].flight_id}</a>`;
  } else if (key === "mini_boss_advanced") {
    const minibos = listItem[key] === "on";
    value = `
		<div class="form-check">
			<input class="form-check-input position-static" type="checkbox" ${
        minibos ? "checked" : ""
      } disabled>
		</div>
		`;
  } else if (key === "place") {
    const placeCode = listItem[key];
    const placeValues = ["Adv.", "1st", "2nd", "3rd"];
    value = typeof placeCode === "number" ? placeValues[placeCode] : "";
  } else if (key === "numFlightEntries") {
    const flightId = listItem.id;
    value = Object.values(Scoresheets).filter(
      (scoresheet) => scoresheet.flight_key === flightId
    ).length;
  } else if (key === "numUserFlights") {
    const userId = listItem.id;
    value = Object.values(Flights).filter(
      (flight) => flight.created_by === userId
    ).length;
  } else if (key === "numUserScoresheets") {
    const userId = listItem.id;
    value = Object.values(Scoresheets).filter(
      (flight) => flight.user_id === userId
    ).length;
  } else if (key === "date") {
    value = new Date(listItem[key]).toLocaleDateString();
  }

  return value;
};

const openDataModal = (tableId, id) => {
  if (tableId === "#scoresheets") {
    openScoresheetDataModal(id);
  } else if (tableId === "#judges") {
    openUserDataModal(id);
  } else if (tableId === "#flights") {
    openFlightDataModal(id);
  }
};

const closeAllModals = () => {
  $("#flightDataModal").modal("hide");
  $("#scoresheetDataModal").modal("hide");
  $("#userDataModal").modal("hide");
};

$(() => {
  updateAllTables();

  openFlightDataModal = (flightId) => {
    const flight = Flights[flightId];
    if (!flight) return;
    closeAllModals();

    const flightScoresheetsHtml = Object.values(Scoresheets)
      .filter((scoresheet) => scoresheet.flight_key === flightId)
      .map((scoresheet) => generateScoresheetModalTableRow(scoresheet))
      .join("");

    $("#flightModalName").val(flight.flight_id);
    $("#flightModalName").attr("flight-id", flight.id);
    $("#flightModalLocation").val(flight.location);
    $("#flightModalLocation").prop("disabled", flight.submitted);
    $("#flightModalDate").val(flight.date.slice(0, 10));
    $("#flightModalDate").prop("disabled", flight.submitted);
    $("#flightModalUser").val(flight.created_by);
    $("#flightModalUser").prop("disabled", flight.submitted);
    $("#flighModalSubmitted").prop("checked", flight.submitted);
    $("#flightModalEntries").html(flightScoresheetsHtml);

    $("#flightDataModal").modal("show");
  };

  openScoresheetDataModal = (scoresheetId) => {
    const scoresheet = Scoresheets[scoresheetId];
    if (!scoresheet) return;
    closeAllModals();

    // $('#scoresheetModalId').text(JSON.stringify(scoresheet))
    $("#scoresheetModalEntryNumber").val(scoresheet.entry_number);
    $("#scoresheetModalScoresheetId").val(scoresheet.id);
    generatePdfPreview(scoresheet.id);

    $("#scoresheetDataModal").modal("show");
  };

  openUserDataModal = (userId) => {
    const user = Users[userId];
    if (!user) return;
    const flights = Object.values(Flights).filter(
      (flight) => flight.created_by === userId
    );
    const scoresheets = Object.values(Scoresheets).filter(
      (scoresheet) => scoresheet.user_id === userId
    );
    $("#userModalResetPasswordButton").off("click");

    closeAllModals();

    $("#userModalEmail").val(user.email);
    $("#userModalFirstName").val(user.firstname);
    $("#userModalLastName").val(user.lastname);
    $("#userModalBjcpId").val(user.bjcp_id);
    $("#userModalBjcpRank").val(user.bjcp_rank);
    $("#userModalCiceroneRank").val(user.cicerone_rank);
    $("#userModalProBrewer").val(user.pro_brewer_brewery);
    $("#userModalIndustry").val(user.industry_description);
    $("#userModalJudgingYears").val(Number(user.judging_years));
    $("#userModalResetPasswordButton").on("click", () =>
      resetUserPassword(userId)
    );
    $("#userModalFlights").html(
      flights
        .map((flight) => {
          return generateFlightModalTableRow(flight);
        })
        .join("")
    );

    $("#userDataModal").modal("show");
  };

  updateUserData = () => {
    const upateUserId = Object.values(Users).filter(
      (user) => user.email === $("#userModalEmail").val()
    )[0].id;

    if (
      window.confirm(
        `Do you really want to update the profile for "${Users[upateUserId].email}" (${Users[upateUserId].firstname} ${Users[upateUserId].lastname})?`
      )
    ) {
      const updatedUserData = {
        id: upateUserId,
        firstname: $("#userModalFirstName").val(),
        lastname: $("#userModalLastName").val(),
        bjcp_id: $("#userModalBjcpId").val(),
        bjcp_rank: $("#userModalBjcpRank").val(),
        cicerone_rank: $("#userModalCiceroneRank").val(),
        pro_brewer_brewery: $("#userModalProBrewer").val(),
        industry_description: $("#userModalIndustry").val(),
        judging_years: $("#userModalJudgingYears").val(),
      };

      fetch("/profile/edit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      })
        .then(() => {
          closeAllModals();
          updateAllTables();
        })
        .catch((err) => {
          console.error(
            `Could not update user profile for ${updatedUserData.email} (${updatedUserData.firstname} ${updatedUserData.lastname})`
          );
        });
    }
  };

  resetUserPassword = (userId) => {
    if (
      window.confirm(
        `Do you really want to reset the password for user "${Users[userId].email}" (${Users[userId].firstname} ${Users[userId].lastname})?`
      )
    ) {
      fetch("/admin/resetpassword/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetUserId: userId,
        }),
      })
        .then((data) => data.json())
        .then((data) => {
          navigator.clipboard.writeText(data.updatedPassword).then(() => {
            window.alert(
              `Reset password for user "${Users[userId].email}" (${Users[userId].firstname} ${Users[userId].lastname}) to:\n\n${data.updatedPassword}\n\nThis password has been copied to the clipboard.`
            );
          });
        })
        .catch((err) => {
          console.error(
            `Could not reset password for user "${Users[userId].email}" (${Users[userId].firstname} ${Users[userId].lastname}).`
          );
        });
    }
  };

  updateFlightData = () => {
    const submitted = $(flighModalSubmitted).attr("checked");
    const updatedFlightData = {
      flightId: $("#flightModalName").attr("flight-id"),
      flightName: $("#flightModalName").val(),
      submitted: $("#flighModalSubmitted").prop("checked"),
      flightDate: new Date($("#flightModalDate").val()),
      createdBy: $("#flightModalUser").val(),
      flightLocation: $("#flightModalLocation").val(),
    };

    fetch("/flight/edit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFlightData),
    })
      .then((data) => {
        updateScoresheetDataFromFlightModal(submitted);
      })
      .catch((err) => {
        console.error("Could not update flight #" + updatedFlightData.flightId);
      });
  };

  updateScoresheetDataFromFlightModal = (submitted) => {
    const fetchPromises = [];

    $(".flight-modal-scoresheet-row").each((idx, flightScoresheetRow) => {
      const updatedScoresheetData = {
        id: $(flightScoresheetRow).attr("scoresheet-id"),
        _ajax: "true",
        consensus_score: $(flightScoresheetRow)
          .find(".flight-modal-consensus")
          .val(),
        place: $(flightScoresheetRow).find(".flight-modal-place").val(),
        mini_boss_advanced: $(flightScoresheetRow)
          .find(".flight-modal-bos-advance")
          .val(),
        scoresheet_submitted: submitted,
      };

      fetchPromises.push(
        fetch("/scoresheet/update/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedScoresheetData),
        }).catch((err) => {
          console.error(
            "Could not update scoresheet entry #" +
              $(flightScoresheetRow)
                .find(".flight-modal-open-scoresheet-modal-button")
                .text()
          );
        })
      );
    });

    Promise.allSettled(fetchPromises).then(() => {
      closeAllModals();
      updateAllTables();
    });
  };

  updateScoresheetData = () => {
    const updatedScoresheetData = {
      id: $("#scoresheetModalScoresheetId").val(),
      entry_number: $("#scoresheetModalEntryNumber").val(),
      _ajax: "true",
    };

    fetch("/scoresheet/update/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedScoresheetData),
    })
      .then(() => {
        closeAllModals();
        updateAllTables();
      })
      .catch((err) => {
        console.error(
          "Could not update scoresheet entry #" +
            updatedScoresheetData.entry_number
        );
      });
  };

  generatePdfPreview = (scoresheetId) => {
    fetch("/scoresheet/previewpdf/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scoresheetId,
      }),
    })
      .then((data) => data.text())
      .then((data) => {
        const overlay =
          data +
          `
			<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:99;background-color:rgba(0,0,0,0.1);color:rgba(0,0,0,0.3);font-size:100px;display:flex;justify-content:center;align-items:center;">
				PREVIEW
			</div>
			`;

        $("#scoresheetModalId").attr("srcdoc", overlay);
      })
      .catch((err) => {
        console.error("Could not generate scoresheet preview");
      });
  };

  const generateScoresheetModalTableRow = (scoresheet) => {
    return `
		<tr class="flight-modal-scoresheet-row" scoresheet-id="${scoresheet.id}">
			<td scope="row">
				<a role="button" class="link-style flight-modal-open-scoresheet-modal-button" onclick=openScoresheetDataModal("${
          scoresheet.id
        }")>${scoresheet.entry_number}</a>
			</td>
			<td>${scoresheet.category + scoresheet.sub} - ${scoresheet.subcategory}</td>
			<td class="text-center">
				<input class="form-control form-control-sm text-center" type="number" value="${
          scoresheet.judge_total
        }" disabled />
			</td>
			<td class="text-center">
				<input class="form-control form-control-sm text-center flight-modal-consensus" type="number" value="${
          scoresheet.consensus_score
        }"  ${scoresheet.scoresheet_submitted ? "disabled" : ""}/>
			</td>
			<td class="text-center">
				<select class="form-control form-control-sm flight-modal-place"  ${
          scoresheet.scoresheet_submitted ? "disabled" : ""
        }>
					<option>-</option>
					<option value="0" ${scoresheet.place === 0 ? "selected" : ""}>Advance</option>
					<option value="1" ${scoresheet.place === 1 ? "selected" : ""}>1st</option>
					<option value="2" ${scoresheet.place === 2 ? "selected" : ""}>2nd</option>
					<option value="3" ${scoresheet.place === 3 ? "selected" : ""}>3rd</option>
				</select>
			</td>
			<td class="text-center">
				<input class="form-check-input position-static m-0 flight-modal-bos-advance" type="checkbox" autocomplete="off" ${
          scoresheet.mini_boss_advanced ? "checked" : ""
        }  ${scoresheet.scoresheet_submitted ? "disabled" : ""}/>
			</td>
			<td class="text-center">
				<button class="btn btn-success btn-sm flight-modal-download-button" type="button"  ${
          !scoresheet.scoresheet_submitted ? "disabled" : ""
        } onclick="downloadPdf('${scoresheet.id}','${
      scoresheet.entry_number
    }')">📄</button>
			</td>
		</tr>
		`;
  };

  const generateFlightModalTableRow = (flight) => {
    return `
		<tr>
			<td scope="row">
				<a role="button" class="link-style" onclick=openFlightDataModal("${
          flight.id
        }")>${flight.flight_id}</a>
			</td>
			<td>${new Date(flight.date).toLocaleDateString()}</td>
			<td>${flight.location}</td>
			<td>${
        Object.values(Scoresheets).filter(
          (scoresheet) => scoresheet.flight_key === flight.id
        ).length
      }</td>
		</tr>
		`;
  };

  downloadPdf = (scoresheetId, scoresheetEntryNumber) => {
    fetch("/scoresheet/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scoresheetIds: [scoresheetId],
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        downloadHeartbeat(res.requestId, (blobData) => {
          download(blobData, `${scoresheetEntryNumber}.pdf`, "application/pdf");
        });
      });
  };

  downloadAllEntries = () => {
    const entries = [
      ...new Set(
        Object.values(Scoresheets).map((scoresheet) => scoresheet.entry_number)
      ),
    ];

    fetch("/scoresheet/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entryNumbers: entries,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        $("#download-all-entries-button").prop("disabled", true);
        $("#download-all-entries-button").html(
          `<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span><span id="${res.requestId}">0%</span> Downloaded`
        );

        downloadHeartbeat(res.requestId, (blobData) => {
          if (entries.length === 1) {
            download(blobData, `${entries[0]}.pdf`, "application/pdf");
          } else {
            download(blobData, "all_entries.zip", "application/zip");
          }

          $("#download-all-entries-button").prop("disabled", false);
          $("#download-all-entries-button").html("Download All Entries");
        });
      });
  };

  downloadHeartbeat = (requestId, completeCallback) => {
    const downloadHeartbeatIntervalId = setInterval(() => {
      fetch("/scoresheet/downloadstatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: requestId,
        }),
      }).then((res) => {
        if (res.status === 202) {
          // Processing still in progress
          res.json().then((status) => {
            $(`#${requestId}`).text(
              (100 * (status.completed / status.total)).toFixed() + "%"
            );
          });
        } else if (res.status === 201) {
          // Processing complete, recieving file
          res.blob().then((blobData) => {
            clearInterval(downloadHeartbeatIntervalId);
            completeCallback(blobData);
          });
        } else {
          // Something went wrong
          console.error("something went wrong", res.status);
        }
      });
    }, 500);
  };

  getRawDataDump = () => {
    const rawDataRows = Object.values(Scoresheets).map((scoresheet) => {
      const flightId = scoresheet.flight_key;
      const userId = scoresheet.user_id;

      const row = {
        ...scoresheet,
        ...Flights[flightId],
        ...Users[userId],
      };

      delete row.id;
      delete row.flight_key;
      delete row.user_id;
      delete row.user_level;
      delete row.created_by;

      return row;
    });

    const headers = Object.keys(rawDataRows[0]);
    const headersSortObject = headers.reduce(
      (acc, val, idx) => (acc[val] = idx),
      {}
    );

    const headersText = headers.join(",") + "\n";
    const values = rawDataRows
      .map((dataRow) => {
        return Object.entries(dataRow)
          .sort(([keyA, valA], [keyB, valB]) => {
            return headersSortObject[keyA] - headersSortObject[keyB];
          })
          .map(([key, val]) => `"${mapValsToBool(val)}"`)
          .join(",");
      })
      .join("\n");

    const fileBlob = new Blob([...headersText, ...values], {
      type: "text/plain;charset=utf-8",
    });

    download(fileBlob, "all_entries.csv", "application/text");
  };

  mapValsToBool = (val) => {
    if (val === true || val === "on") {
      return "1";
    } else if (val === false || val === null) {
      return "";
    } else {
      return val;
    }
  };
});
