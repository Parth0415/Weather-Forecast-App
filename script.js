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

const APIKEY = "e35552a8d778748871c9efe011a06edf";

const url = "https://api.openweathermap.org/data/2.5/forecast?lat=&lon=&appid=";

async function getWeather() {
  var searchedValue = searchedCity.value;

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
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchedValue}&appid=${APIKEY}`
    )
  ).json();
  //result.coord.lat
  //result.coord.lon

  var weatherData = await (
    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${result.coord.lat}&lon=${result.coord.lon}&appid=${APIKEY}`
    )
  ).json();

  console.log(weatherData);

  createSearchHistory()

  cityName.textContent = weatherData.city.name;
  cityDate.textContent = weatherData.list[0].dt_txt.split(" ")[0];
  icon.src= "http://openweathermap.org/img/w/" + weatherData.list[0].weather[0].icon + ".png"
  headerTemp.textContent = weatherData.list[0].main.temp + " F"
  headerWind.textContent = weatherData.list[0].wind.speed + " MPH"
  headerHumidity.textContent = weatherData.list[0].main.humidity + " %"
}








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

createSearchHistory();

searchButton.addEventListener("click", getWeather);
searchHistory.addEventListener("click", searchFromHistory);
