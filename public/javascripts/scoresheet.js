//- Aroma Sliders
var aroma_malt = new Slider("#aroma_malt", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var aroma_hops = new Slider("#aroma_hops", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var aroma_fermentation = new Slider("#aroma_fermentation", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Appearance Sliders
var appearance_color = new Slider("#appearance_color", {
  ticks: [0, 20, 40, 60, 80, 100],
  ticks_positions: [0, 20, 40, 60, 80, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">Yellow</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Gold</p>',
    '<p style="transform: translateY(16px) rotate(270deg);transform-origin: center;">Amber</p>',
    '<p style="transform: translateY(16px) rotate(270deg);transform-origin: center;">Copper</p>',
    '<p style="transform: translateY(14px) rotate(270deg);transform-origin: center;">Brown</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Black</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var appearance_clarity = new Slider("#appearance_clarity", {
  ticks: [0, 50, 100],
  ticks_positions: [0, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(18px) rotate(270deg);transform-origin: center;">Brilliant</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Hazy</p>',
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">Opaque</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var appearance_head = new Slider("#appearance_head", {
  ticks: [0, 25, 50, 75, 100],
  ticks_positions: [0, 25, 50, 75, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">White</p>',
    '<p style="transform: translateY(12px) rotate(270deg);transform-origin: center;">Ivory</p>',
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">Beige</p>',
    '<p style="transform: translateY(8px) rotate(270deg);transform-origin: center;">Tan</p>',
    '<p style="transform: translateY(14px) rotate(270deg);transform-origin: center;">Brown</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var appearance_retention = new Slider("#appearance_retention", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Flavor Sliders
var flavor_malt = new Slider("#flavor_malt", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_hops = new Slider("#flavor_hops", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_bitterness = new Slider("#flavor_bitterness", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_fermentation = new Slider("#flavor_fermentation", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_balance = new Slider("#flavor_balance", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">Hoppy</p>',
    '<p style="transform: translateY(12px) rotate(270deg);transform-origin: center;">Malty</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_finish_aftertaste = new Slider("#flavor_finish_aftertaste", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(7px) rotate(270deg);transform-origin: center;">Dry</p>',
    '<p style="transform: translateY(12px) rotate(270deg);transform-origin: center;">Sweet</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Mouthfeel Sliders
var mouthfeel_body = new Slider("#mouthfeel_body", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Thin</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Full</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var mouthfeel_carbonation = new Slider("#mouthfeel_carbonation", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var mouthfeel_warmth = new Slider("#mouthfeel_warmth", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var mouthfeel_creaminess = new Slider("#mouthfeel_creaminess", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var mouthfeel_astringency = new Slider("#mouthfeel_astringency", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  //- ticks_labels: ['None','Low','Med','High'],
  ticks_labels: [
    '<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">None</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Low</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">Med</p>',
    '<p style="transform: translateY(10px) rotate(270deg);transform-origin: center;">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Summary Sliders
var overall_class_example = new Slider("#overall_class_example", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  ticks_labels: ["Not to Style", "Classic Example"],
  //- ticks_labels: ['<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">Classic\nExample</p>', '<p style="transform: translateY(14px) rotate(270deg);transform-origin: center;">Not to\nStyle</p>'],
  ticks_snap_bounds: 3,
  value: 50,
});
var overall_flawless = new Slider("#overall_flawless", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  ticks_labels: ["Significant Flaws", "Flawless"],
  //- ticks_labels: ['<p style="transform: translateY(15px) rotate(270deg);transform-origin: center;">Flawless</p>', '<p style="transform: translateY(18px) rotate(270deg);transform-origin: center;">Significant/nFlaws</p>'],
  ticks_snap_bounds: 3,
  value: 50,
});
var overall_wonderful = new Slider("#overall_wonderful", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  ticks_labels: ["Lifeless", "Wonderful"],
  //- ticks_labels: ['<p style="transform: translateY(16px) rotate(270deg);transform-origin: center;">Wonderful</p>', '<p style="transform: translateY(16px) rotate(270deg);transform-origin: center;">Lifeless</p>'],
  ticks_snap_bounds: 3,
  value: 50,
});

//- Recalculate total score
function recalculate_score() {
  let aroma = document.getElementById("aroma_score").value;
  let appearance = document.getElementById("appearance_score").value;
  let flavor = document.getElementById("flavor_score").value;
  let mouthfeel = document.getElementById("mouthfeel_score").value;
  let summary = document.getElementById("overall_score").value;

  if (aroma > 12 || aroma < 0) {
    aroma = aroma > 12 ? 12 : 0;
  }
  if (appearance > 3 || appearance < 0) {
    appearance = appearance > 3 ? 3 : 0;
  }
  if (flavor > 20 || flavor < 0) {
    flavor = flavor > 20 ? 20 : 0;
  }
  if (mouthfeel > 5 || mouthfeel < 0) {
    mouthfeel = mouthfeel > 5 ? 5 : 0;
  }
  if (summary > 10 || summary < 0) {
    summary = summary > 10 ? 10 : 0;
  }

  $("#aroma_score").val(Math.round(aroma));
  $("#appearance_score").val(Math.round(appearance));
  $("#flavor_score").val(Math.round(flavor));
  $("#mouthfeel_score").val(Math.round(mouthfeel));
  $("#overall_score").val(Math.round(summary));

  document.getElementById("judge_total").innerText =
    Number(aroma) +
    Number(appearance) +
    Number(flavor) +
    Number(mouthfeel) +
    Number(summary);
}

//- Change 'scoresheet_submitted' input to true after submit confirmed
function confirm_submit() {
  $("input#scoresheet_submitted").val("1");
  update_scoresheet();
  window.alert("Scoresheet submitted!");
  window.location.replace("/scoresheet/load");
}

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

      // Submit the updated scoresheet
      $.post("/scoresheet/update", fDataObject, function (data) {
        if (data.update) {
          $("form#newScoresheet input#id").val(data.id);
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
    window.location.replace("/");
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

  //- Initialize and setup our bottle comments
  let bottleComment = $("input#bottle_inspection_comment");
  let quickCommentsOptions = $(".quick-comments-options");
  let quickCommentsList = $(".quick-comments-list");

  /** Dynamically create our quick comments
   TODO: this needs to be converted to database table for admin to add/remove
   **/
  let quick_comments = {
    "cap-color": [
      { "data-text": "Silver Cap", style: "badge badge-light" },
      { "data-text": "Gold Cap", style: "badge badge-light" },
      { "data-text": "Black Cap", style: "badge badge-light" },
      { "data-text": "White Cap", style: "badge badge-light" },
      { "data-text": "Blue Cap", style: "badge badge-light" },
      { "data-text": "Red Cap", style: "badge badge-light" },
      { "data-text": "Green Cap", style: "badge badge-light" },
      { "data-text": "Other Cap", style: "badge badge-light" },
    ],
    "bottle-fill": [
      { "data-text": "Very High Fill", style: "badge badge-secondary" },
      { "data-text": "High Fill", style: "badge badge-secondary" },
      { "data-text": "Good Fill", style: "badge badge-secondary" },
      { "data-text": "Low Fill", style: "badge badge-secondary" },
      { "data-text": "Very Low Fill", style: "badge badge-secondary" },
    ],
    "bottle-style": [
      { "data-text": "Longneck Bottle", style: "badge badge-dark" },
      { "data-text": "Stubby Bottle", style: "badge badge-dark" },
      { "data-text": "Belgian Bottle", style: "badge badge-dark" },
      { "data-text": "Champagne Bottle", style: "badge badge-dark" },
      { "data-text": "Other Bottle", style: "badge badge-dark" },
    ],
  };

  Object.keys(quick_comments).forEach(function (category) {
    let _com_sec = $("<div></div>");

    quick_comments[category].forEach(function (comment) {
      let bottleComment = formTagObject(comment);
      bottleComment.appendTo(_com_sec);
    });

    _com_sec.appendTo(quickCommentsOptions);
  });

  $("div.quick-comments-toggler").click(function () {
    if (quickCommentsOptions.is(":visible")) {
      //- Change the text
      $(this).text($(this).text().replace("Hide", "Show"));
      //- Change the color of the button
      $(this).removeClass("badge-secondary").addClass("badge-primary");
      //- Hide the comment sections
      quickCommentsOptions.addClass("d-none");
    } else {
      //- Change the text
      $(this).text($(this).text().replace("Show", "Hide"));
      //- Change the color of the button
      $(this).removeClass("badge-primary").addClass("badge-secondary");
      //- Show the comment sections
      quickCommentsOptions.removeClass("d-none");
    }
  });

  $(".quick-comments-options span.badge").click(function () {
    //- Add the tag
    insertBottleTag($(this));

    //- Update our input value
    updateBottleCommentVal("add", $(this).text());

    //- Hide the clicked element
    $(this).toggle(false);
  });

  quickCommentsList.on("click", "span[data-role=remove]", function (e) {
    //- Get our parent with the data we need
    let tag = $(this).parent("span");

    //- Show the quick comment this is associated to
    $(`.quick-comments-options span[data-value=${tag.data("value")}]`).toggle(
      true
    );

    //- Rmeove the selected value from the input
    updateBottleCommentVal("remove", tag.text());

    //- Remove this tag
    tag.remove();
  });

  $(".quick-comments input").on("keypress", function (e) {
    let confirmKeys = [13, 44];
    let returnOnEmpty = true;

    //- Check if the key pressed is one we want to fire the add event on
    if (confirmKeys.includes(e.which)) {
      //- If we don't want a blank value added return
      if (returnOnEmpty && $(this).val() === "") return;
      let v = $(this).val().replace(",", "");
      //- Add the value the user requested as a tag
      insertBottleTag(v);
      //- Add the value the user requested as a value
      updateBottleCommentVal("add", v);
      //- Clear our value
      $(this).val("");

      e.preventDefault();
    }
  });
});

let formTagObject = (comment) => {
  let _com_tpl = $("<span></span>");
  _com_tpl
    .data("data-value", comment["data-text"].replace(/\s+/g, ""))
    .attr("data-value", comment["data-text"].replace(/\s+/g, ""))
    .text(comment["data-text"])
    .addClass(comment.style)
    .addClass(" mx-1 px-1 py-1")
    .css("cursor", "pointer");

  return _com_tpl;
};

let updateBottleCommentVal = (action, value) => {
  let bottleComment = $("input#bottle_inspection_comment");
  let v = bottleComment.val().split(",");
  //- Remove blanks
  v = v.filter((_v) => _v !== "");

  switch (action) {
    case "add":
      v.push(value);
      break;
    case "remove":
      v = v.filter((t) => t.toLowerCase() !== value.toLowerCase());
      break;
  }

  //- Add the value to the input
  bottleComment.val(v.join(","));
  //- Force a save
  bottleComment.blur();
};

let insertBottleTag = (comment) => {
  //- Form the item to be added to the tags
  let tag_remove = $("<span data-role='remove''></span>");
  let tag = null;

  switch (typeof comment) {
    //- If we are handed an object just clone it
    case "object":
      tag = comment.clone();
      break;
    //- If we are handed anything else handle it as a string and build out an object
    default:
      comment = comment.toString();

      //- See if we have a quick comment that matches this
      let dv = comment.replace(/\s+/g, "");
      let f = $(".quick-comments-options").find(`span[data-value=${dv}]`);
      if (f.length === 1) {
        insertBottleTag(f);
        //- Hide the one that is already there
        f.toggle(false);
        return;
      }

      let _c = {
        "data-text": comment,
        style: "badge badge-primary",
      };
      tag = formTagObject(_c);
      break;
  }

  tag.append(tag_remove);

  //- Add it to the tag input
  $(".quick-comments-list").append(tag);
};

let buildQuickCommentInput = () => {
  let value = $("input#bottle_inspection_comment").val().split(",");
  value.forEach(function (v) {
    //- Add the tag
    insertBottleTag(v);
  });
};

load_scoresheet_data = () => {
  const scoresheetId = $("#id").val();
  if (!scoresheetId) return;

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
        const field = document.getElementById(fieldId);

        if (field) {
          if (scoresheet[fieldId] == true && field.type === "checkbox") {
            field.checked = true;
            field.value = true;
          } else if (
            scoresheet[fieldId] == false &&
            field.type === "checkbox"
          ) {
            field.checked = false;
            field.value = false;
          } else if (field.id === "session_date") {
            field.value = scoresheet[fieldId].slice(0, 10);
          } else if (field.hasAttribute("data-slider-ticks")) {
            window[field.id].setValue(scoresheet[fieldId]);
          } else if (field.id === "judge_name") {
            field.value = `${user.firstname} ${user.lastname}`;
          } else if (field.id === "bjcp_id" || field.id === "bjcp_rank") {
            field.value = user[field.id];
          } else if (field.id === "session_location") {
            field.value = scoresheet[fieldId] || flight.location;
          } else if (field.id === "bottle_inspection_comment") {
            field.value = scoresheet[field.id];
            buildQuickCommentInput();
          } else {
            field.value = scoresheet[fieldId];
          }

          //- update validation if needed
          if (field.classList.contains("vCheck")) {
            validatorHandler(field);
          }
        }

        update_tooltips();
        recalculate_score();
      });
    });
};

load_bjcp_data = () => {
  return fetch("/bjcp2015.json")
    .then((data) => data.json())
    .then(([beer_data, mead_data, cider_data]) => {
      const INCLUDE_BEER = true;
      const INCLUDE_CIDER = true;
      const INCLUDE_MEAD = true;

      const beerCategories = INCLUDE_BEER
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

      const ciderCategories = INCLUDE_CIDER
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

      const meadCategories = INCLUDE_MEAD
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
