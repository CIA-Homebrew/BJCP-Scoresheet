const showAddFlightModal = () => {
  $("#addFlightButton").show();
  $("#editFlightButton").hide();

  // Need to do this to adjust for timezone
  const today = new Date();
  const year = String(today.getFullYear()).padStart(4, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  $("#flightName").val("");
  $("#flightLocation").val("");
  $("#flightDate").val(`${year}-${month}-${day}`);

  $("#addFlightModal").modal("show");
};

const showEditFlightModal = (flightId) => {
  $("#editFlightButton").show();
  $("#addFlightButton").hide();

  const parentElement = $(`[flight-id="${flightId}"]`);

  const date = new Date(parentElement.attr("flight-date"));
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  $("#flight-to-edit").val(flightId);
  $("#flightName").val(parentElement.attr("flight-name"));
  $("#flightLocation").val(parentElement.attr("flight-location"));
  $("#flightDate").val(`${year}-${month}-${day}`);

  $("#addFlightModal").modal("show");
};

const showDeleteFlightModal = (flightId) => {
  $("#flight-to-delete").val(flightId);
  $("#confirm-delete-flight-modal").modal("show");
};

const showDeleteEntryModal = (flightId) => {
  $("#entry-to-delete").val(flightId);
  $("#confirm-delete-entry-modal").modal("show");
};

const addFlight = () => {
  const flightName = $("#flightName").val();
  const flightLocation = $("#flightLocation").val();
  const flightDate = new Date($("#flightDate").val());

  fetch("/flight/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flightName: flightName,
      flightLocation: flightLocation,
      flightDate: flightDate,
    }),
  }).then((response) => {
    if (response.status === 200) {
      // instead of dynamically moving the flight to the other tab, we will be lazy and just reload the page.
      // This action is infrequent enough it shouldn't break immersion *too* much.
      location.reload();
    } else {
      $("#addFlightModal").modal("hide");
      // todo: handle errors
    }
  });
};

const deleteFlight = () => {
  const flightId = $("#flight-to-delete").val();
  const userVerifiedDelete = $("#user_verify_flight_delete").prop("checked");

  if (!userVerifiedDelete) {
    $("#flight-to-delete").val(null);
    $("#user_verify_flight_delete").prop("checked", false);
    $("#confirm-delete-flight-modal").modal("hide");

    return;
  }

  fetch("/flight/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flightId: flightId,
    }),
  }).then((response) => {
    if (response.status === 200) {
      // instead of dynamically removing the flight, we will be lazy and just reload the page.
      // This action is infrequent enough it shouldn't break immersion *too* much.
      location.reload();
    } else {
      $("#flight-to-delete").val(null);
      $("#user_verify_flight_delete").prop("checked", false);
      $("#confirm-delete-flight-modal").modal("hide");
      // todo: handle errors
    }
  });
};

const editFlight = () => {
  const flightId = $("#flight-to-edit").val();
  const flightName = $("#flightName").val();
  const flightLocation = $("#flightLocation").val();
  const flightDate = new Date($("#flightDate").val());

  if (!flightId) return;

  fetch("/flight/edit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flightId: flightId,
      flightName: flightName,
      flightLocation: flightLocation,
      flightDate: flightDate,
    }),
  }).then((response) => {
    if (response.status === 200) {
      // instead of dynamically changing the flight, we will be lazy and just reload the page.
      // This action is infrequent enough it shouldn't break immersion *too* much.
      location.reload();
    } else {
      $("#flight-to-edit").val(null);
      $("#addFlightModal").modal("hide");
      // todo: handle errors
    }
  });
};

const confirmSubmitFlight = (flightId) => {
  $("#confirm-submit-flight-modal-zero-score-entry-container").prop(
    "hidden",
    true
  );
  $("#confirm-submit-flight-modal-zero-score-entry-list").html("");

  fetch("/flight/incompleteScoresheets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flightId: flightId,
    }),
  })
    .then((res) => res.json())
    .then((scoresheets) => {
      if (scoresheets.length) {
        $("#confirm-submit-flight-modal-zero-score-entry-container").prop(
          "hidden",
          false
        );
        scoresheets.forEach((scoresheet) => {
          $("#confirm-submit-flight-modal-zero-score-entry-list").append(
            `<li>${scoresheet}</li>`
          );
        });
      }

      $("#flight-to-submit").val(flightId);
      $("#confirm-submit-flight-modal").modal("show");
    });
};

const confirmDeleteFlight = (flightId) => {
  $("#flight-to-delete").val(flightId);
  $("#confirm-delete-flight-modal").modal("show");
};

const clearFlightToSubmit = () => {
  $("#flight-to-submit").val(null);
  $("#user_verify_flight_submit").prop("checked", false);
};

const clearFlightToDelete = () => {
  $("#flight-to-delete").val(null);
};

const clearEntryToDelete = () => {
  $("#entry-to-delete").val(null);
};

