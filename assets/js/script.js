var apiURL = "https://api.openweathermap.org/data/2.5/forecast?";

var lat = "lat=38.881397";

var lon = "&lon=-94.819130";

var apiID = "&appid=2732ac4856a3bf739460f86863c8bac6&units=imperial&cnt=40";

requestURL = apiURL + lat + lon + apiID;

var testURL =
  "https://api.openweathermap.org/data/2.5/forecast?lat=38.881397lat=38.881397&appid=2732ac4856a3bf739460f86863c8bac6&units=imperial";

var totalDaysInForecast = 5;

fetch(requestURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data.list);
    displayData(data);
  });

function displayData(data) {
  storeData(data);
}

function createCurrentDay() {}

function displayOnPage() {}

function storeData(data) {
  var weatherResults = {
    dayOne: {
      temperature: [],
      windSpeed: [],
      humidity: [],
      weatherType: [],
      currentDay: "",
    },

    dayTwo: {
      temperature: [],
      windSpeed: [],
      humidity: [],
      weatherType: [],
      currentDay: "",
    },

    dayThree: {
      temperature: [],
      windSpeed: [],
      humidity: [],
      weatherType: [],
      currentDay: "",
    },

    dayFour: {
      temperature: [],
      windSpeed: [],
      humidity: [],
      weatherType: [],
      currentDay: "",
    },

    dayFive: {
      temperature: [],
      windSpeed: [],
      humidity: [],
      weatherType: [],
      currentDay: "",
    },
  };

  for (var i = 0; i < totalDaysInForecast; i++) {
    switch (i) {
      case 0:
        var date = data.list[i].dt_txt;
        var day = getDay(data.list[i].dt_txt);
        weatherResults.dayOne.currentDay = dayjs(date).format("MMMM D, YYYY");

        for (var y = 0; y < 8; y++) {
          if (day === getDay(data.list[y].dt_txt)) {
            weatherResults.dayOne.temperature[
              weatherResults.dayOne.temperature.length
            ] = data.list[y].main.temp;
            weatherResults.dayOne.windSpeed[
              weatherResults.dayOne.windSpeed.length
            ] = data.list[y].wind.speed;
            weatherResults.dayOne.humidity[
              weatherResults.dayOne.humidity.length
            ] = data.list[y].main.humidity;
            weatherResults.dayOne.weatherType[
              weatherResults.dayOne.weatherType.length
            ] = data.list[y].weather[0].main;
          }
        }
        break;
      case 1:
        day = getDay(data.list[y].dt_txt);

        for (y; y < 16; y++) {
          if (day === getDay(data.list[y].dt_txt)) {
            weatherResults.dayTwo.temperature[
              weatherResults.dayTwo.temperature.length
            ] = data.list[y].main.temp;
            weatherResults.dayTwo.windSpeed[
              weatherResults.dayTwo.windSpeed.length
            ] = data.list[y].wind.speed;
            weatherResults.dayTwo.humidity[
              weatherResults.dayTwo.humidity.length
            ] = data.list[y].main.humidity;
            weatherResults.dayTwo.weatherType[
              weatherResults.dayTwo.weatherType.length
            ] = data.list[y].weather[0].main;
          }
        }
        break;
      case 2:
        day = getDay(data.list[y].dt_txt);

        for (y; y < 24; y++) {
          if (day === getDay(data.list[y].dt_txt)) {
            weatherResults.dayThree.temperature[
              weatherResults.dayThree.temperature.length
            ] = data.list[y].main.temp;
            weatherResults.dayThree.windSpeed[
              weatherResults.dayThree.windSpeed.length
            ] = data.list[y].wind.speed;
            weatherResults.dayThree.humidity[
              weatherResults.dayThree.humidity.length
            ] = data.list[y].main.humidity;
            weatherResults.dayThree.weatherType[
              weatherResults.dayThree.weatherType.length
            ] = data.list[y].weather[0].main;
          }
        }
        break;
      case 3:
        day = getDay(data.list[y].dt_txt);

        for (y; y < 32; y++) {
          if (day === getDay(data.list[y].dt_txt)) {
            weatherResults.dayFour.temperature[
              weatherResults.dayFour.temperature.length
            ] = data.list[y].main.temp;
            weatherResults.dayFour.windSpeed[
              weatherResults.dayFour.windSpeed.length
            ] = data.list[y].wind.speed;
            weatherResults.dayFour.humidity[
              weatherResults.dayFour.humidity.length
            ] = data.list[y].main.humidity;
            weatherResults.dayFour.weatherType[
              weatherResults.dayFour.weatherType.length
            ] = data.list[y].weather[0].main;
          }
        }
        break;
      case 4:
        day = getDay(data.list[y].dt_txt);

        for (y; y < 40; y++) {
          if (day === getDay(data.list[y].dt_txt)) {
            weatherResults.dayFive.temperature[
              weatherResults.dayFive.temperature.length
            ] = data.list[y].main.temp;
            weatherResults.dayFive.windSpeed[
              weatherResults.dayFive.windSpeed.length
            ] = data.list[y].wind.speed;
            weatherResults.dayFive.humidity[
              weatherResults.dayFive.humidity.length
            ] = data.list[y].main.humidity;
            weatherResults.dayFive.weatherType[
              weatherResults.dayFive.weatherType.length
            ] = data.list[y].weather[0].main;
          }
        }
        console.log(weatherResults);
        break;
    }
  }
}

function getDay(day) {
  day = dayjs(day).format("D");
  return day;
}
