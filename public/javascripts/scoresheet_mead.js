//- Aroma Sliders
var aroma_malt = new Slider("#aroma_malt", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var aroma_hops = new Slider("#aroma_hops", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var aroma_fermentation = new Slider("#aroma_fermentation", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Appearance Sliders
var appearance_color = new Slider("#appearance_color", {
  ticks: [0, 20, 40, 60, 80, 100],
  ticks_positions: [0, 20, 40, 60, 80, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">Clear</p>',
    '<p class="rotate-tick-offset-15">Straw</p>',
    '<p class="rotate-tick-offset-10">Yellow</p>',
    '<p class="rotate-tick-offset-15">Gold</p>',
    '<p class="rotate-tick-offset-15">Amber</p>',
    '<p class="rotate-tick-offset-15">Brown</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var appearance_clarity = new Slider("#appearance_clarity", {
  ticks: [0, 50, 100],
  ticks_positions: [0, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-20">Brilliant</p>',
    '<p class="rotate-tick-offset-10">Hazy</p>',
    '<p class="rotate-tick-offset-15">Opaque</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var appearance_head = new Slider("#appearance_head", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Thin</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">Viscous</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var appearance_retention = new Slider("#appearance_retention", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Flavor Sliders
var flavor_malt = new Slider("#flavor_malt", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_hops = new Slider("#flavor_hops", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-10">Dry</p>',
    '<p class="rotate-tick-offset-15">Sweet</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_bitterness = new Slider("#flavor_bitterness", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_fermentation = new Slider("#flavor_fermentation", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_balance = new Slider("#flavor_balance", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var flavor_finish_aftertaste = new Slider("#flavor_finish_aftertaste", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-10">Quick</p>',
    '<p class="rotate-tick-offset-15">Lasting</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Mouthfeel Sliders
var mouthfeel_body = new Slider("#mouthfeel_body", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Thin</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">Full</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
var mouthfeel_carbonation = new Slider("#mouthfeel_carbonation", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});
// var mouthfeel_warmth = new Slider("#mouthfeel_warmth", {
//   ticks: [0, 10, 50, 100],
//   ticks_positions: [0, 10, 50, 100],
//   ticks_labels: [
//     '<p class="rotate-tick-offset-15">None</p>',
//     '<p class="rotate-tick-offset-10">Low</p>',
//     '<p class="rotate-tick-offset-10">Med</p>',
//     '<p class="rotate-tick-offset-10">High</p>',
//   ],
//   ticks_snap_bounds: 3,
//   value: 0,
// });
// var mouthfeel_creaminess = new Slider("#mouthfeel_creaminess", {
//   ticks: [0, 10, 50, 100],
//   ticks_positions: [0, 10, 50, 100],
//   ticks_labels: [
//     '<p class="rotate-tick-offset-15">None</p>',
//     '<p class="rotate-tick-offset-10">Low</p>',
//     '<p class="rotate-tick-offset-10">Med</p>',
//     '<p class="rotate-tick-offset-10">High</p>',
//   ],
//   ticks_snap_bounds: 3,
//   value: 0,
// });
var mouthfeel_astringency = new Slider("#mouthfeel_astringency", {
  ticks: [0, 10, 50, 100],
  ticks_positions: [0, 10, 50, 100],
  ticks_labels: [
    '<p class="rotate-tick-offset-15">None</p>',
    '<p class="rotate-tick-offset-10">Low</p>',
    '<p class="rotate-tick-offset-10">Med</p>',
    '<p class="rotate-tick-offset-10">High</p>',
  ],
  ticks_snap_bounds: 3,
  value: 0,
});

//- Summary Sliders
var overall_class_example = new Slider("#overall_class_example", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  ticks_labels: ["Not to Style", "Classic Example"],
  //- ticks_labels: ['<p class="rotate-tick-offset-15">Classic\nExample</p>', '<p style="transform: translateY(14px) rotate(270deg);transform-origin: center;">Not to\nStyle</p>'],
  ticks_snap_bounds: 3,
  value: 50,
});
var overall_flawless = new Slider("#overall_flawless", {
  ticks: [0, 100],
  ticks_positions: [0, 100],
  ticks_labels: ["Significant Flaws", "Flawless"],
  //- ticks_labels: ['<p class="rotate-tick-offset-15">Flawless</p>', '<p style="transform: translateY(18px) rotate(270deg);transform-origin: center;">Significant/nFlaws</p>'],
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
