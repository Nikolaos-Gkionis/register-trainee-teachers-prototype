const _ = require('lodash')
const moment = require('moment')
const path = require('path')
const utils = require('./../lib/utils')
const url = require('url')
const filters = require('./../filters.js')()

module.exports = router => { 


  /*
  switch between bulk upload and bulk actions
  */
  router.get('/bulk-upload', function(req, res) {
    const data = req.session.data
    if (data.settings.bulkActionsNotBulkUploads) {
      res.redirect('/bulk-action')
    }
  })

  /* 
  =========================================================
  Add (missing) details routes 
  =========================================================
  */

  /* Review errors or skip */
  router.get('/bulk-action/add-details/fix-errors-answer', function(req, res) {
    const data = req.session.data
    if (data.bulk.addDetailsFixErrors == "Yes, fix errors now" || data.bulk.addDetailsFixErrors == "Yes, fix error now") {
      res.redirect('/bulk-action/add-details/fix-errors');
    } else {
      res.redirect('/bulk-action/add-details/review-pending-updates');
    }
  });

  /* Clear review errors answer */
  router.get('/bulk-action/add-details/no-update', function(req, res) {
    const data = req.session.data
    data.bulk.addDetailsFixErrors = null
    res.redirect('/bulk-action/add-details/review-pending-updates');
  });


  /* 
  =========================================================
  Recommened trainees for QTS or EYTS routes
  =========================================================
  */

  /* Review errors or skip */
  router.get('/bulk-action/recommend/fix-errors-answer', function(req, res) {
    const data = req.session.data
    if (data.bulk.recommendFixErrors == "Yes, fix errors now" || data.bulk.recommendFixErrors == "Yes, fix error now") {
      res.redirect('/bulk-action/recommend/fix-errors');
    } else {
      res.redirect('/bulk-action/recommend/review-pending-updates');
    }
  });

  /* Clear review errors answer */
  router.get('/bulk-action/recommend/no-update', function(req, res) {
    const data = req.session.data
    data.bulk.recommendFixErrors = null
    res.redirect('/bulk-action/recommend/review-pending-updates');
  });

}
