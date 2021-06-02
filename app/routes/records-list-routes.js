const url = require('url')
const _ = require('lodash')
const utils = require('./../lib/utils')

// Work around a bug where occasionally _unchecked would appear
// Also coerce to array to be easier to work with
const cleanInputData = data => {
  if (!data || data == '_unchecked') {
    return undefined
  }
  else {
    data = [].concat(data) // coerce to arrays so we can filter them
    // _unchecked sometimes appears - can't track down what's causing it
    data = data.filter(item => item != '_unchecked')
    return (data.length == 0) ? undefined : data // return undefined if array now empty
  }
}

const getSearchQuery = req => req.query?.searchQuery || ""

// Clean up query to create a filters object with selected filters
const getFilters = req => {

  // Copy the query
  let query = Object.assign({}, req.query)
  // let searchQuery = query?.searchQuery || ""
  // let searchQueryLowercase = searchQuery.toLowerCase()


  // Needed because this is coming via query string and not auto-data store
  // And these values may contain '_unchecked'
  let filtersToClean = [
  'filterStatus',
  'filterCycle',
  'filterUserProviders',
  'filterTrainingRoutes']
  filtersToClean.forEach(filter => query[filter] = cleanInputData(query[filter]))

  // Remap to an object so we can pass it to the filterRecords function
  // that is shared by the
  let filters = { 
    status: query.filterStatus,
    cycle: query.filterCycle,
    providers: query.filterUserProviders,
    trainingRoutes: query.filterTrainingRoutes,
    subject: query.filterSubject
  }

  return filters
}

// Todo: this could probably be simpler
const getHasFilters = (filters, searchQuery) => {
  return !!(filters.status) || !!(searchQuery) || !!(filters.subject && filters.subject != 'All subjects') || !!(filters.cycle) || !!(filters.trainingRoutes) || !!(filters.providers)
}

// Make object to hold details of selected filters with appropriate links to clear each one
const getSelectedFilters = req => {

  let query = Object.assign({}, req.query)
  let filters = getFilters(req)
  let searchQuery = getSearchQuery(req)
  let pathname = url.parse(req.url).pathname

  let hasFilters = getHasFilters(filters, searchQuery)

  if (!hasFilters) return false

  let selectedFilters = {
    categories: []
  }

  if (searchQuery) {
    let newQuery = Object.assign({}, query)
    delete newQuery.searchQuery
    selectedFilters.categories.push({
      heading: { text: "Text search" },
      items: [{
        text: searchQuery,
        href: url.format({
          pathname,
          query: newQuery,
        })
      }]
    })
  }

  if (filters.cycle) {
    selectedFilters.categories.push({
      heading: { text: 'Cycle' },
      items: filters.cycle.map((cycle) => {

        let newQuery = Object.assign({}, query)
        newQuery.filterCycle = filters.cycle.filter(a => a != cycle)
        return {
          text: cycle,
          href: url.format({
            pathname,
            query: newQuery,
          })
        }
      })
    })
  }

  if (filters.providers) {
    selectedFilters.categories.push({
      heading: { text: 'Provider' },
      items: filters.providers.map((provider) => {

        let newQuery = Object.assign({}, query)
        newQuery.filterUserProviders = filters.providers.filter(a => a != provider)

        return {
          text: provider,
          href: url.format({
            pathname,
            query: newQuery,
          })
        }
      })
    })
  }

  if (filters.trainingRoutes) {
    selectedFilters.categories.push({
      heading: { text: 'Training route' },
      items: filters.trainingRoutes.map((route) => {

        let newQuery = Object.assign({}, query)
        newQuery.filterTrainingRoutes = filters.trainingRoutes.filter(a => a != route)

        return {
          text: route,
          href: url.format({
            pathname,
            query: newQuery,
          })
        }
      })
    })
  }

  if (filters.status) {
    selectedFilters.categories.push({
      heading: { text: 'Status' },
      items: filters.status.map((status) => {

        let newQuery = Object.assign({}, query)
        newQuery.filterStatus = filters.status.filter(a => a != status)

        return {
          text: status,
          href: url.format({
            pathname,
            query: newQuery,
          })
        }
      })
    })
  }

  if (filters.subject && filters.subject != 'All subjects') {
    let newQuery = Object.assign({}, query)
    delete newQuery.filterSubject
    selectedFilters.categories.push({
      heading: { text: "Subject" },
      items: [{
        text: filters.subject,
        href: url.format({
          pathname,
          query: newQuery,
        })
      }]
    })
  }

  return selectedFilters
}


const handleRecordsFilters = (req, res) => {
  const data = req.session.data
  // We're not in a record, so make sure to flush record data
  delete req.session?.data?.record
  delete res.locals.data?.record

  // Grab filters and clean them up
  let filters = getFilters(req)
  let searchQuery = getSearchQuery(req)

  let hasFilters = getHasFilters(filters, searchQuery)

  // Show selected filters as labels that can be individually removed
  let selectedFilters = getSelectedFilters(req)

  // Filter records using the filters provided
  let filteredRecords = utils.filterRecords(data.records, data, filters)

  // Search traineeId and full name
  filteredRecords = utils.filterRecordsBySearchTerm(filteredRecords, searchQuery)

  // Sort records by sortOrder, defaulting to updatedDate
  filteredRecords = utils.sortRecordsBy(filteredRecords, (req?.query?.sortOrder || 'updatedDate'))
  
  return {
    filteredRecords,
    hasFilters,
    selectedFilters,
    linkSortByName: createSortLink(req, "lastName"),
    linkSortByDateUpdated: createSortLink(req, "updatedDate")
  }
}

module.exports = router => {

  // Route for page
  // Filters
  router.get(['/records', '/drafts'], function (req, res) {
    const data = req.session.data

    // We’re not in a record, so make sure to flush record data
    delete req.session?.data?.record
    delete res.locals.data?.record

    // Grab filters and clean them up
    let filters = getFilters(req)
    let searchQuery = getSearchQuery(req)

    let hasFilters = getHasFilters(filters, searchQuery)

    // Show selected filters as labels that can be individually removed
    let selectedFilters = getSelectedFilters(req)

    // Filter records using the filters provided
    let filteredRecords = utils.filterRecords(data.records, data, filters)

    // Search traineeId and full name
    filteredRecords = utils.filterRecordsBySearchTerm(filteredRecords, searchQuery)

    // Sort records by sortOrder, defaulting to updatedDate
    filteredRecords = utils.sortRecordsBy(filteredRecords, (req?.query?.sortOrder || 'updatedDate'))



    res.render('records', {
      filteredRecords,
      hasFilters,
      selectedFilters
    })
  })

}
