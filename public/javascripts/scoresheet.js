//- Universal data validator handler
function validatorHandler(_this) {
  // Simple validation to alert user to empty text fields
  if ($(_this).val().trim() !== "") {
    $(_this).removeClass("is-invalid");
    $(_this).addClass("is-valid");
  } else {
    $(_this).removeClass("is-valid");
    $(_this).addClass("is-invalid");
  }
}

let goHome = () => {};
let goToTab = () => {};
let update_tooltips = () => {};
let update_subcat = () => {};
let bjcp_data = {};

$(document).ready(function () {
  //- Data validator on event
  $("[data-toggle=popover]").popover();
  $("input.vCheck").on("keyup change", function () {
    validatorHandler(this);
  });

  load_bjcp_data().then((allCategories) => {
    // Populate style selector with category values
    $("#category option:gt(0)").remove();
    Object.keys(allCategories).forEach((category) => {
      $("#category").append(
        $(`<option>${category}</option>`).attr("value", category)
      );
    });

    bjcp_data = allCategories;
    load_scoresheet_data();
  });

  update_subcat = () => {
    const category = $("#category").val();
    let sub = $("#sub").val();

    if (category) {
      $("#sub option:gt(0)").remove();
      Object.keys(bjcp_data[category]).forEach((subcat) => {
        $("#sub").append($(`<option>${subcat}</option>`).attr("value", subcat));
      });
      $("#sub").val(sub);
    } else {
      $("#sub option:gt(0)").remove();
      sub = null;
    }

    return [category, sub];
  };

  update_tooltips = () => {
    const popoverIds = [
      "bjcp_aroma",
      "bjcp_appearance",
      "bjcp_flavor",
      "bjcp_mouthfeel",
      "bjcp_comments",
      "bjcp_history",
      "bjcp_ingredients",
      "bjcp_comparison",
      "bjcp_examples",
    ];
    const [category, sub] = update_subcat();
    $("#subcategory").val(bjcp_data[category]?.[sub]?.name);

    if (!bjcp_data?.[category]?.[sub]) {
      popoverIds.forEach((domId) => {
        $(`#${domId}`).attr(
          "data-content",
          "Please select a BJCP category and subcategory from the Information tab to populate style guideline data."
        );
      });
    } else {
      popoverIds.forEach((domId) => {
        const section = domId.split("_")[1];
        $(`#${domId}`).attr("data-content", bjcp_data[category][sub][section]);
      });
    }
  };

  set_place_bos = () => {
    $("#place").prop("disabled", false);
    $("#mini_boss_advanced").prop("disabled", false);
    $("#mini_boss_advanced_label")
      .removeClass("btn-outline-secondary")
      .addClass("btn-outline-success");

    if ($("#place").val() != -1) {
      $("#mini_boss_advanced").prop("disabled", true);
      $("#mini_boss_advanced_label")
        .removeClass("btn-outline-success")
        .addClass("btn-outline-secondary");
    } else if ($("#mini_boss_advanced").prop("checked")) {
      $("#place").prop("disabled", true);
    }
  };

  // post scoresheet as-is to db without submitting
  update_scoresheet = () => {
    var fData = $("form#newScoresheet").serialize();
    if (origForm !== fData) {
      //- We have changes to the form save them back
      let fDataObject = $("form#newScoresheet").serializeObject();
      fDataObject["_ajax"] = true;

      // Don't post data unless the entry number exists
      if (fDataObject.entry_number === "") return;

      // Update Judge Total to be a number
      fDataObject.judge_total = Number($("#judge_total").text());

      // Update scores to be numbers
      [
        "aroma_score",
        "appearance_score",
        "flavor_score",
        "mouthfeel_score",
        "overall_score",
      ].forEach((key) => {
        fDataObject[key] = $(`.${key}`).first().val();
      });

      // Populate checkboxes
      $("form#newScoresheet input:checkbox").each(function () {
        fDataObject[$(this).attr("id")] = $(this).is(":checked");
      });

      // Explicity set the scoresheetID if it exists
      fDataObject.id = $("#scoresheetId").val()
        ? $("#scoresheetId").val()
        : undefined;

      // Submit the updated scoresheet
      $.post("/scoresheet/update", fDataObject, function (data) {
        if (data.update) {
          $("#scoresheetId").val(data.id);
          set_place_bos();
        } else if (data.error) {
        }
      });
      //- Reset the base data comparison
      origForm = fData;
    }
  };

  // Save and quit
  goHome = () => {
    update_scoresheet();

    let scoreSections = [
      "aroma_score",
      "appearance_score",
      "flavor_score",
      "mouthfeel_score",
      "overall_score",
    ];

    if ($("#scoresheetType").val() === "mead") {
      scoreSections = [
        "aroma_score",
        "appearance_score",
        "flavor_score",
        "overall_score",
      ];
    }

    const zeroSectionScores = scoreSections
      .filter((key) => $(`.${key}`).first().val() == 0)
      .map((key) => key.replace("_score", ""));

    if (zeroSectionScores.length) {
      const confirmation = window.confirm(
        `The following sections have a score of 0: 
        \n${zeroSectionScores
          .map((word) => "- " + word.toUpperCase())
          .join("\n")} 
        \nAre you sure you would like to continue?`
      );

      if (!confirmation) return;
    }

    window.location.replace("/");
  };

  goToTab = (tabId) => {
    const tabIds = $('[data-toggle="tab"]')
      .map(function () {
        return this.id;
      })
      .get();
    const numTabs = tabIds.length - 1;
    const currentTabId = $('[data-toggle="tab"][aria-selected="true"]')
      .first()
      .attr("id");
    const currentTabIndex = tabIds.indexOf(currentTabId);

    if (tabIds.includes(tabId)) {
      const nextTabIndex = tabIds.indexOf(tabId);
      $("#nextTab").attr("disabled", nextTabIndex >= numTabs);
      $("#previousTab").attr("disabled", nextTabIndex <= 0);
      $(`#scoresheet-list a[id=${tabId}]`).tab("show");
    } else if (tabId === "next") {
      const nextTabIndex = currentTabIndex + 1;
      if (nextTabIndex > numTabs) return;
      $("#nextTab").attr("disabled", nextTabIndex >= numTabs);
      $("#previousTab").attr("disabled", nextTabIndex <= 0);
      $(`#scoresheet-list a[id=${tabIds[nextTabIndex]}]`).tab("show");
    } else if (tabId === "previous") {
      const nextTabIndex = currentTabIndex - 1;
      if (nextTabIndex < 0) return;
      $("#nextTab").attr("disabled", nextTabIndex >= numTabs);
      $("#previousTab").attr("disabled", nextTabIndex <= 0);
      $(`#scoresheet-list a[id=${tabIds[nextTabIndex]}]`).tab("show");
    }
  };

  //- Prevent the form from doing a general submit
  $("form#newScoresheet").submit(function (e) {
    e.preventDefault();
  });

  //- If we put this first, it works!! (Unlike the body wraps.)
  $("form#newScoresheet input:checkbox").on("change", function () {
    if ($(this).is(":checked")) {
      $(this).attr("value", "true");
    } else {
      $(this).attr("value", "false");
    }
  });

  //- On form change we save it back to the system
  //- This triggers on focusOut (i.e. when user clicks out)
  var origForm = $("form#newScoresheet").serialize();
  $("form#newScoresheet :input").focusout(update_scoresheet);

  //- This triggers when checkboxes are changed
  $("form#newScoresheet :checkbox").change(update_scoresheet);

  // Since sliders don't trigger on focusout, we toggle those differently using mouseUp
  $(".slider-handle, .slider-tick-label").mouseup(update_scoresheet);

  // Sync all score blocks and fire event when changed
  $(".section-score").change((evt) => {
    let maxScore = {
      aroma_score: 12,
      appearance_score: 3,
      flavor_score: 20,
      mouthfeel_score: 5,
      overall_score: 10,
    };

    if ($("#scoresheetType").val() === "mead") {
      maxScore = {
        aroma_score: 10,
        appearance_score: 6,
        flavor_score: 24,
        mouthfeel_score: 0,
        overall_score: 10,
      };
    }

    const key = evt.target.name;
    const val =
      evt.target.value < 0
        ? 0
        : evt.target.value > maxScore[key]
        ? maxScore[key]
        : Math.round(evt.target.value);

    if (val === 0) {
      $(`.${key}`).closest(".card").addClass("red-border");
    } else {
      $(`.${key}`).closest(".card").removeClass("red-border");
    }

    $(`.${key}`).val(val);

    const totalScore = Object.keys(maxScore).reduce((acc, val) => {
      acc += Number($(`.${val}`).first().val());
      return acc;
    }, 0);

    $("#judge_total").text(totalScore);
    update_scoresheet();
  });
});