const submitFlight = () => {
  const userVerified = $("#user_verify_flight_submit").prop("checked");
  if (!userVerified) return;

  const flightId = $("#flight-to-submit").val();
  // To do: Submit flight here
  fetch("/flight/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flightId: flightId,
    }),
  }).then((response) => {
    $("#confirm-submit-flight-modal").modal("hide");
    $("#flight-to-submit").val(null);
    $("#user_verify_flight_submit").prop("checked", false);

    if (response.status === 200) {
      const body = response.json();

      // instead of dynamically moving the flight to the other tab, we will be lazy and just reload the page.
      // This action is infrequent enough it shouldn't break immersion *too* much.
      location.reload();
    } else {
      // todo: handle errors
      clearFlightToSubmit();
    }
  });
};

const updateScoresheet = (scoresheetId, param, newVal) => {
  const requestBody = {
    id: scoresheetId,
    _ajax: "true",
  };
  requestBody[param] = newVal;

  fetch("/scoresheet/update/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      // Don't allow 2nd round advance and placement simultaneously
      if (param === "mini_boss_advanced" && newVal) {
        $(`#${scoresheetId}_row`)
          .closest(".flight-table")
          .find(".place-selector")
          .prop("disabled", true);
      } else if (param === "place" && newVal != -1) {
        $(`#${scoresheetId}_row`)
          .closest(".flight-table")
          .find(".mini-boss-selector")
          .prop("disabled", true);
        $(`#${scoresheetId}_row`)
          .closest(".flight-table")
          .find(".advance-button-wrapper")
          .removeClass("btn-outline-success")
          .addClass("btn-outline-secondary");
      } else if (param === "mini_boss_advanced" && !newVal) {
        $(`#${scoresheetId}_row`)
          .closest(".flight-table")
          .find(".place-selector")
          .prop("disabled", false);
      } else if (param === "place" && newVal == -1) {
        $(`#${scoresheetId}_row`)
          .closest(".flight-table")
          .find(".mini-boss-selector")
          .prop("disabled", false);
        $(`#${scoresheetId}_row`)
          .closest(".flight-table")
          .find(".advance-button-wrapper")
          .removeClass("btn-outline-secondary")
          .addClass("btn-outline-success");
      }
    })
    .catch((err) => {
      window.alert("Error updating. Please try again.");
      location.reload();
    });
};

let addEntry = () => {};
let editEntry = () => {};
let deleteEntry = () => {};
let downloadPdf = () => {};

$(document).ready(() => {
  if ($("#info-modal")) {
    $("#info-modal").modal("show");
  }

  // on page load
  addEntry = (flightId) => {
    $("#currentFlight").val(flightId);
    $("#addFlightModalEntryNumber").val(null);
    $("#scoresheet-type-selector-modal").modal("show");
  };

  initScoresheet = () => {
    const flightId = $("#currentFlight").val();
    const scoresheetType = $('input[name="scoresheetType"]:checked').val();
    const entryNumber = $("#addFlightModalEntryNumber").val();

    if (!entryNumber) {
      window.alert("Please provide an entry number!");
      return;
    }

    window.location.replace(
      `/scoresheet/edit?flightId=${flightId}&scoresheetType=${scoresheetType}&entryNumber=${entryNumber}`
    );
  };

  editEntry = (scoresheetId, scoresheetType) => {
    window.location.replace(
      `/scoresheet/edit?scoresheetId=${scoresheetId}&scoresheetType=${scoresheetType}`
    );
  };

  deleteEntry = () => {
    const entryToDelete = $("#entry-to-delete").val();
    const userVerifiedToDeleteEntry = $("#user_verify_entry_delete").prop(
      "checked"
    );

    $("#entry-to-delete").val(null);
    $("#user_verify_entry_delete").prop("checked", false);
    $("#confirm-delete-entry-modal").modal("hide");

    if (!userVerifiedToDeleteEntry) return;

    fetch("/scoresheet/delete/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scoresheetId: entryToDelete }),
    })
      .then((response) => {
        location.reload();
      })
      .catch((err) => {
        // TODO: Error handling here
        window.alert("Error deleting. Please try again.");
        location.reload();
      });
  };

  downloadPdf = (scoresheetId, scoresheetEntryNumber) => {
    $(`#download-${scoresheetId}`).prop("disabled", true);
    $(`#download-${scoresheetId}`).html(
      '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>'
    );

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
          $(`#download-${scoresheetId}`).prop("disabled", false);
          $(`#download-${scoresheetId}`).html(
            '<span class="material-icons align-middle" style="font-size:20px;">picture_as_pdf</span>'
          );
        });
      });
  };

  downloadAll = (scoresheetArray, flightId) => {
    fetch("/scoresheet/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scoresheetIds: scoresheetArray.map((scoresheet) => scoresheet.id),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        $(`#download-all-${flightId}`).prop("disabled", true);
        $(`#download-all-${flightId}`).html(
          `<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span><span id="${res.requestId}">0%</span> Downloaded`
        );

        downloadHeartbeat(res.requestId, (blobData) => {
          if (scoresheetArray.length === 1) {
            download(
              blobData,
              `${scoresheetArray[0].entry_number}.pdf`,
              "application/pdf"
            );
          } else {
            download(blobData, "scoresheets.zip", "application/zip");
          }

          $(`#download-all-${flightId}`).prop("disabled", false);
          $(`#download-all-${flightId}`).html("Download All");
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
});
