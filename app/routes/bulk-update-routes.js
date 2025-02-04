const _ = require('lodash')
const filters = require('./../filters.js')()
const moment = require('moment')
const path = require('path')
const seedRandom = require('seedrandom')
const url = require('url')
const utils = require('./../lib/utils')
const weighted = require('weighted')
const { faker } = require('@faker-js/faker')

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const rowsHaveErrors = rows => {
  if (Array.isArray(rows)) {
    return rows.some(row => row.uploadStatus == "error")
  } else {
    return false
  }
}

const rowsHaveUpdates = rows => {
  if (Array.isArray(rows)) {
    return rows.some(row => row.uploadStatus == "updated")
  } else {
    return false
  }
}

module.exports = router => {
  /* 
  =========================================================
  Add (missing) details routes
  =========================================================
  */

  /* Review errors or skip */
  router.get('/bulk-update/add-details/errors-found-answer', function(req, res) {
    const data = req.session.data
    if (data?.bulk?.addDetailsFixErrors == "Fix errors now") {
      res.redirect('/bulk-update/add-details/fix-errors');
    } else if (data?.bulk?.addDetailsFixErrors == "Skip fixing errors") {
      delete data?.bulk?.addDetailsFixErrors
      res.redirect('/bulk-update/add-details/check-pending-updates')
    } else {
      res.redirect('/bulk-update/add-details/errors-found')
    }
  })

  /* Set-up check updates page up as coming from upload */
  router.get('/bulk-update/add-details/fix-file', function(req, res) {
    const data = req.session.data
    data.bulk = {
      addDetailsFixErrors: true
    }
    res.redirect('/bulk-update/add-details/check-pending-updates');
  });

  /* Clear review errors answer */
  router.get('/bulk-update/add-details/no-update', function(req, res) {
    const data = req.session.data
    delete data?.bulk?.addDetailsFixErrors
    delete data?.bulk?.recommendFixErrors
    res.redirect('/bulk-update/add-details/check-pending-updates');
  });

  /* Get trainees to add missing details */
  router.post('/bulk-update/add-details/bulk-update-answer', function(req, res) {

    const data = req.session.data
    let filteredRecords  = utils.filterRecords(data.records, data)
    let uploadedTrainees = utils.filterByCanBulkUpdate(filteredRecords)
    let randomSeeded = seedRandom("update")

    let templateErrors = [
      "TRN not recognised",
      "TRN missing",
      "Trainee start date: '07/20/2023' — enter a valid start date",
      "Trainee start date: '20/07/2023' — trainee start date must be in the past",
      "URN not recognised",
      "school is closed"
    ]

    /* For each record, randomly pick whether it's ok, in error, or unchanged. If in error, pick a random error */
    let processedRows = uploadedTrainees.map((trainee, index) => {

      let row = {
        rowNumber: index + 1,
        trainee,
        uploadStatus: weighted.select(["error", "unchanged", "updated"], [0.25, 0.05, 0.7], randomSeeded)
      }

      if (row.uploadStatus == "error") {
        row.errorMessage = utils.pickRandom(templateErrors, randomSeeded)
      }

      if (!row.trainee.trainingDetails.commencementDate) {
        row.trainee.trainingDetails.commencementDate = getRandomArbitrary(6, 8) + "/" + getRandomArbitrary(1, 28) + "/" + data.years.defaultCourseYear
      }

      if (row.errorMessage == "URN not recognised" || row.errorMessage == "school is closed") {

        if (row.trainee?.placement?.items && row.trainee?.placement?.items.length) {
          row.errorMessage = "URN: '" + row.trainee.placement?.items[0]?.school?.urn + "' — " + row.errorMessage
        } else {
          row.errorMessage = "URN: '231231' – URN not recognised"
        }
      }
      return row
    })

    data.bulkUpload = {
      processedRows
    }

    if (rowsHaveErrors(processedRows) && rowsHaveUpdates(processedRows)) {
      res.redirect('/bulk-update/add-details/errors-found')
    } else if (rowsHaveErrors(processedRows) && !rowsHaveUpdates(processedRows)) {
      res.redirect('/bulk-update/add-details/fix-errors')
    } else if (!rowsHaveErrors(processedRows) && rowsHaveUpdates(processedRows)) {
      res.redirect('/bulk-update/add-details/check-pending-updates')
    }
    else {
      res.redirect('/bulk-update/add-details/ralph-to-add-url')
    }
  })

  /* 
  =========================================================
  Recommened trainees for QTS or EYTS routes
  =========================================================
  */

  /* Review errors or skip */
  router.get('/bulk-update/recommend/errors-found-answer', function(req, res) {
    const data = req.session.data
    if (data?.bulk?.recommendFixErrors == "Fix errors now") {
      res.redirect('/bulk-update/recommend/fix-errors');
    } else if (data?.bulk?.recommendFixErrors == "Skip fixing errors") {
      delete data?.bulk?.addDetailsFixErrors
      delete data?.bulk?.recommendFixErrors
      res.redirect('/bulk-update/recommend/check-pending-updates');
    } else {
      res.redirect('/bulk-update/recommend/errors-found');
    }
  });

  /* Set-up check updates page up as coming from upload */
  router.get('/bulk-update/recommend/fix-file', function(req, res) {
    const data = req.session.data
    data.bulk = {
      recommendFixErrors: true
    }
    res.redirect('/bulk-update/recommend/check-pending-updates');
  });

  /* Clear review errors answer */
  router.get('/bulk-update/recommend/no-update', function(req, res) {
    const data = req.session.data
    delete data?.bulk?.addDetailsFixErrors
    delete data?.bulk?.recommendFixErrors
    res.redirect('/bulk-update/recommend/check-pending-updates');
  });


  /* Get trainees to bulk recommend */
  router.post('/bulk-update/recommend/bulk-update-answer', function(req, res) {

    const data = req.session.data
    let filteredRecords  = utils.filterRecords(data.records, data)
    let uploadedTrainees = utils.filterByReadyToRecommend(filteredRecords)
    let randomSeeded = seedRandom("recommend")

    // Hiding these for research purposes
    // let templateErrors = [
    //   "TRN not recognised",
    //   "TRN and Provider trainee ID are not for the same trainee",
    //   "Trainee record is missing details and cannot be recommended",
    //   "Trainee has already been recommended for QTS",
    //   "Date standards met provided without a TRN or Provider trainee ID - add a TRN or Provider trainee ID or remove the date standards met",
    //   "Date standards met: '09/20/2023' — enter a valid date",
    //   "Date standards met: '20/09/2023' — Date standards met must be in the past"
    // ]

    // if (data.settings.bulkLinksInPrimaryNav != "Show bulk recommend") {
    //   templateErrors.push(
    //     "Postgraduate qualification: 'BA (Hons)' — enter 'PGCE', 'PGDE' or 'None' for postgraduate qualification",
    //     "Postgraduate qualification: 'PGCE' — trainees on undergraduate courses cannot be awarded a postgraduate qualification",
    //     "Postgraduate qualification missing. If the trainee did not get a postgraduate qualification enter 'None'"
    //   )
    // }

    /* For each record, randomly pick whether it's ok, in error, or unchanged. If in error, pick a random error */
    let processedRows = uploadedTrainees.map((trainee, index) => {

      let wildCardDate = getRandomArbitrary(1, 6) + "/" + getRandomArbitrary(1, 28) + "/" + data.years.endOfCurrentCycle

      let row = {
        trainee,
        uploadStatus: weighted.select(["error", "unchanged", "updated"], [0.02, 0.02, 0.96], randomSeeded),
        assessmentDate: weighted.select(["06/10/" + data.years.endOfCurrentCycle, "06/17/" + data.years.endOfCurrentCycle, "06/24/" + data.years.endOfCurrentCycle, wildCardDate], [0.5, 0.2, 0.2, 0.1], randomSeeded),
      }

      if (row.uploadStatus == "error") {
        // row.errorMessage = utils.pickRandom(templateErrors, randomSeeded)
        row.errorMessage = weighted.select([
            "Date standards met provided without a TRN or Provider trainee ID - add a TRN or Provider trainee ID or remove the date standards met", 
            "Date standards met: '20/09/2023' - date standards met must be in the past",
            "TRN and Provider trainee ID are not for the same trainee",
          ], 
          [0.25, 0.5, 0.25], randomSeeded)
      }

      return row
    })

    processedRows.sort((a, b) => utils.sortAlphabetical(a.trainee.personalDetails.familyName, b.trainee.personalDetails.familyName))

    processedRows.forEach((row, index) => {
      row.rowNumber = index + 1
    })

    data.bulkUpload = {
      processedRows
    }

    if (rowsHaveErrors(processedRows) && rowsHaveUpdates(processedRows)) {
      res.redirect('/bulk-update/recommend/errors-found')
    } else if (rowsHaveErrors(processedRows) && !rowsHaveUpdates(processedRows)) {
      res.redirect('/bulk-update/recommend/fix-errors')
    } else if (!rowsHaveErrors(processedRows) && rowsHaveUpdates(processedRows)) {
      res.redirect('/bulk-update/recommend/check-pending-updates')
    }
    else {
      res.redirect('/bulk-update/recommend/errors-found')
    }
  })

}
