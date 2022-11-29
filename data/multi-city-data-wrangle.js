// this files is a one-time operation to hydrate zipcodes.json with city data from multi-city-zipcodes.json

let baseJson = require('./zipcodes.json');
let multiCityJson = require('./multi-city-zipcodes.json');

let prevZip;
Object.entries(multiCityJson).forEach(([zip, data]) => {
  // create full list of cities for a zip code
  let cities = [data.primary_city];
  cities = cities.concat(
    data.acceptable_cities.split(', ').filter((val) => !!val),
  );

  // remove cities that are abbreviations
  cities = cities.filter((city) => {
    let isAbbreviation = false;
    for (const compareCity of cities) {
      // check if compare city is the same, is not longer, or doesn't have same number of spaces
      if (
        compareCity === city ||
        city.length >= compareCity.length ||
        city.split(' ').length !== compareCity.split(' ').length
      ) {
        continue;
      }

      let compareCitySubstring = compareCity;
      let idx = -1;
      // check for each char in sequence in string
      for (const char of city) {
        idx = compareCitySubstring.indexOf(char);
        if (idx === -1) break;
        compareCitySubstring = compareCitySubstring.substring(idx);
      }
      // is abbreviation if city is not subsequence of compareCity
      isAbbreviation = idx !== -1;
      break;
    }

    return !isAbbreviation;
  });

  const cityOrCities = (array) => {
    // this can be removed to always return the array, but this makes the diff smaller and more parsable
    return array.length === 1 ? array[0] : array;
  };

  // zip exists in base file, so update cities and county
  if (baseJson[zip]) {
    baseJson[zip].city = cityOrCities(cities);
    baseJson[zip].county = data.county.replace(' County', '');
  }
  // zip does not exist in base file, so seed the entry with the previous seen zip entry and overwrite known fields
  else {
    baseJson[zip] = {
      ...baseJson[prevZip],
      zip,
      city: cityOrCities(cities),
      county: data.county.replace(' County', ''),
    };
  }
  prevZip = zip;
});

// write updated JSON file
const fs = require('fs');
fs.writeFileSync(__dirname + '/zipcodes.json', JSON.stringify(baseJson));
