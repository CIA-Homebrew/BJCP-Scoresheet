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

function doubleToHex(d) {
  // Converts decimal in string to hex in string
  let hexText = d.toString(16);
  const point = hexText.indexOf(".");
  if (point != -1) {
    hexText = hexText.substring(0, point);
  }
  while (hexText.length < 2) {
    hexText = "0" + hexText;
  }
  return hexText;
}

const srm_to_hex = (srm) => {
  // Returns an RGB value based on SRM
  let r = 0,
    g = 0,
    b = 0;

  if (srm >= 0 && srm <= 1) {
    r = 240;
    g = 239;
    b = 181;
  } else if (srm > 1 && srm <= 2) {
    r = 233;
    g = 215;
    b = 108;
  } else if (srm > 2) {
    // Set red decimal
    if (srm < 70.6843) {
      r = 243.8327 - 6.404 * srm + 0.0453 * srm * srm;
    } else {
      r = 17.5014;
    }
    // Set green decimal
    if (srm < 35.0674) {
      g = 230.929 - 12.484 * srm + 0.178 * srm * srm;
    } else {
      g = 12.0382;
    }
    // Set blue decimal
    if (srm < 4) {
      b = -54 * srm + 216;
    } else if (srm >= 4 && srm < 7) {
      b = 0;
    } else if (srm >= 7 && srm < 9) {
      b = 13 * srm - 91;
    } else if (srm >= 9 && srm < 13) {
      b = 2 * srm + 8;
    } else if (srm >= 13 && srm < 17) {
      b = -1.5 * srm + 53.5;
    } else if (srm >= 17 && srm < 22) {
      b = 0.6 * srm + 17.8;
    } else if (srm >= 22 && srm < 27) {
      b = -2.2 * srm + 79.4;
    } else if (srm >= 27 && srm < 34) {
      b = -0.4285 * srm + 31.5714;
    } else {
      b = 17;
    }
  }
  const red = doubleToHex(r);
  const green = doubleToHex(g);
  const blue = doubleToHex(b);
  return "#" + red + green + blue;
};

let goHome = () => {};
let goToTab = () => {};
let update_tooltips = () => {};
let update_subcat = () => {};
let bjcp_data = {};
let styleguide = "BJCP2021";

