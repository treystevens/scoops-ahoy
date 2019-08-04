const clientMessages = require('../src/clientMessages');
const mockIceCreamData = require('../mockIceCreamData');
const constants = require('../constants');
const { RESPONSE, ZIPCODE } = constants;

test('Should return "Scoops Ahoy!" when given "Scoops Ahoy"', () => {
  const expected = clientMessages.response('Scoops Ahoy');
  const expected2 = clientMessages.response('scoops ahoy');
  const result = RESPONSE.scoops;

  expect(expected).toEqual(result);
  expect(expected2).toEqual(result);
});

test('Should return "Starcourt mall. Hawkins, Indiana" when asked asked for location', () => {
  const expected = clientMessages.response('Where are you located?');
  const expected2 = clientMessages.response('Where are you found?');
  const result = RESPONSE.location;

  expect(expected).toEqual(result);
  expect(expected2).toEqual(result);
});

test('Should return that we are a good babysitter when asked asked about kids', () => {
  const expected = clientMessages.response('What do you think about kids?');
  const result = RESPONSE.kids;

  expect(expected).toEqual(result);
});

test('Should return "Yeah, that\'s a no." when given invalid input', () => {
  const expected = clientMessages.response("Dude, where's my car?");
  const result = RESPONSE.default;

  expect(expected).toEqual(result);
});

test('Should return invalid zip code message when given invalid zip', () => {
  const expected = clientMessages.response('Is there Ice Cream in');
  const expected2 = clientMessages.response('Is there Ice Cream in 1293812');
  const result = ZIPCODE.invalid;

  expect(expected).toEqual(result);
  expect(expected2).toEqual(result);
});

test('Should return nothing when given valid NYC zip code, but no store locations are found', async () => {
  const expected = promisify(mockIceCreamData);
  const zipCode = '80808';
  const result = '';
  function promisify() {
    return new Promise((resolve, reject) => {
      resolve(mockIceCreamData);
    });
  }

  await expect(
    clientMessages.processIceCreamStores(expected, zipCode)
  ).resolves.toBe(result);
});

test('Should return store location when given proper zip code', async () => {
  const expected = promisify(mockIceCreamData);
  const result =
    "127 Junior's Cheesecake/Blue Marble Ice Cream is located at Barclays Center, Brooklyn, NY 11217";
  function promisify() {
    return new Promise((resolve, reject) => {
      resolve(mockIceCreamData);
    });
  }

  await expect(
    clientMessages.processIceCreamStores(expected, '11217')
  ).resolves.toBe(result);
});
