var CSV = require('csv-string')
const _ = require('lodash')

// csv of monthly funding
let monthlyFundingCsv = 
`Created on,Description,August,September,October,November,December,January,February,March,April,May,June,July
2021-11-01,Course extension trainee payments,3250,3250,3250,1625,1625,0,0,0,0,0,0,0
2021-11-01,Training bursaries,0,88587,88587,88587,88587,88587,88587,127959,88587,88587,88587,59058
2021-11-01,Course extension provider payments,0,1000,1000,1000,1000,0,0,0,0,0,0,0
2021-11-01,Early years ITT bursaries and grants,0,7560,7560,7560,7560,7560,7560,10920,7560,7560,7560,5040
2021-10-01,Course extension trainee payments,3250,3250,3250,1625,1625,0,0,0,0,0,0,0
2021-10-01,Training bursary trainees,0,88587,88587,88587,88587,88587,88587,127959,88587,88587,88587,59058
2021-10-01,Course extension provider payments,0,1000,1000,1000,1000,0,0,0,0,0,0,0
2021-10-01,Early years ITT bursaries and grants,0,7560,7560,7560,7560,7560,7560,10920,7560,7560,7560,5040`

let monthlyFundingCsvArray = CSV.parse(monthlyFundingCsv)
monthlyFundingCsvArray.shift() // remove header row


let monthlyFunding = []
monthlyFundingCsvArray.forEach(row => {
  let dateUpdated = new Date(row[0])
  let description = row[1]
  let monthlyPayments = row.slice(2, 14).map(value => parseInt(value))
  let total = monthlyPayments.reduce((a, b) => a + b, 0)
  monthlyFunding.push({
    dateUpdated,
    description,
    monthlyPayments,
    total
  })
})


// csv of bursary payments
let bursaryPaymentsCsv = 
`Subject,Route,Lead School,Cohort Level,Bursary trainees,Bursary funding for subject
Biology,School Direct tuition fee,Beam Primary School,PG,17,26000
Chemistry,School Direct tuition fee,Beam Primary School,PG,5,26000
Computing,Provider-led,,PG,0,26000
Design & technology,School Direct tuition fee,Beam Primary School,PG,0,15000
English,School Direct tuition fee,Beam Primary School,PG,17,12000
History,School Direct tuition fee,Beam Primary School,PG,1,9000
Mathematics,School Direct tuition fee,Beam Primary School,PG,16,26000
Modern Languages,School Direct tuition fee,Beam Primary School,PG,14,26000
Music,School Direct tuition fee,Beam Primary School,PG,2,9000
Physics,School Direct tuition fee,Beam Primary School,PG,0,26000
Primary,School Direct tuition fee,Beam Primary School,PG,0,0
Primary with mathematics,Provider-led,,PG,0,6000
Religious education,Provider-led,,PG,0,9000`

let bursaryPaymentsCsvArray = CSV.parse(bursaryPaymentsCsv)
bursaryPaymentsCsvArray.shift() // remove header row

let bursaryPayments = []
bursaryPaymentsCsvArray.forEach(row => {
  let subject                 = row[0]
  let route                   = row[1]
  let leadSchool              = row[2]
  let cohortLevel             = row[3]
  let numberOfTrainees        = parseInt(row[4], 10)
  let bursaryValue            = parseInt(row[5], 10)
  let totalBursaryPerSubject  = numberOfTrainees * bursaryValue
  // to do - total per subject
  bursaryPayments.push({
    subject,
    route,
    leadSchool,
    cohortLevel,
    numberOfTrainees,
    bursaryValue,
    totalBursaryPerSubject
  })
})


// csv of scholarship payments
let scholarshipPaymentsCsv =
`Subject,Route,Lead School,Cohort Level,Scholarship trainees,Scholarship funding for subject
Biology,School Direct tuition fee,Beam Primary School,PG,0,0
Chemistry,School Direct tuition fee,Beam Primary School,PG,4,28000
Computing,Provider-led,,PG,0,28000
Design & technology,School Direct tuition fee,Beam Primary School,PG,0,0
English,School Direct tuition fee,Beam Primary School,PG,0,0
History,School Direct tuition fee,Beam Primary School,PG,0,0
Mathematics,School Direct tuition fee,Beam Primary School,PG,8,28000
Modern Languages,School Direct tuition fee,Beam Primary School,PG,0,28000
Music,School Direct tuition fee,Beam Primary School,PG,0,0
Physics,School Direct tuition fee,Beam Primary School,PG,2,28000
Primary,School Direct tuition fee,Beam Primary School,PG,0,0
Primary with mathematics,Provider-led,,PG,0,0
Religious education,Provider-led,,PG,0,0`

let scholarshipPaymentsCsvArray = CSV.parse(scholarshipPaymentsCsv)
scholarshipPaymentsCsvArray.shift() // remove header row

let scholarshipPayments = []
scholarshipPaymentsCsvArray.forEach(row => {
  let subject                     = row[0]
  let route                       = row[1]
  let leadSchool                  = row[2]
  let cohortLevel                 = row[3]
  let numberOfTrainees            = parseInt(row[4], 10)
  let scholarshipValue            = parseInt(row[5], 10)
  let totalscholarshipPerSubject  = numberOfTrainees * scholarshipValue

  scholarshipPayments.push({
    subject,
    route,
    leadSchool,
    cohortLevel,
    numberOfTrainees,
    scholarshipValue,
    totalscholarshipPerSubject
  })
})

//csv of early years ITTs bursaries
let eyIttBursariesCsv =
`Degree awarded,Bursary amount for Degree awarded,Number of trainees,Total bursary
"Tier 1 – First-class honours degree, doctoral degree, medical masters (distinction)",5000,4,20000
"Tier 2 – 2:1 honours degree, master’s degree",4000,5,20000
"Tier 3 – 2:2 honours degree",2000,2,4000`

let eyIttBursariesCsvArray = CSV.parse(eyIttBursariesCsv)
eyIttBursariesCsvArray.shift() // remove header row

let eyIttBursaries = []
eyIttBursariesCsvArray.forEach(row => {
  let tier             = row[0]
  let tierAmount       = row[1]
  let numberOfTrainees = row[2]
  eyIttBursaries.push({
    tier,
    tierAmount,
    numberOfTrainees
  })
})

//csv of early years ITT grant
let eyIttGrantsCsv =
`Number of trainees,grant amount,total
12,7000,84000`

let eyIttGrantsCsvArray = CSV.parse(eyIttGrantsCsv)
eyIttGrantsCsvArray.shift() // remove header row

let eyIttGrants = []
eyIttGrantsCsvArray.forEach(row => {
  let numberOfTrainees = row[0]
  let grantAmount      = row[1]
  eyIttGrants.push({
    numberOfTrainees,
    grantAmount
  })
})

module.exports = {
  monthlyFunding,
  bursaryPayments,
  scholarshipPayments,
  eyIttBursaries,
  eyIttGrants
}
