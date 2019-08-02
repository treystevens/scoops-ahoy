const CLIENT = {
  scoops: 'scoops ahoy',
  location: 'where are you',
  kids: 'what do you think about kids',
  zipCode: 'is there ice cream in'
};

const RESPONSE = {
  scoops: 'Scoops ahoy!',
  location: 'Starcourt mall. Hawkins, Indiana',
  kids: "Turns out I'm a pretty damn good babysitter.",
  default: "Yeah, that's a no.",
  error:
    "Hey, we're having an issue finding stores around that zip code. Try again later.",
  storeLocation: (name, address) => `${name} is located at ${address}`,
  url: url => ` Please visit ${url} for more information.`
};

const ZIPCODE = {
  invalid: 'Please enter a valid zip code.'
};

const API = 'https://project.wnyc.org/ice-cream/data/places.json';

module.exports = {
  CLIENT,
  RESPONSE,
  ZIPCODE,
  API
};