$("#nextTab").on("click", () => {
  goToTab("next");
});

$("#previousTab").on("click", () => {
  goToTab("previous");
});

load_scoresheet_data = () => {
  const scoresheetId = $("#scoresheetId").val();
  if (!scoresheetId) {
    const flightId = $("#FlightId").val();

    fetch("/flight/getById", {
      method: "POST",
      body: JSON.stringify({ flightId: flightId }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((flightInfo) => {
        Object.keys(flightInfo).forEach((flightInfoKey) => {
          const field = document.getElementById(flightInfoKey);

          if (field) {
            if (flightInfoKey === "flight_total") {
              field.value = flightInfo[flightInfoKey] + 1;
              document.getElementById("flight_position").value =
                flightInfo[flightInfoKey] + 1;
            } else if (field.id === "date") {
              const date = new Date(flightInfo[flightInfoKey]);
              const year = String(date.getFullYear()).padStart(4, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");

              field.value = `${year}-${month}-${day}`;
            } else {
              field.value = flightInfo[flightInfoKey];
            }
          }
        });

        const scoreFields = [
          "aroma_score",
          "appearance_score",
          "flavor_score",
          "mouthfeel_score",
          "overall_score",
        ];

        scoreFields.forEach((fieldId) => {
          $(`.${fieldId}`).closest(".card").addClass("red-border");
        });
      });

    return;
  }

  fetch("/scoresheet/data", {
    method: "POST",
    body: JSON.stringify({ scoresheetId }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((data) => data.json())
    .then(({ scoresheet, flight, user }) => {
      Object.keys({ ...scoresheet, ...flight, ...user }).forEach((fieldId) => {
        const scoreFields = [
          "aroma_score",
          "appearance_score",
          "flavor_score",
          "mouthfeel_score",
          "overall_score",
        ];
        if (scoreFields.includes(fieldId)) {
          const currentVal = Number(scoresheet[fieldId]);

          $(`.${fieldId}`).val(currentVal);

          if (currentVal === 0) {
            $(`.${fieldId}`).closest(".card").addClass("red-border");
          } else {
            $(`.${fieldId}`).closest(".card").removeClass("red-border");
          }
        }

        const field = document.getElementById(fieldId);

        if (field) {
          if (scoresheet[fieldId] == true && field.type === "checkbox") {
            field.checked = true;
            field.value = true;

            if ($(`#${fieldId}_label`)) {
              $(`#${fieldId}_label`).addClass("active");
            }
          } else if (
            scoresheet[fieldId] == false &&
            field.type === "checkbox"
          ) {
            field.checked = false;
            field.value = false;
          } else if (field.id === "date") {
            const date = new Date(flight[fieldId]);
            const year = String(date.getFullYear()).padStart(4, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            field.value = `${year}-${month}-${day}`;
          } else if (field.hasAttribute("data-slider-ticks")) {
            window[field.id].setValue(scoresheet[fieldId]);
          } else if (field.id === "bjcp_id" || field.id === "bjcp_rank") {
            field.value = user[field.id];
          } else if (field.id === "location" || field.id === "flight_total") {
            field.value = flight[field.id];
          } else {
            field.value = scoresheet[fieldId];
          }

          //- update validation if needed
          if (field.classList.contains("vCheck")) {
            validatorHandler(field);
          }
        } else if (fieldId === "firstname" && user) {
          $("#judge_name").val(`${user.firstname} ${user.lastname}`);
        }

        set_place_bos();
        update_tooltips();
        const totalScore = scoreFields.reduce((acc, val) => {
          acc += Number($(`.${val}`).first().val());
          return acc;
        }, 0);

        $("#judge_total").text(totalScore);
      });
    });
};

load_bjcp_data = () => {
  const scoresheetType = $("#scoresheetType").val();

  return fetch("/bjcp2015.json")
    .then((data) => data.json())
    .then(([beer_data, mead_data, cider_data]) => {
      const beerCategories =
        scoresheetType === "beer"
          ? beer_data.reduce((acc, val) => {
              acc[val.id] = val.subcategory.reduce((acc, subcatInfo) => {
                const sub_id = subcatInfo.id.slice(-1);

                acc[sub_id] = {
                  sub_id,
                  ...subcatInfo,
                };

                return acc;
              }, {});
              return acc;
            }, {})
          : {};

      const ciderCategories =
        scoresheetType === "cider"
          ? cider_data.category.reduce((acc, val) => {
              acc[val.id] = val.subcategory.reduce((acc, subcatInfo) => {
                const sub_id = subcatInfo.id.slice(-1);

                acc[sub_id] = {
                  sub_id,
                  ...subcatInfo,
                };

                return acc;
              }, {});
              return acc;
            }, {})
          : {};

      const meadCategories =
        scoresheetType === "mead"
          ? mead_data.category.reduce((acc, val) => {
              acc[val.id] = val.subcategory.reduce((acc, subcatInfo) => {
                const sub_id = subcatInfo.id.slice(-1);

                acc[sub_id] = {
                  sub_id,
                  ...subcatInfo,
                };

                return acc;
              }, {});
              return acc;
            }, {})
          : {};

      return { ...beerCategories, ...ciderCategories, ...meadCategories };
    });
};

/*!
 * jQuery serializeObject - v0.2 - 1/20/2010
 * http://benalman.com/projects/jquery-misc-plugins/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Whereas .serializeArray() serializes a form into an array, .serializeObject()
// serializes a form into an (arguably more useful) object.

(function ($, undefined) {
  "$:nomunge"; // Used by YUI compressor.

  $.fn.serializeObject = function () {
    var obj = {};

    $.each(this.serializeArray(), function (i, o) {
      var n = o.name,
        v = o.value;

      obj[n] =
        obj[n] === undefined
          ? v
          : $.isArray(obj[n])
          ? obj[n].concat(v)
          : [obj[n], v];
    });

    return obj;
  };
})(jQuery);