$(document).ready(async function () {
  // Enable style prop on popovers
  $.fn.tooltip.Constructor.Default.whiteList["*"].push("style");

  //- Data validator on event
  $("[data-toggle=popover]").popover();
  $("input.vCheck").on("keyup change", function () {
    validatorHandler(this);
  });

  await fetch(`/competitions/${$("#compSlug").val()}`)
    .then((res) => res.json())
    .then((res) => {
      styleguide = res.styleGuide;
      $("#competitionName").text(res.name + " Scoresheet");
      $("#competitionInstruction").text("Instructions: " + res.instruction);
    });

  load_bjcp_data().then((allCategories) => {
    // Populate style selector with category values
    $("#category option:gt(0)").remove();
    $("#baseStyleCategory option:gt(0)").remove();

    Object.keys(allCategories).forEach((category) => {
      $("#category").append(
        $(`<option>${category}</option>`).attr("value", category)
      );

      $("#baseStyleCategory").append(
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

  update_basestyle_subcat = () => {
    const baseStyleCategory = $("#baseStyleCategory").val();
    let baseStyleSub = $("#baseStyleSub").val();

    if (baseStyleCategory) {
      $("#baseStyleSub option:gt(0)").remove();
      Object.keys(bjcp_data[baseStyleCategory]).forEach((subcat) => {
        $("#baseStyleSub").append(
          $(`<option>${subcat}</option>`).attr("value", subcat)
        );
      });
      $("#baseStyleSub").val(baseStyleSub);
    } else {
      $("#baseStyleSub option:gt(0)").remove();
    }
  };

  generateAppearanceTooltip = (text, maxSrm, minSrm) =>
    `<div>
        <div>${text}</div>
        <div style="display: flex; justify-content: space-evenly;">
          <div style="background-color: ${srm_to_hex(minSrm)}; color: ${
      minSrm > 20 ? "white" : "black"
    }; height: 50px; width: 33%; text-align: center;">
            <div>Minimum: </div>
            <div>${minSrm} SRM</div>
          </div>
          <div style="background-color: ${srm_to_hex(maxSrm)}; color: ${
      minSrm > 20 ? "white" : "black"
    }; height: 50px; width: 33%; text-align: center;">
            <div>Maximum: </div>
            <div>${maxSrm} SRM</div>
          </div>
        </div>
      </div>`;

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
    let categoriesWithBaseStyles = [];

    switch (styleguide) {
      case "BJCP2015":
        categoriesWithBaseStyles = [
          "28A",
          "28B",
          "28C",
          "29A",
          "29B",
          "29C",
          "30A",
          "30D",
          "31A",
          "31B",
          "32A",
          "32B",
          "33A",
          "33B",
          "34A",
          "34B",
        ];
        break;
      case "BJCP2021":
      default:
        categoriesWithBaseStyles = [
          "28A",
          "28B",
          "28C",
          "29A",
          "29B",
          "29C",
          "30A",
          "30D",
          "31A",
          "31B",
          "32A",
          "32B",
          "33A",
          "33B",
          "34A",
          "34B",
        ];
        break;
    }

    const [category, sub] = update_subcat();

    const baseStyleCategoryEnabled = categoriesWithBaseStyles.includes(
      category + sub
    );
    let baseStyleCategory, baseStyleSub;

    $("#subcategory").val(bjcp_data[category]?.[sub]?.name);

    if (baseStyleCategoryEnabled) {
      $("#baseStyle").show();
      update_basestyle_subcat();
      baseStyleCategory = $("#baseStyleCategory").val();
      baseStyleSub = $("#baseStyleSub").val();
      $("#baseStyleName").text(
        bjcp_data[baseStyleCategory]?.[baseStyleSub]?.name
      );
    } else {
      $("#baseStyle").hide()[(baseStyleCategory, baseStyleSub)] = null;
    }

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
        if (section === "appearance") {
          const minSrm = bjcp_data[category][sub].stats?.srm.low;
          const maxSrm = bjcp_data[category][sub].stats?.srm.high;
          let appearance_content = generateAppearanceTooltip(
            bjcp_data[category][sub][section],
            maxSrm,
            minSrm
          );
          if (baseStyleCategoryEnabled && baseStyleCategory && baseStyleSub) {
            const baseMinSrm =
              bjcp_data[baseStyleCategory][baseStyleSub].stats?.srm.low;
            const baseMaxSrm =
              bjcp_data[baseStyleCategory][baseStyleSub].stats?.srm.high;
            appearance_content +=
              "<br><strong>Base Style Guidelines:</strong><br>" +
              generateAppearanceTooltip(
                bjcp_data[baseStyleCategory][baseStyleSub][section],
                baseMaxSrm,
                baseMinSrm
              );
          }

          $(`#${domId}`).attr("data-content", appearance_content);
        } else {
          $(`#${domId}`).attr(
            "data-content",
            baseStyleCategoryEnabled && baseStyleCategory && baseStyleSub
              ? `<div>
                <div>${bjcp_data[category][sub][section]}</div>
                <br><strong>Base Style Guidelines:</strong><br>
                <div>${bjcp_data[baseStyleCategory][baseStyleSub][section]}</div>
              </div>`
              : bjcp_data[category][sub][section]
          );
        }
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

      // Populate radio boxes (for mead)
      $('input[type="radio"]:checked').each(function () {
        const key = $(this).attr("name");
        const val = $(this).val();
        fDataObject[key] = val;
      });

      // Explicity set the scoresheetID if it exists
      const scoresheetId = $("#scoresheetId").val();
      fDataObject.id = scoresheetId ? $("#scoresheetId").val() : undefined;

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

  //- This triggers when radio buttons are changed
  $("form#newScoresheet :radio").change(update_scoresheet);

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
    update_scoresheet();

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

    if ($("#entry_number").val()) {
      validatorHandler($("#entry_number"));
      update_scoresheet();
    }

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

        // Populate mead radios
        if ($("#scoresheetType").val() === "mead") {
          if (fieldId === "appearance_head_other") {
            const carbonation = scoresheet[fieldId];
            $(`#carbonation_${carbonation}`).prop("checked", true);
          } else if (fieldId === "mouthfeel_creaminess") {
            const sweetness = scoresheet[fieldId];
            $(`#sweetness_${sweetness}`).prop("checked", true);
          } else if (fieldId === "mouthfeel_warmth") {
            const strength = scoresheet[fieldId];
            $(`#strength_${strength}`).prop("checked", true);
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

  if (scoresheetType === "beer") {
    const styleGuideText = {
      BJCP2021: "BJCP 2021 Style",
      BJCP2015: "BJCP 2015 Style",
    };

    $("#styleGuidelineText").text(styleGuideText[styleguide] || "Style");

    return fetch(`/${styleguide}.json`)
      .then((rawdata) => rawdata.json())
      .then((data) => {
        return data.beerjson.styles.reduce((acc, style) => {
          acc[style.category_id] = acc[style.category_id] || {};
          const substyle = style.style_id.replace(style.category_id, "");
          acc[style.category_id][substyle] = style;
          acc[style.category_id][substyle].stats = {
            ibu: {
              low: style.international_bitterness_units?.minimum.value || 1,
              high: style.international_bitterness_units?.maximum.value || 100,
            },
            srm: {
              low: style.color?.minimum.value || 1,
              high: style.color?.maximum.value || 50,
            },
            abv: {
              low: style.alcohol_by_volume?.minimum.value || 0.1,
              high: style.alcohol_by_volume?.maximum.value || 20,
            },
          };

          return acc;
        }, {});
      });
  } else {
    return fetch("/mead_bjcp2015.json")
      .then((data) => data.json())
      .then(([beer_data, mead_data, cider_data]) => {
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

        return { ...ciderCategories, ...meadCategories };
      });
  }
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
