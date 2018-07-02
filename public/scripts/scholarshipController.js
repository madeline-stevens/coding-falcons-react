'use strict';

var app = app || {};

(function(module) {
  const scholarshipController = {};

  scholarshipController.scholarships = () => {
    $('.tab-content').hide();
    $('#scholarships').show();

  };
  module.scholarshipController = scholarshipController;
})(app);


// 'use strict';
// var app = app || {};
// (function(module) {
//   const aboutController = {
//   };
//   aboutController.about = function () {
//     $('.tab-content').hide();
//     $('#about').show();
//   };
//   // DONE: Define a function that hides all main section elements, and then reveals just the #about section:
//   module.aboutController = aboutController;
// })(app);