'use strict';

var app = app || {};

(function(module) {
  const contactController = {};

  contactController.contact = () => {
    $('.tab-content').hide();
    $('#contact').show();

  };
  module.contactController = contactController;
})(app);