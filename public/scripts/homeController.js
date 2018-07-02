'use strict';


var app = app || {};

(function(module) {
  const homeController = {};

  homeController.home = () => {
    $('.tab-content').hide();
    $('#home').show();
  };
  module.homeController = homeController;
})(app);