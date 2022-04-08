const { faker }         = require('@faker-js/faker')
const weighted = require('weighted')

module.exports = () => {

  let ethnicGroup
  let ethnicGroupSpecific
  let disabledAnswer
  let disabilities

  const ethnicGroups = {
    "Asian or Asian British" : [
      "Bangladeshi",
      "Chinese",
      "Indian",
      "Pakistani",
      "Another Asian background",
      "Prefer not to say"
    ],
    "Black, African, Black British or Caribbean" : [
      "African",
      "Caribbean",
      "Another Black background",
      "Prefer not to say"
    ],
    "Mixed or multiple ethnic groups" : [
      "Asian and White",
      "Black African and White",
      "Black Caribbean and White",
      "Another Mixed background",
      "Prefer not to say"
    ],
    "White" : [
      "British, English, Northern Irish, Scottish",
      "Irish",
      "Irish Traveller or Gypsy",
      "Another White background",
      "Prefer not to say"
    ],
    "Another ethnic group" : [
      "Arab",
      "Another ethnic background",
      "Prefer not to say"
    ]
  }

    ethnicGroup = faker.helpers.randomize([
      "Asian or Asian British",
      "Black, African, Black British or Caribbean",
      "Mixed or multiple ethnic groups",
      "White",
      "Another ethnic group",
      "Prefer not to say"
    ])

    if (ethnicGroup != "Prefer not to say"){
      ethnicGroupSpecific = faker.helpers.randomize(
        ethnicGroups[ethnicGroup]
        )
    }

    disabledAnswer = faker.helpers.randomize([
      "They shared that they’re disabled",
      "They shared that they’re not disabled",
      "Not provided"])

    disabilityCount = faker.datatype.number(1, 3); // up to 3 disabilities

    let disabilityChoices = [
      "Blind",
      "Deaf",
      "Learning difficulty",
      "Long-standing illness",
      "Mental health condition",
      "Physical disability or mobility issue",
      "Social or communication impairment",
      "Other"
    ]
    let shuffledDisabilities = disabilityChoices.sort(() => 0.5 - Math.random());

    if ((disabledAnswer=="They shared that they’re disabled") && disabilityCount){
      disabilities = shuffledDisabilities.slice(0, disabilityCount).sort();
    }


  return {
    ethnicGroup,
    ethnicGroupSpecific,
    disabledAnswer,
    disabilities
  }
}
