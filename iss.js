// iss.js
const request = require('request');

const fetchMyIP = function(callback) {
  // fetch IP address as JSON
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      // pass error to callback
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      // pass custom error to callback
      callback(new Error(msg), null);
    } else {
      // parse the JSON response
      const ip = JSON.parse(body).ip;
      // pass the IP address through to the callback
      callback(null, ip);
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);
    // console.log("parsedBody:  ", parsedBody);
    // checks to see if the success property is falsey
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    } 

    // destructures the latitude and longitude from the parsedBody, creating two new vars
    const { latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude});
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    // console.log("body:  ", body);  
    // console.log(typeof body);  returns string, so it needs to be parsed.
    // body.response is a specific part of body, not the response
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

// calls these functions together. Note - the 'callback' listed here is the callback from index.js, which essentially prints 'error:" or "success:"
const nextISSTimesForMyLocation = function(callback) {
  // callback in this code is error processing from index.js
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };
