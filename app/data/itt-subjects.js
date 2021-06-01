var CSV = require('csv-string')
const _ = require('lodash')

// Sort two things alphabetically, not case-sensitive
const sortAlphabetical = (x, y) => {
  if(x.toLowerCase() !== y.toLowerCase()) {
    x = x.toLowerCase();
    y = y.toLowerCase();
  }
  return x > y ? 1 : (x < y ? -1 : 0);
}

const upcaseFirstChar = input => {
  const upcaseString = string => {

    if (_.isString(string)){
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return ''
  }

  if (!input) return '' // avoid printing false to client

  if (_.isString(input)){
    return upcaseString(input)
  }
  else if (_.isArray(input)){
    return input.map(item => upcaseString(item))
  }

}

// const upcaseFirstChar = input => {
//   if (!input) return '' // avoid printing false to client
//   if (_.isString(input)){
//     return input.charAt(0).toUpperCase() + input.slice(1);
//   }
//   else return input
// }

let subjectSpecialismsCsv = 
`Subect specialism (Register reworded),EBacc Subject,Allocation Subject - (Register reworded)
product design,No,Art and design
creative arts and design,No,Art and design
applied biology,Yes,Biology
biology,Yes,Biology
environmental sciences,No,Biology
business and management,No,Business studies
business studies,No,Business studies
retail management,No,Business studies
chemistry,Yes,Chemistry
applied chemistry,Yes,Chemistry
UK government / Parliamentary studies,No,Other subjects
Ancient Hebrew,Yes,Classics
classical studies,Yes,Classics
classical Greek studies,Yes,Classics
historical linguistics,No,Classics
Latin language,Yes,Classics
media and communication studies,No,Other subjects
applied computing,No,Computing
computer science,Yes,Computing
information technology,No,Computing
dance,No,Physical education
design,No,Design and technology
product design,No,Design and technology
construction and the built environment,No,Design and technology
general or integrated engineering,No,Design and technology
manufacturing engineering,No,Design and technology
production and manufacturing engineering,No,Design and technology
textiles technology,No,Design and technology
materials science,No,Design and technology
food and beverage studies,No,Design and technology
drama,No,Drama
performing arts,No,Drama
economics,Yes,Economics
English studies,Yes,English
French language,Yes,Modern languages
geography,Yes,Geography
German language,Yes,Modern languages
health and social care,No,Other subjects
history,Yes,History
Italian language,Yes,Modern languages
modern languages,Yes,Modern languages
Chinese languages,Yes,Modern languages
mathematics,Yes,Mathematics
statistics,Yes,Mathematics
Arabic languages,Yes,Modern languages
Welsh language,Yes,Modern languages
Portuguese language,Yes,Modern languages
music education and teaching,No,Music
philosophy,No,Religious education
sports management,No,Physical education
sport and exercise sciences,No,Physical education
physics,Yes,Physics
applied physics,Yes,Physics
primary teaching,No,Primary
psychology,No,Other subjects
religious studies,No,Religious education
Russian languages,Yes,Modern languages
general sciences,Yes,Biology
social sciences,No,Other subjects
Spanish language,Yes,Modern languages
public services,No,Other subjects
travel and tourism,No,Other subjects
child development,Yes,Other subjects
health studies,No,Other subjects
law,No,Other subjects
early years teaching,No,Early years ITT
hospitality,No,Design and technology
recreation and leisure studies,No,Business studies
specialist teaching,No,Primary with mathematics
hair and beauty sciences,No,Other subjects`

let subjectSpecialismsCsvArray = CSV.parse(subjectSpecialismsCsv)
subjectSpecialismsCsvArray.shift() // remove header row

// Base data structure
let subjectsObjectArray = subjectSpecialismsCsvArray.map(specialism => {
  return {
    name: upcaseFirstChar(specialism[0]),
    isEbac: (specialism[1] == "Yes") ? true : false,
    allocationSubject: specialism[2]
  }
})

// Flat array of specialisms
let subjectSpecialismsArray = [... new Set(subjectsObjectArray.map(specialism => specialism.name))].sort(sortAlphabetical)


// Object keyed by specialism
// {
//   'Ancient Hebrew': {
//     name: 'Ancient Hebrew',
//     isEbac: true,
//     allocationSubject: 'Classics'
//   },
//   'Applied biology': {
//     name: 'Applied biology',
//     isEbac: true,
//     allocationSubject: 'Biology'
//   },
//   'Applied chemistry': {
//     name: 'Applied chemistry',
//     isEbac: true,
//     allocationSubject: 'Chemistry'
//   }
// }
let subjectSpecialisms = {}
subjectSpecialismsArray.forEach(subject => {
  subjectSpecialisms[subject] = subjectsObjectArray.find(item => item.name == subject)
})

// Flat array of allocation subjects
let allocationSubjectsArray = [... new Set(subjectsObjectArray.map(specialism => specialism.allocationSubject))].sort(sortAlphabetical)

// Object keyed by allocation subject
// {
//   'Art and design': {
//     name: 'Art and design',
//     subjectSpecialisms: [ 'Graphic design', 'Creative arts and design' ]
//   },
//   Biology: {
//     name: 'Biology',
//     subjectSpecialisms: [
//       'Applied biology',
//       'Biology',
//       'Environmental sciences',
//       'General sciences'
//     ]
//   },
//   'Business studies': {
//     name: 'Business studies',
//     subjectSpecialisms: [
//       'Business and management',
//       'Business studies',
//       'Retail management',
//       'Recreation and leisure studies'
//     ]
//   },...
let allocationSubjects = {}
allocationSubjectsArray.forEach(subject => {
  allocationSubjects[subject] = {
    name: subject,
    subjectSpecialisms: subjectsObjectArray.filter(specialism => specialism.allocationSubject == subject).map(specialism => specialism.name)
  }
})

let peSubjects = allocationSubjects['Physical education'].subjectSpecialisms
let modernLanguagesSubjects = allocationSubjects['Modern languages'].subjectSpecialisms

let ebacSubjects = subjectsObjectArray.filter(specialism => specialism.isEbac).map(specialism => specialism.name).sort(sortAlphabetical)

// Subject subsets used for seed generators
// Non exaustive list
// Just ones commonly seen - good enough for seeds

commonPrimarySubjects = upcaseFirstChar([
  "primary teaching",
  "English studies",
  "mathematics",
  "Modern languages",
  // "Physical education",
  "biology",
  "specialist teaching", // primary with maths
  // "Early years teaching", // only for EYTS?
  "sport and exercise sciences",
  "Spanish language",
  "German language",
  "French language",
])

console.log(commonPrimarySubjects)

commonSecondarySubjects = upcaseFirstChar([
  "creative arts and design",
  "biology",
  "business studies",
  "chemistry",
  "media and communication studies",
  "computer science",
  "dance",
  "product design",
  "graphic design",
  "drama",
  "economics",
  "English studies",
  "geography",
  "health and social care",
  "history",
  "mathematics",
  "modern languages",
  "music education and teaching",
  "philosophy",
  // "Physical education", // not a specialism
  "physics",
  "psychology",
  "religious studies",
  "social sciences"
])

coreSubjects = upcaseFirstChar([
  "English studies",
  "mathematics",
  "physics",
  "chemistry",
  "biology"
])

module.exports = {
  subjectsObjectArray,
  subjectSpecialisms,
  subjectSpecialismsArray,
  allocationSubjects,
  allocationSubjectsArray,
  coreSubjects,
  modernLanguagesSubjects,
  peSubjects,
  commonPrimarySubjects,
  commonSecondarySubjects
}
