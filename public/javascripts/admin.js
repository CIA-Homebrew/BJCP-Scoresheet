let openFlightDataModal = () => {};
let openScoresheetDataModal = () => {};
let openUserDataModal = () => {};
let openEntryDataModal = () => {};

let updateFlightData = () => {};
let updateScoresheetData = () => {};
let updateUserData = () => {};
let updateEntryData = () => {};

let downloadPdf = () => {};
let downloadEntryScoresheet = () => {};

const Users = {};
const Scoresheets = {};
const Flights = {};
let Entries = {};

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
        if (!flights.find((flight) => flight.id === scoresheet.FlightId))
          return;
        Scoresheets[scoresheet.id] = scoresheet;
      });

      // Entries are scoresheets indexed against entry_number. Multiple scoresheets can have same entry number so we capture arrays here
      Entries = scoresheets.reduce((acc, scoresheet) => {
        if (!flights.find((flight) => flight.id === scoresheet.FlightId))
          return acc;

        acc[scoresheet.entry_number] = acc[scoresheet.entry_number] || {
          scoresheets: [],
          category: [],
          cat_name: [],
          consensus_score: [],
          place: [],
          mini_boss_advanced: [],
        };

        acc[scoresheet.entry_number].id = scoresheet.entry_number;
        acc[scoresheet.entry_number].entry_number = scoresheet.entry_number;
        acc[scoresheet.entry_number].scoresheets.push(scoresheet);
        acc[scoresheet.entry_number].category.push(
          `${scoresheet.category || ""}${scoresheet.sub || ""}${
            scoresheet.subcategory ? " - " : ""
          }${scoresheet.subcategory || ""}`
        );
        acc[scoresheet.entry_number].cat_name.push(scoresheet.subcategory);
        acc[scoresheet.entry_number].consensus_score.push(
          scoresheet.consensus_score
        );
        acc[scoresheet.entry_number].place.push(scoresheet.place);
        acc[scoresheet.entry_number].mini_boss_advanced.push(
          scoresheet.mini_boss_advanced ? true : null
        );

        Object.keys(acc[scoresheet.entry_number]).forEach((key) => {
          if (!Array.isArray(acc[scoresheet.entry_number][key])) return;

          acc[scoresheet.entry_number][key + "_first"] =
            acc[scoresheet.entry_number][key][0] === true ||
            acc[scoresheet.entry_number][key][0] === "on"
              ? "✓"
              : acc[scoresheet.entry_number][key][0] === null ||
                acc[scoresheet.entry_number][key][0] === false
              ? ""
              : acc[scoresheet.entry_number][key][0];

          if (key === "scoresheets") return;

          // Check if every item in the array is equal. If not, judge info for that value doesn't match, and it's "contested"
          acc[scoresheet.entry_number][key + "_contested"] = !acc[
            scoresheet.entry_number
          ][key].every((val) => val === acc[scoresheet.entry_number][key][0]);
        });

        return acc;
      }, {});
    });
};

