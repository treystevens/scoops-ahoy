[![Build Status](https://travis-ci.com/treykris/scoops-ahoy.svg?branch=master)](https://travis-ci.com/treykris/scoops-ahoy)


# Scoops Ahoy

## Introduction

Scoops Ahoy is a chat bot built using the Twilio's programmable chat API.

## Installation & Usage

### Required
- [NodeJS](https://reactjs.org/)
- [Twilio Account](https://www.twilio.com/)
- [ngrok](https://ngrok.com/)

**You must have Node.js installed to run this application.**

### Getting Started

Clone, fork, or [download](https://github.com/treykris/scoops-ahoy/archive/master.zip) the repository.

To clone the repository and get started enter the following commands into your command line:

```
git clone https://github.com/treykris/scoops-ahoy.git
cd scoops-ahoy
npm install
npm run start
```

Visit `localhost:3000`

In another terminal window run:
```
ngrok http 3000
```
This will handle the requests to the Twilio end points on your server locally.
