// index.js
const {nextISSTimesForMyLocation} = require('./iss');

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    // initializes a date to 'unix epoch' - Jan 1, 1970
    const datetime = new Date(0);
    // sets the date to the time elapsed since unix epoch (pass.risetime)
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

// callback is executed at any point that error occurs
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("error:", error);
  }

  printPassTimes(passTimes);
});

/* OLD CODE, KEPT FOR STUDYING PURPOSES
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);

  // call fetchCoordsByIP with the obtained IP address
  fetchCoordsByIP(ip, (error, coordinates) => {
    if (error) {
      console.log("Fetching coordinates didn't work!", error);
      return;
    }

    console.log('It worked! Returned coordinates:', coordinates);

    // call fetchISSFlyOverTimes with the coordinates
    fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
    
      console.log('It worked! Returned flyover times:' , passTimes);
    });
  });
});
*/ 