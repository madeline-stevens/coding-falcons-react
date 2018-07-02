'use strict';

var app = app || {};

(function(module) {
  const programsController = {};

  programsController.programs = () => {
    $('.tab-content').hide();
    $('#programs').show();

  };
  module.programsController = programsController;
})(app);