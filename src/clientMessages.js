const axios = require('axios');
const constants = require('../constants');
const { CLIENT, RESPONSE, ZIPCODE, API } = constants;

function response(userMessage) {
  const message = userMessage.toLowerCase();
  let messageResponse;

  if (message === CLIENT.scoops) messageResponse = RESPONSE.scoops;
  else if (message.includes(CLIENT.location)) {
    messageResponse = RESPONSE.location;
  } else if (message.includes(CLIENT.kids)) {
    messageResponse = RESPONSE.kids;
  } else if (message.includes(CLIENT.zipCode)) {
    messageResponse = parseZipCode(message);
  } else {
    messageResponse = RESPONSE.default;
  }

  return messageResponse;
}

function parseZipCode(message) {
  const zipCode = message.replace(/\D/g, '');

  if (!zipCode || zipCode.length > 6) return ZIPCODE.invalid;

  return processIceCreamStores(getIceCreamStores(API), zipCode);
}

function processIceCreamStores(data, zipCode) {
  return data
    .then(response => {
      const stores = response.data;
      const filteredZipCodes = [];

      for (let store of stores) {
        if (store.address.match(zipCode)) filteredZipCodes.push(store);
      }

      const mappedStores = filteredZipCodes.map(store => {
        const { address, name, url } = store;
        const storeLocation = RESPONSE.storeLocation(name, address);
        const visitURL = RESPONSE.url(url);

        return storeLocation;
      });
      return mappedStores.join(',');
    })
    .catch(error => {
      console.log(error);
      return RESPONSE.error;
    });
}

function getIceCreamStores(url) {
  return axios.get(url);
}

module.exports = {
  response,
  processIceCreamStores
};
