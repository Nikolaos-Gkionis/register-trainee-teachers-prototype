const _ = require('lodash')
const moment = require('moment')
const path = require('path')
const utils = require('./../lib/utils')
const url = require('url')
const filters = require('./../filters.js')()

module.exports = router => { 

  /* 
  =========================================================
  Add (missing) details routes
  =========================================================
  */

  /* Review errors or skip */
  router.get('/bulk-upload/add-details/errors-found-answer', function(req, res) {
    const data = req.session.data
    if (data?.bulk?.addDetailsFixErrors == "Fix errors now") {
      res.redirect('/bulk-upload/add-details/fix-errors');
    } else if (data?.bulk?.addDetailsFixErrors == "Skip fixing errors") {
      delete data?.bulk?.addDetailsFixErrors
      res.redirect('/bulk-upload/add-details/review-pending-updates');
    } else {
      res.redirect('/bulk-upload/add-details/errors-found');
    }
  });

  /* Clear review errors answer */
  router.get('/bulk-upload/add-details/no-update', function(req, res) {
    const data = req.session.data
    delete data?.bulk?.addDetailsFixErrors
    res.redirect('/bulk-upload/add-details/review-pending-updates');
  });


  /* 
  =========================================================
  Recommened trainees for QTS or EYTS routes
  =========================================================
  */

  /* Review errors or skip */
  router.get('/bulk-upload/recommend/fix-errors-answer', function(req, res) {
    const data = req.session.data
    if (data?.bulk?.recommendFixErrors == "Fix errors now") {
      res.redirect('/bulk-upload/recommend/fix-errors');
    } else if (data?.bulk?.recommendFixErrors == "Skip fixing errors") {
      delete data?.bulk?.recommendFixErrors
      res.redirect('/bulk-upload/recommend/review-pending-updates');
    } else {
      res.redirect('/bulk-upload/recommend/errors-found');
    }
  });

  /* Clear review errors answer */
  router.get('/bulk-upload/recommend/no-update', function(req, res) {
    const data = req.session.data
    delete data?.bulk?.recommendFixErrors
    res.redirect('/bulk-upload/recommend/review-pending-updates');
  });

}
