(function() {
  // Get handle to the chat div
  const chatWindow = document.querySelector('#messages');

  // Our interface to the Chat service
  let chatClient;

  // A handle to the "general" chat channel - the one and only channel we
  // will have in this sample app
  let generalChannel;

  // The server will assign the client a random username - store that value
  // here
  let username;

  // Helper function to print info messages to the chat window
  function print(infoMessage, asHtml) {
    let msg = document.createElement('div');
    msg.classList.add('info');
    if (asHtml) {
      msg.innerHTML = infoMessage;
    } else {
      msg.textContent = infoMessage;
    }
    chatWindow.appendChild(msg);
  }

  // Helper function to print chat message to the chat window
  function printMessage(fromUser, message) {
    const user = document.createElement('span');
    user.classList.add('username');
    user.textContent = `${fromUser}:`;
    if (fromUser === username) {
      user.classList.add('me');
    }
    const messageElement = document.createElement('span');
    const container = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = message;

    container.classList.add('message-container');

    container.appendChild(user);
    container.appendChild(messageElement);

    chatWindow.appendChild(container);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Alert the user they have been assigned a random username
  print('Logging in...');

  // Get an access token for the current user, passing a username (identity)
  // and a device ID - for browser-based apps, we'll always just use the
  // value "browser"

  fetch('/token')
    .then(response => response.json())
    .then(data => Promise.all([Twilio.Chat.Client.create(data.token), data]))
    .then(data => {
      console.log('Created chat client');
      const [client, identity] = data;
      chatClient = client;
      return Promise.all([chatClient.getSubscribedChannels(), identity]);
    })
    .then(data => {
      createOrJoinGeneralChannel();

      // Alert the user they have been assigned a random username
      username = data[1].identity;

      print(
        'You have been assigned a random username of: ' +
          '<span class="me">' +
          username +
          '</span>',
        true
      );
    })
    .catch(error => {
      console.error(error);
      print('There was an error creating the chat client:<br/>' + error, true);
      print('Please check your .env file.', false);
    });

  function createOrJoinGeneralChannel() {
    // Get the general chat channel, which is where all the messages are
    // sent in this simple application
    print('Attempting to join "general" chat channel...');
    chatClient
      .getChannelByUniqueName('general')
      .then(function(channel) {
        generalChannel = channel;
        console.log('Found general channel:');
        console.log(generalChannel);
        setupChannel();
      })
      .catch(function() {
        // If it doesn't exist, let's create it
        console.log('Creating general channel');
        chatClient
          .createChannel({
            uniqueName: 'general',
            friendlyName: 'General Chat Channel'
          })
          .then(function(channel) {
            console.log('Created general channel:');
            console.log(channel);
            generalChannel = channel;
            setupChannel();
          })
          .catch(function(channel) {
            console.log('Channel could not be created:');
            console.log(channel);
          });
      });
  }

  // Set up channel after it has been found
  function setupChannel() {
    // Join the general channel
    generalChannel.join().then(function(channel) {
      print(
        'Joined channel as ' + '<span class="me">' + username + '</span>.',
        true
      );
    });

    // Listen for new messages sent to the channel
    generalChannel.on('messageAdded', function(message) {
      printMessage(message.author, message.body);
    });
  }

  // Send a new message to the general channel
  let input = document.querySelector('#chat-input');
  input.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
      if (generalChannel === undefined) {
        print(
          'The Chat Service is not configured. Please check your .env file.',
          false
        );
        return;
      }
      generalChannel.sendMessage(input.value);
      input.value = '';
    }
  });
})();
