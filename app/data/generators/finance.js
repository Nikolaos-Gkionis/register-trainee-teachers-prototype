const faker   = require('faker')
const weighted = require('weighted')

const financeData = require('./../finance.js')
const trainingRouteData = require('./../training-route-data')
const trainingRoutes = trainingRouteData.trainingRoutes

module.exports = (params) => {

  let routeData = trainingRoutes[params.route]
  let bursariesApplyForRoute = routeData?.bursariesAvailable || false

  let initiatives = routeData?.initiatives || []
  let randomInitiative = faker.helpers.randomize(initiatives)
  let initiative

  if (initiatives.length == 0){
   initiative = 'Not applicable'
  }
  else {
    initiative = weighted.select(["Not applicable", randomInitiative], [0.8, 0.2])
  }

  // Only some routes have bursaries
  let bursary = false
  if (bursariesApplyForRoute){
    bursary = {}

    bursary.selfFunded = weighted.select([true, false], [0.1, 0.9])

    let degreeItems = params?.degree?.items

    if (degreeItems && degreeItems.length > 1 && !bursary.selfFunded){
      bursary.degreeToBeUsedForBursaries = faker.helpers.randomize(degreeItems).id
    }

    if (!bursary.selfFunded){
      bursary.bursaryValue = faker.helpers.randomize([7000, 9000, 13000])
    }

  }

  return  {
    initiative,
    ...(bursary ? {bursary} : {}) // conditional
  }
}
