// The current api only provides 5 days of data but if it were to change you can fix it here
var totalDaysInForecast = 5;

// This checks to see if the city they put in the search box actually returns coordinates and is changes accordingly
var validCoordinates = false;

// This loads all the previously searched cities below the search box
window.onload = storeSearchInputs();

// This checks for a click on the submit button or if you press enter after typing into the search box
$("#search-input-box").on("submit", function (event) {
  // Keeps the text in the search box
  event.preventDefault();

  // This calls a function to start retrieving the data
  startSearch();
});

function startSearch() {
  // Takes the value from the search box
  var userInputCity = $("#search-input-text").val();

  // Empty array to store the coordinate values
  var latAndLon = [""];
  // Using a function to set the values using the geo api
  latAndLon = getCoordinates(userInputCity);

  // Waiting to use the data values because the api needs to be called and store the values
  setTimeout(() => {
    // Running all of the function to display the data on the page if the coordinates were valid
    if (validCoordinates) {
      storeSearchInputs(userInputCity);
      currentDayWeather(latAndLon);
      displayForecast(latAndLon);
      $("#results-container").removeClass("d-none");
    }
  }, 1000);
}

// Click listener to do the same thing as the search form but just by clicking the box of your recently searched city
$("#recent-search-container").on("click", function (event) {
  if (event.target.matches(".clickable")) {
    var text = event.target;

    userInputCity = text.textContent;

    var latAndLon = [""];
    latAndLon = getCoordinates(userInputCity);

    setTimeout(() => {
      if (validCoordinates) {
        currentDayWeather(latAndLon);
        displayForecast(latAndLon);
        $("#results-container").removeClass("d-none");
      }
    }, 1000);
  }
});

// Stores the cities into local storage so they can stay on page reload
function storeSearchInputs(cityName) {
  var allSearches = JSON.parse(localStorage.getItem("cities"));
  if (!allSearches) {
    allSearches = [];
  }
  for (var i = 0; i < allSearches.length; i++) {
    if (allSearches[i] == cityName) {
      allSearches = allSearches.filter(function (name) {
        return name !== allSearches[i];
      });
    }
  }

  // Making sure the city is actually passed through (on page load there isn't anything passed through)
  if (cityName != undefined) {
    allSearches.push(cityName);
  }

  // Takes the first item out of the array if it is greater than 8 so the list does not get super long
  if (allSearches.length > 8) {
    allSearches.shift();
  }

  //Setting the array to cities in local storage
  localStorage.setItem("cities", JSON.stringify(allSearches));

  // removing all the previous buttons before adding the new ones so they do not duplicate
  document
    .querySelectorAll("#recent-search-container div")
    .forEach((el) => el.remove());

  // creates new buttons that all link to their corresponding city
  for (var i = 0; i < allSearches.length; i++) {
    var divEl = document.createElement("div");
    $(divEl).addClass("col-6 col-sm-12");
    var buttonEl = document.createElement("a");
    $(buttonEl).addClass("btn btn-secondary d-block my-1 clickable");
    $(buttonEl).text(allSearches[i]);
    $(divEl).append($(buttonEl));
    $("#recent-search-container").append($(divEl));
  }
}

// returns the coordinates of the city name that is passed through
function getCoordinates(city) {
  // Checks if something was actually passed through
  if (city === "") {
    console.log("Please enter a valid city name.");
    validCoordinates = false;
    return;
  }

  var geocodeURL = "https://api.openweathermap.org/geo/1.0/direct?q=";

  var geocodeID = "&limit=1&appid=2732ac4856a3bf739460f86863c8bac6";

  var coordinates = [];

  geocodeURL += city + geocodeID;

  // getting the data from the api and then storing the coordinates before returning them
  fetch(geocodeURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // If text was passed but it wasn't a real city
      if (data.cod == 400 || data.length == 0) {
        console.log("Invalid City Name");
        validCoordinates = false;
        return;
      } else {
        coordinates[0] = data[0].lat;
        coordinates[1] = data[0].lon;
        validCoordinates = true;
      }
    });
  return coordinates;
}

// Using the current weather api to display the current weather
function currentDayWeather(coordinatesArray) {
  var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?";
  var lat = "lat=" + coordinatesArray[0];
  var lon = "&lon=" + coordinatesArray[1];
  var ID = "&appid=2732ac4856a3bf739460f86863c8bac6&units=imperial";

  // Adding the string together to fit the criteria for the api using the users input
  currentWeatherURL += lat + lon + ID;

  // using the fetch to get a response from the api
  fetch(currentWeatherURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // using j-query to set the text for all the according boxes
      $("#current-date").text(data.name + " " + dayjs().format("MM/DD/YYYY"));
      $("#current-img").attr(
        "src",
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      );
      $("#current-temp").text("Temp: " + data.main.temp + "°F");
      $("#current-wind").text("Wind: " + data.wind.speed + "MPH");
      $("#current-humidity").text("Humidity: " + data.main.humidity + "%");
    });
}

// This function does basically the same thing as the current weather but it gives 5 days worth of information at 3 hour intervals
// Currently the data displaying is just the last interval for that day but later it would be a good idea to instead make it the average of the entire day
function displayForecast(coordinatesArray) {
  var apiURL = "https://api.openweathermap.org/data/2.5/forecast?";
  var lat = "lat=" + coordinatesArray[0];
  var lon = "&lon=" + coordinatesArray[1];
  var apiID = "&appid=2732ac4856a3bf739460f86863c8bac6&units=imperial&cnt=40";

  forecastURL = apiURL + lat + lon + apiID;

  fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Getting the current date stored into the variable
      var currentDate = dayjs();
      // Using a for loop and switch statement to set each box to the correct value
      for (var i = 0; i < totalDaysInForecast; i++) {
        switch (i) {
          case 0:
            var date = data.list[i].dt_txt;
            // The day variable takes the current day and adds 1 to it so it will skip over any data that is for the current day and goes onto the next day forecast
            var day = currentDate.add(1, "day");
            // Setting the day on the header of the forecast boxes
            $("#day-one-date").text(dayjs(day).format("MMMM D, YYYY"));
            // Setting the day variable to be just the day number so it can check with the data provided to see if they match days.
            day = dayjs(day).format("D");

            for (var y = 0; y < 8; y++) {
              if (day === getDay(data.list[y].dt_txt)) {
                $("#day-one-temp").text(
                  "Temp: " + data.list[y].main.temp + "°F"
                );
                $("#day-one-wind").text(
                  "Wind: " + data.list[y].wind.speed + "MPH"
                );
                $("#day-one-humidity").text(
                  "Humidity: " + data.list[y].main.humidity + "%"
                );
                $("#day-one-picture").attr(
                  "src",
                  "https://openweathermap.org/img/wn/" +
                    data.list[y].weather[0].icon +
                    "@2x.png"
                );
              }
            }
            break;
          case 1:
            // Each of the cases do the same thing but they just are moved to affect the next day boxes instead of the previous ones
            day = currentDate.add(2, "day");
            $("#day-two-date").text(dayjs(day).format("MMMM D, YYYY"));
            day = dayjs(day).format("D");

            for (y; y < 16; y++) {
              if (day === getDay(data.list[y].dt_txt)) {
                $("#day-two-temp").text(
                  "Temp: " + data.list[y].main.temp + "°F"
                );
                $("#day-two-wind").text(
                  "Wind: " + data.list[y].wind.speed + "MPH"
                );
                $("#day-two-humidity").text(
                  "Humidity: " + data.list[y].main.humidity + "%"
                );
                $("#day-two-picture").attr(
                  "src",
                  "https://openweathermap.org/img/wn/" +
                    data.list[y].weather[0].icon +
                    "@2x.png"
                );
              }
            }
            break;
          case 2:
            day = currentDate.add(3, "day");
            date = data.list[i].dt_txt;
            $("#day-three-date").text(dayjs(day).format("MMMM D, YYYY"));
            day = dayjs(day).format("D");

            for (y; y < 24; y++) {
              if (day === getDay(data.list[y].dt_txt)) {
                $("#day-three-temp").text(
                  "Temp: " + data.list[y].main.temp + "°F"
                );
                $("#day-three-wind").text(
                  "Wind: " + data.list[y].wind.speed + "MPH"
                );
                $("#day-three-humidity").text(
                  "Humidity: " + data.list[y].main.humidity + "%"
                );
                $("#day-three-picture").attr(
                  "src",
                  "https://openweathermap.org/img/wn/" +
                    data.list[y].weather[0].icon +
                    "@2x.png"
                );
              }
            }
            break;
          case 3:
            day = currentDate.add(4, "day");
            $("#day-four-date").text(dayjs(day).format("MMMM D, YYYY"));
            day = dayjs(day).format("D");

            for (y; y < 32; y++) {
              if (day === getDay(data.list[y].dt_txt)) {
                $("#day-four-temp").text(
                  "Temp: " + data.list[y].main.temp + "°F"
                );
                $("#day-four-wind").text(
                  "Wind: " + data.list[y].wind.speed + "MPH"
                );
                $("#day-four-humidity").text(
                  "Humidity: " + data.list[y].main.humidity + "%"
                );
                $("#day-four-picture").attr(
                  "src",
                  "https://openweathermap.org/img/wn/" +
                    data.list[y].weather[0].icon +
                    "@2x.png"
                );
              }
            }
            break;
          case 4:
            day = currentDate.add(5, "day");
            $("#day-five-date").text(dayjs(day).format("MMMM D, YYYY"));
            day = dayjs(day).format("D");

            for (y; y < 40; y++) {
              if (day === getDay(data.list[y].dt_txt)) {
                $("#day-five-temp").text(
                  "Temp: " + data.list[y].main.temp + "°F"
                );
                $("#day-five-wind").text(
                  "Wind: " + data.list[y].wind.speed + "MPH"
                );
                $("#day-five-humidity").text(
                  "Humidity: " + data.list[y].main.humidity + "%"
                );
                $("#day-five-picture").attr(
                  "src",
                  "https://openweathermap.org/img/wn/" +
                    data.list[y].weather[0].icon +
                    "@2x.png"
                );
              }
            }
            break;
        }
      }
    });
}

// Sets whatever date is passed through to just be the day
function getDay(day) {
  day = dayjs(day).format("D");
  return day;
}