const updateAllTables = () => {
  fetchAllData().then(() => {
    updateTable("#scoresheets", Scoresheets);
    updateTable("#judges", Users);
    updateTable("#flights", Flights);
    updateTable("#entries", Entries);

    // Since we map mat_icon "warning" type in for contested entries, we can filter by that text to only show contested entries
    $("#filterByContested").on("click", function (event) {
      $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
        if (settings.nTable.id !== "entry_list_table") {
          return true;
        }

        return data
          .map((cell) =>
            event.target.checked ? cell.includes("warning") : true
          )
          .reduce((acc, val) => acc || val);
      });
      $("#entries").find("table").DataTable().draw();
    });

    $("#flightModalUser").html("<option selected disabled>Select...</option>");
    Object.values(Users).forEach((user) => {
      $("#flightModalUser").append(new Option(user.email, user.id));
    });

    $('[data-toggle="tooltip"]').tooltip();
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

  if (key === "created_by" || key === "UserId") {
    let userId = listItem[key];
    if (!userId && listItem.FlightId) {
      userId = Flights[listItem.FlightId].UserId;
    }
    value = `<a role="button" class="link-style" onclick="openDataModal('#judges','${userId}')">${Users[userId]?.firstname} ${Users[userId]?.lastname}</a>`;
  } else if (key === "FlightId") {
    const flightId = listItem[key];
    value = `<a role="button" class="link-style" onclick="openDataModal('#flights','${flightId}')">${Flights[flightId].flight_id}</a>`;
  } else if (key === "mini_boss_advanced" || key === "submitted") {
    value = listItem[key] ? "✓" : "";
  } else if (key === "place" || key === "place_first") {
    const placeCode = listItem[key];
    const placeValues = ["Adv.", "1st", "2nd", "3rd"];
    value = typeof placeCode === "number" ? placeValues[placeCode] : "";
  } else if (key === "numFlightEntries") {
    const flightId = listItem.id;
    value = Object.values(Scoresheets).filter(
      (scoresheet) => scoresheet.FlightId === flightId
    ).length;
  } else if (key === "numUserFlights") {
    const userId = listItem.id;
    value = Object.values(Flights).filter((flight) => flight.UserId === userId)
      .length;
  } else if (key === "numUserScoresheets") {
    const userId = listItem.id;
    const allFlightIds = Object.values(Flights)
      .filter((flight) => flight.UserId === userId)
      .map((flight) => flight.id);

    value = Object.values(Scoresheets)
      .map((scoresheet) => scoresheet.FlightId)
      .reduce((acc, val) => {
        if (allFlightIds.includes(val)) {
          acc += 1;
        }
        return acc;
      }, 0);
  } else if (key === "date") {
    value = new Date(listItem[key]).toLocaleDateString();
  } else if (key === "numEntryScoresheets") {
    const entryNumber = listItem.id;
    value = Entries[entryNumber].scoresheets.length;
  } else if (key.split("_")[0] === "mismatched") {
    const entryNumber = listItem.id;
    const prop = key.split("_").slice(1).join("_");

    if (Entries[entryNumber][prop + "_contested"]) {
      value = `<span class="material-icons" style="cursor:pointer;" data-toggle="tooltip" data-placement="top" title="${Entries[
        entryNumber
      ][prop]
        .map((val, idx) => {
          const user =
            Users[
              Flights[Entries[entryNumber].scoresheets[idx].FlightId].UserId
            ];
          const scoresheet = Entries[entryNumber].scoresheets[idx];

          return (
            user.firstname +
            " " +
            user.lastname +
            ": " +
            (scoresheet[prop] === true || scoresheet[prop] === "on"
              ? "✓"
              : scoresheet[prop] === null || scoresheet[prop] === false
              ? "✗"
              : scoresheet[prop])
          );
        })
        .join("\n")}">warning</span>`;
    } else {
      value = "";
    }
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
  } else if (tableId === "#entries") {
    openEntryDataModal(id);
  }
};

const showDeleteScoresheetModal = (id) => {
  const scoresheetId = id || $("#scoresheetModalScoresheetId").val();

  if (!scoresheetId) return;

  $("#scoresheet-to-delete").val(scoresheetId);
  $("#user_verify_scoresheet_delete").prop("checked", false);
  $("#confirm-delete-scoresheet-modal").modal("show");
};

const clearScoresheetToDelete = () => {
  $("#scoresheet-to-delete").val(null);
  $("#user_verify_scoresheet_delete").prop("checked", false);
};

const showDeleteFlightModal = (id) => {
  const flightId = id || $("#flightModalName").attr("flight-id");

  if (!flightId) return;

  $("#flight-to-delete").val(flightId);
  $("#user_verify_flight_delete").prop("checked", false);
  $("#confirm-delete-flight-modal").modal("show");
};

const clearFlightToDelete = () => {
  $("#flight-to-delete").val(null);
  $("#user_verify_flight_delete").prop("checked", false);
};

const closeAllModals = () => {
  $("#flightDataModal").modal("hide");
  $("#scoresheetDataModal").modal("hide");
  $("#userDataModal").modal("hide");
  $("#entryDataModal").modal("hide");
};

