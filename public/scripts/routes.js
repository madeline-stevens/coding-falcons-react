'use strict';

var app = app || {};

page('/about', app.aboutController.about);
page('/scholarships', app.scholarshipController.scholarships);
page('/programs', app.programsController.programs);
page('/contact', app.contactController.contact);
page('/', app.homeController.home);


page();
