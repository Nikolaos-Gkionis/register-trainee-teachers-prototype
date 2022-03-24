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
  router.get('/bulk-upload/add-details/fix-errors-answer', function(req, res) {
    const data = req.session.data
    if (data.bulk.addDetailsFixErrors == "Yes, fix errors now" || data.bulk.addDetailsFixErrors == "Yes, fix error now") {
      res.redirect('/bulk-upload/add-details/fix-errors');
    } else {
      res.redirect('/bulk-upload/add-details/review-pending-updates');
    }
  });

  /* Clear review errors answer */
  router.get('/bulk-upload/add-details/no-update', function(req, res) {
    const data = req.session.data
    data.bulk.addDetailsFixErrors = null
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
    if (data.bulk.recommendFixErrors == "Yes, fix errors now" || data.bulk.recommendFixErrors == "Yes, fix error now") {
      res.redirect('/bulk-upload/recommend/fix-errors');
    } else {
      res.redirect('/bulk-upload/recommend/review-pending-updates');
    }
  });

  /* Clear review errors answer */
  router.get('/bulk-upload/recommend/no-update', function(req, res) {
    const data = req.session.data
    data.bulk.recommendFixErrors = null
    res.redirect('/bulk-upload/recommend/review-pending-updates');
  });

}
