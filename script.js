// getting all the elements from the index.html with the help of ID
let searchedCity = document.getElementById("searchedCity");

let searchButton = document.getElementById("searchButton");

let cityName = document.getElementById("cityName");

let cityDate = document.getElementById("cityDate");

let icon = document.getElementById("icon");

let headerTemp = document.getElementById("headerTemp");

let headerWind = document.getElementById("headerWind");

let headerHumidity = document.getElementById("headerHumidity");

let cardTemp = document.getElementById("cardTemp");

let cardWind = document.getElementById("cardWind");

let cardHumidity = document.getElementById("cardHumidity");

let searchHistory = document.getElementById("searchHistory");

let cardContainer = document.getElementById("cardContainer");
// Api key
const APIKEY = "e35552a8d778748871c9efe011a06edf";
//url for the 5 Day weather forecast from open weather api
const url = "https://api.openweathermap.org/data/2.5/forecast?lat=&lon=&appid=";

async function getWeather() {
  var searchedValue = searchedCity.value;
// Storing the searched value(cities) in local stortage
  if (localStorage.getItem("searchedCities") == null) {
    localStorage.setItem("searchedCities", searchedValue);
  } else {
    if (localStorage.getItem("searchedCities").indexOf(searchedValue) == -1) {
      localStorage.setItem(
        "searchedCities",
        localStorage.getItem("searchedCities") + "," + searchedValue
      );
    }
  }

  var result = await (
    // fetching the data for the city with the help of API call
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchedValue}&appid=${APIKEY}`
    )
  ).json();
  //result.coord.lat
  //result.coord.lon

  var weatherData = await (
    //fetching the lat and long for the city with the help of API call
    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${result.coord.lat}&lon=${result.coord.lon}&appid=${APIKEY}`
    )
  ).json();

  console.log(weatherData);

  createSearchHistory();

  cityName.textContent = weatherData.city.name;
  cityDate.textContent = "(" + weatherData.list[0].dt_txt.split(" ")[0] + ")";
  // getting the icon for weather from the API documentation
  icon.src =
    "http://openweathermap.org/img/w/" +
    weatherData.list[0].weather[0].icon +
    ".png";
  headerTemp.textContent = weatherData.list[0].main.temp + " F";
  headerWind.textContent = weatherData.list[0].wind.speed + " MPH";
  headerHumidity.textContent = weatherData.list[0].main.humidity + " %";

  cardContainer.innerHTML = "";
// created while loop for displaying 5 day forecast of the city
  var i = 1;
  while (i < 6) {
    var weatherCard = createWeatherCard(
      weatherData.list[i].dt_txt.split(" ")[0],
      "http://openweathermap.org/img/w/" +
        weatherData.list[i].weather[0].icon +
        ".png",
      weatherData.list[i].main.temp,
      weatherData.list[i].wind.speed,
      weatherData.list[i].main.humidity
    );

    cardContainer.appendChild(weatherCard);
    i++;
  }
}
// creating 5 day forecast card
function createWeatherCard(date, icon, tempData, windData, humidityData) {
  var card = document.createElement("div");
  card.className = "card";

  var cardDate = document.createElement("h3");
  cardDate.className = "cardDate";
  cardDate.textContent = date;

  var image = document.createElement("img");
  image.alt = "icon";
  image.src = icon;

  var temp = document.createElement("p");
  temp.textContent = "Temp: " + tempData + " F";

  var wind = document.createElement("p");
  wind.textContent = "Wind: " + windData + " MPH";

  var humidity = document.createElement("p");
  humidity.textContent = "Humidity: " + humidityData + " %";
//appending the element to the page
  card.appendChild(cardDate);
  card.appendChild(image);
  card.appendChild(temp);
  card.appendChild(wind);
  card.appendChild(humidity);

  return card;
}
// creating previous searched city as an button so that by clicking the sewrched city again it will display the weather
function createSearchHistory() {
  searchHistory.innerHTML = "";
  localStorage
    .getItem("searchedCities")
    .split(",")
    .forEach((element) => {
      var cities = document.createElement("button");
      cities.textContent = element;
      cities.className = "cities";
      searchHistory.appendChild(cities);
    });
}

function searchFromHistory(event) {
  var value = event.target.textContent;
  searchedCity.value = value;

  getWeather();
}

if (localStorage.getItem("searchedCities") != null) {
  createSearchHistory();
}

searchButton.addEventListener("click", getWeather);
searchHistory.addEventListener("click", searchFromHistory);