$(() => {
  $("#aboutContestedPopover").popover();
  updateAllTables();

  openFlightDataModal = (flightId) => {
    const flight = Flights[flightId];
    if (!flight) return;
    closeAllModals();

    const flightScoresheetsHtml = Object.values(Scoresheets)
      .filter((scoresheet) => scoresheet.FlightId === flightId)
      .map((scoresheet) => generateScoresheetModalTableRow(scoresheet, flight))
      .join("");

    $("#flightModalName").val(flight.flight_id);
    $("#flightModalName").attr("flight-id", flight.id);
    $("#flightModalLocation").val(flight.location);
    $("#flightModalLocation").prop("disabled", flight.submitted);
    $("#flightModalDate").val(flight.date.slice(0, 10));
    $("#flightModalDate").prop("disabled", flight.submitted);
    $("#flightModalUser").val(flight.UserId);
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
      (scoresheet) => Flights[scoresheet.FlightId].UserId === userId
    );
    $("#userModalResetPasswordButton").off("click");

    closeAllModals();

    $("#userModalEmail").val(user.email);
    $("#userModalEmailVerified").prop("checked", user.email_verified);
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

  openEntryDataModal = (entryNumber) => {
    const entry = Entries[entryNumber];
    if (!entry) return;
    closeAllModals();

    const contested = Object.keys(Entries[entryNumber])
      .map((key) => key.match(/_contested/g) && Entries[entryNumber][key])
      .reduce((acc, val) => acc || val === true, false);
    $("#entryModalEntryContested").attr("hidden", !contested);

    const flightScoresheetsHtml = Entries[entryNumber].scoresheets
      .map((scoresheet) =>
        generateEntryTableRow(scoresheet, Flights[scoresheet.FlightId])
      )
      .join("");
    $("#entryModalEntryNumber").val(entry.id);
    $("#entryModalCategory").val(entry.scoresheets_first.category);
    $("#entryModalSub").val(entry.scoresheets_first.sub);
    $("#entryModalSubcat").val(entry.scoresheets_first.subcategory);

    $("#entryModalScoresheets").html(flightScoresheetsHtml);

    $("#entryDataModal").modal("show");
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
        email_verified: $("#userModalEmailVerified").prop("checked"),
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
        `Do you really want to reset the password for user "${Users[userId].email}" (${Users[userId].firstname} ${Users[userId].lastname})? This action is unrevokable.
        `
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
              `Reset password for user "${Users[userId].email}" (${Users[userId].firstname} ${Users[userId].lastname}) to:\n\n${data.updatedPassword}\n\nThis password has been copied to the clipboard - YOU WILL NEED TO GIVE IT TO THE USER.`
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
      submitted: Boolean($("#flighModalSubmitted").prop("checked")),
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

  deleteFlight = () => {
    const flightId = $("#flight-to-delete").val();
    const userVerifiedDelete = $("#user_verify_flight_delete").prop("checked");

    $("#flight-to-delete").val(null);
    $("#user_verify_flight_delete").prop("checked", false);
    $("#confirm-delete-flight-modal").modal("hide");

    if (!userVerifiedDelete) return;

    fetch("/flight/delete/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flightId: flightId }),
    })
      .then((response) => response.json())
      .then((deletedFlightId) => {
        delete Flights[deletedFlightId];
        closeAllModals();
        updateAllTables();
      })
      .catch((err) => {
        // TODO: Error handling here
        window.alert("Error deleting. Please try again later.");
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

  updateScoresheetData = (updatedData) => {
    const updatedScoresheetData = updatedData || {
      id: $("#scoresheetModalScoresheetId").val(),
      entry_number: $("#scoresheetModalEntryNumber").val(),
    };

    updatedScoresheetData._ajax = "true";

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

  deleteScoresheet = () => {
    const scoresheetId = $("#scoresheet-to-delete").val();
    const userVerifiedDelete = $("#user_verify_scoresheet_delete").prop(
      "checked"
    );

    $("#scoresheet-to-delete").val(null);
    $("#user_verify_scoresheet_delete").prop("checked", false);
    $("#confirm-delete-scoresheet-modal").modal("hide");

    if (!userVerifiedDelete) return;

    fetch("/scoresheet/delete/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scoresheetId: scoresheetId }),
    })
      .then((response) => response.json())
      .then((deletedScoresheetId) => {
        delete Scoresheets[deletedScoresheetId];
        closeAllModals();
        updateAllTables();
      })
      .catch((err) => {
        // TODO: Error handling here
        window.alert("Error deleting. Please try again later.");
      });
  };

  updateEntryData = () => {
    const updatedEntryData = {
      entry_number: $("#entryModalEntryNumber").val(),
      category: $("#entryModalCategory").val(),
      sub: $("#entryModalSub").val(),
      subcategory: $("#entryModalSubcat").val(),
    };

    $("#entryModalScoresheets")
      .children()
      .each(function () {
        const updatedScoresheetData = {
          ...updatedEntryData,
          id: $(this).attr("data-scoresheet-id"),
          consensus_score: $(this).find(".entry-modal-consensus").first().val(),
          place: $(this).find(".entry-modal-place").first().val(),
          mini_boss_advanced: $(this)
            .find(".entry-modal-bos-advance")
            .first()
            .is(":checked"),
        };

        updateScoresheetData(updatedScoresheetData);
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

  const generateScoresheetModalTableRow = (scoresheet, flight) => {
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
        }"  ${flight.submitted ? "disabled" : ""}/>
			</td>
			<td class="text-center">
				<select class="form-control form-control-sm flight-modal-place"  ${
          flight.submitted ? "disabled" : ""
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
        }  ${flight.submitted ? "disabled" : ""}/>
			</td>
			<td class="text-center">
				<button class="btn btn-success btn-sm flight-modal-download-button" type="button"  ${
          !flight.submitted ? "disabled" : ""
        } onclick="downloadPdf('${scoresheet.id}')">📄</button>
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
        }")>${flight.FlightId}</a>
			</td>
			<td>${new Date(flight.date).toLocaleDateString()}</td>
			<td>${flight.location}</td>
			<td>${
        Object.values(Scoresheets).filter(
          (scoresheet) => scoresheet.FlightId === flight.id
        ).length
      }</td>
		</tr>
		`;
  };

  const generateEntryTableRow = (scoresheet, flight) => {
    const userId = Flights[scoresheet.FlightId].UserId;

    return `
    <tr data-scoresheet-id="${scoresheet.id}">
      <td scope="row">
        <a role="button" class="link-style" onclick=openUserDataModal("${userId}")>${
      Users[userId].firstname
    } ${Users[userId].lastname}</a>
      </td>
      <td>
        <a role="button" class="link-style" onclick=openFlightDataModal("${
          scoresheet.FlightId
        }")>${Flights[scoresheet.FlightId].flight_id}</a>
      </td>
      <td>${scoresheet.category}${scoresheet.sub}-${scoresheet.subcategory}</td>
      <td>${scoresheet.judge_total}</td>
      <td class="text-center">
				<input class="form-control form-control-sm text-center entry-modal-consensus" type="number" value="${
          scoresheet.consensus_score
        }"  ${flight.submitted ? "disabled" : ""}/>
			</td>
			<td class="text-center">
				<select class="form-control form-control-sm entry-modal-place"  ${
          flight.submitted ? "disabled" : ""
        }>
					<option>-</option>
					<option value="0" ${scoresheet.place === 0 ? "selected" : ""}>Advance</option>
					<option value="1" ${scoresheet.place === 1 ? "selected" : ""}>1st</option>
					<option value="2" ${scoresheet.place === 2 ? "selected" : ""}>2nd</option>
					<option value="3" ${scoresheet.place === 3 ? "selected" : ""}>3rd</option>
				</select>
			</td>
			<td class="text-center">
				<input class="form-check-input position-static m-0 entry-modal-bos-advance" type="checkbox" autocomplete="off" ${
          scoresheet.mini_boss_advanced ? "checked" : ""
        }  ${flight.submitted ? "disabled" : ""}/>
			</td>
			<td class="text-center">
				<button class="btn btn-success btn-sm entry-modal-download-button" type="button"  ${
          !flight.submitted ? "disabled" : ""
        } onclick="downloadPdf('${scoresheet.id}')">📄</button>
			</td>
    </tr>
    `;
  };

  downloadEntryScoresheet = () => {
    $("#downloadEntryScoresheetButton").prop("disabled", true);

    downloadPdf($("#entryModalEntryNumber").val()).then(() => {
      $("#downloadEntryScoresheetButton").prop("disabled", false);
    });
  };

  downloadPdf = (id) => {
    let pdfName = "";
    let reqBody = "";

    if (Scoresheets[id]) {
      pdfName = `${Scoresheets[id].entry_number}.pdf`;
      reqBody = {
        scoresheetIds: [id],
      };
    } else if (Entries[id]) {
      pdfName = `${id}.pdf`;
      reqBody = {
        entryNumbers: [id],
      };
    } else return;

    return fetch("/scoresheet/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((res) => res.json())
      .then((res) => {
        downloadHeartbeat(res.requestId, (blobData) => {
          download(blobData, pdfName, "application/pdf");
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
    }, 1000);
  };

  getRawDataDump = () => {
    const rawDataRows = Object.values(Scoresheets).map((scoresheet) => {
      const flightId = scoresheet.FlightId;
      const userId = Flights[scoresheet.FlightId].UserId;

      const row = {
        ...scoresheet,
        ...Flights[flightId],
        ...Users[userId],
      };

      delete row.id;
      delete row.FlightId;
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
