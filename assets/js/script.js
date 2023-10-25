var apiURL = "https://api.openweathermap.org/data/2.5/forecast?";

var lat = "lat=15";

var lon = "&lon=45";

var apiID = "&appid=2732ac4856a3bf739460f86863c8bac6";

requestURL = apiURL + lat + lon + apiID;

fetch(requestURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
