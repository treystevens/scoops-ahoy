const Router = require('express').Router;

const { registerBind, sendNotification } = require('./notification_handler');
const tokenGenerator = require('./token_generator');
const config = require('./config');
const client = require('twilio')(
  config.TWILIO_ACCOUNT_SID,
  config.TWILIO_AUTH_TOKEN
);

const router = new Router();
const clientMessages = require('./clientMessages');

// Convert keys to camelCase to conform with the twilio-node api definition contract
const camelCase = require('camelcase');
function camelCaseKeys(hashmap) {
  var newhashmap = {};
  Object.keys(hashmap).forEach(function(key) {
    var newkey = camelCase(key);
    newhashmap[newkey] = hashmap[key];
  });
  return newhashmap;
}

router.get('/token/:id?', (req, res) => {
  const id = req.params.id;
  res.send(tokenGenerator(id));
});

router.post('/token', (req, res) => {
  const id = req.body.id;
  res.send(tokenGenerator(id));
});

router.post('/register', (req, res) => {
  var content = camelCaseKeys(req.body);
  registerBind(content).then(data => {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(data.status);
    res.send(data.data);
  });
});

router.post('/send-notification', (req, res) => {
  var content = camelCaseKeys(req.body);
  sendNotification(content).then(data => {
    res.status(data.status);
    res.send(data.data);
  });
});

router.get('/config', (req, res) => {
  res.json(config);
});

//Create a facebook-messenger binding based on the authentication webhook from Facebook
router.post('/messenger_auth', function(req, res) {
  //Extract the request received from Facebook
  const message = req.body.entry[0].messaging[0];
  // Set user identity using their fb messenger user id
  const identity = message.sender.id;
  //Let's create a new facebook-messenger Binding for our user
  const binding = {
    identity: identity,
    BindingType: 'facebook-messenger',
    Address: message.sender.id
  };
  registerBind(camelCaseKeys(binding)).then(data => {
    res.status(data.status);
    res.send(data.data);
  });
});

//Verification endpoint for Facebook needed to register a webhook.
router.get('/messenger_auth', function(req, res) {
  res.send(req.query['hub.challenge']);
});

router.post('/chat', async (req, res) => {
  const { ChannelSid, Body: clientMessage } = req.body;
  const response = await clientMessages.response(clientMessage);

  client.chat
    .services(config.TWILIO_CHAT_SERVICE_SID)
    .channels(ChannelSid)
    .messages.create({ from: 'Scoopy Beam', body: response })
    .then(message => console.log(message.sid))
    .catch(error => console.log(error));
});

module.exports = router;
