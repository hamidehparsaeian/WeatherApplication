function showCurrentTime() {
  let date = new Date();
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = days[date.getDay()];
  let day = date.getDate();
  let currentDate = document.querySelector("#date-time");
  currentDate.innerHTML = `${weekday} ${day} ${month} ${hour}:${minute}`;
}

function submitCity(event) {
  event.preventDefault();
  let cityField = document.querySelector(".city-field");
  search(cityField.value);
}

function search(city) {
  let apiKey = "d3a3d971f59f605923c01f618f48e278";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function showTemperature(response) {
  showCurrentTime();
  let cityEl = document.querySelector("#city-name");
  let temperatureEl = document.querySelector("#temp");
  let windEl = document.querySelector("#wind");
  let humidityEl = document.querySelector("#humidity");
  let descriptionEl = document.querySelector("#description");
  let iconEl = document.querySelector("#icon");
  cityEl.innerHTML = response.data.name;
  temperatureEl.innerHTML = `${Math.round(response.data.main.temp)}`;
  windEl.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  humidityEl.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  descriptionEl.innerHTML = response.data.weather[0].description;
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconEl.setAttribute("alt", response.data.weather[0].description);
  celsiusTemperature = response.data.main.temp;
  getForecast(response.data.coord);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "d3a3d971f59f605923c01f618f48e278";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(findCurrentCity);
}

function findCurrentCity(response) {
  let city = response.data.name;
  search(city);
}

function showFahrenheit(event) {
  event.preventDefault();
  let tempEl = document.querySelector("#temp");
  let fahrenheitTemperature = Math.round(celsiusTemperature * 1.8 + 32);
  tempEl.innerHTML = fahrenheitTemperature;
  celsiusEl.classList.remove("active");
  fahrenheitEL.classList.add("active");
}

function showCelsius(event) {
  event.preventDefault();
  let tempEl = document.querySelector("#temp");
  tempEl.innerHTML = Math.round(celsiusTemperature);
  celsiusEl.classList.add("active");
  fahrenheitEL.classList.remove("active");
}

function formatDay(timestemp) {
  let date = new Date(timestemp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function showForecast(response) {
  let forecastEl = document.querySelector("#forecast");
  let forecastDay = [
    response.data.list[8],
    response.data.list[16],
    response.data.list[24],
    response.data.list[32],
  ];
  let forecastHTML = `<div class=row>`;
  forecastDay.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col" style="margin-left:120px">
        <div class="forecastDate">${formatDay(day.dt)}</div>
        <img src="https://openweathermap.org/img/wn/${
          day.weather[0].icon
        }@2x.png" width="40"/>
        <div class="forecastTemp">
          <p class="high-temp">${Math.round(day.main.temp_max)}°C</p>
          <p class="low-temp">${Math.round(day.main.temp_min)}°C</p>
        </div>
      </div>`;
  });

  forecastEl.innerHTML = forecastHTML;
}

function getForecast(coord) {
  let apiKey = "6d68aadfacdd4f5163bc273049a0cf2d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

search("tehran");

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitCity);
let currentLocBtn = document.querySelector("#current-loc-btn");
currentLocBtn.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

let fahrenheitEL = document.querySelector("#fahrenheit-link");
fahrenheitEL.addEventListener("click", showFahrenheit);

let celsiusEl = document.querySelector("#celsius-link");
celsiusEl.addEventListener("click", showCelsius);
