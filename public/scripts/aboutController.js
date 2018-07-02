'use strict';

var app = app || {};

(function(module) {
  const aboutController = {};

  aboutController.about = () => {
    $('.tab-content').hide();
    $('#about').show();

  };
  module.aboutController = aboutController;
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