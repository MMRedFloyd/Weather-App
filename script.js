// Weather container
const city = document.querySelector(".city");
const grades = document.querySelector(".grades");
const image = document.querySelector(".image");
const weatherContainer = document.querySelector(".weather");
const errorMsg = document.querySelector(".error-msg");

// Forecast
const dates = Array.from(document.querySelectorAll(".forecast-date"));
const icons = document.querySelectorAll(".forecast-icon");
const fGrade = document.querySelectorAll(".forecast-grades");

// Form
const form = document.querySelector(".input-fields");
const inputText = document.querySelector(".input-text");
const inputBtn = document.querySelector(".input-btn");
const addNewCity = document.querySelector(".add-new-city");
const container = document.querySelector(".weather");

// API Options
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "f8730af747mshe7be8505608f9b7p107917jsn6cf5a4a46437",
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
  },
};

//////////////////////////////////////////////
// Functions

function generateNewWeather() {
  function succes(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    const API = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${lat}%2C${lon}&days=3`;

    fetch(API, options)
      .then((res) => res.json())
      .then(gettingInfo)
      .catch((err) => console.error(err));
  }

  function error() {
    weatherContainer.classList.add("hide");
    errorMsg.classList.remove("hide");
  }

  navigator.geolocation.getCurrentPosition(succes, error);
}

function gettingInfo(data) {
  const cityNew = data.location.name;
  const tempNew = data.current.temp_c;
  const iconNew = data.current.condition.icon;

  const forecast = data.forecast.forecastday;

  city.textContent = cityNew;
  grades.textContent = tempNew;
  image.src = iconNew;

  const formattedDates = forecast.map((day) =>
    new Date(day.date).toLocaleDateString("en-GB").split("/").join(".")
  );

  dates.forEach((date, i) => (date.textContent = formattedDates[i]));

  icons.forEach((img, i) => (img.src = forecast[i].day.condition.icon));

  fGrade.forEach(
    (grade, i) => (grade.textContent = Math.round(forecast[i].day.maxtemp_c))
  );
}

const renderCity = function (newData) {
  const cityNew = newData.location.name;
  const tempNew = newData.current.temp_c;
  const iconNew = newData.current.condition.icon;

  // const {location: {name: cityNew}, current: {temp_c: tempNew, condition: {icon: iconNew}}} = newData;

  const forecast = newData.forecast.forecastday;

  const formattedDates = forecast.map((day) =>
    new Date(day.date).toLocaleDateString("en-GB").split("/").join(".")
  );

  const forecastPath = newData.forecast.forecastday;

  let html = `
  <div class="weather">
      <div class="first-flex">
        <h1 class="city">${cityNew}</h1>
        <h1 class="temperature"><span class="grades">${tempNew}</span>&#176;C</h1>
        <img class="image" src="${iconNew}" alt="icon" />
      </div>

      <div class="second-flex">
        <div class="forecast">
          <h3 class="forecast-date">${formattedDates[0]}</h3>
          <img class="forecast-icon" src="${
            forecastPath[0].day.condition.icon
          }" alt="icon-forecast" />
          <h3 class="forecast-temperature">
            <span class="forecast-grades">${Math.round(
              forecast[0].day.maxtemp_c
            )}</span>&#176;C
          </h3>
        </div>

        <div class="forecast borderlr">
          <h3 class="forecast-date">${formattedDates[1]}</h3>
          <img class="forecast-icon" src="${
            forecastPath[1].day.condition.icon
          }" alt="icon-forecast" />
          <h3 class="forecast-temperature">
            <span class="forecast-grades">${Math.round(
              forecast[1].day.maxtemp_c
            )}</span>&#176;C
          </h3>
        </div>

        <div class="forecast">
          <h3 class="forecast-date">${formattedDates[2]}</h3>
          <img class="forecast-icon" src="${
            forecastPath[2].day.condition.icon
          }" alt="icon-forecast" />
          <h3 class="forecast-temperature">
            <span class="forecast-grades">${Math.round(
              forecast[2].day.maxtemp_c
            )}</span>&#176;C
          </h3>
        </div>
      </div>
    </div>
`;

  container.insertAdjacentHTML("afterend", html);

  inputText.value = "";
};

function addCityToStorage(newData) {
  let existingData = JSON.parse(localStorage.getItem("allData")) || [];
  existingData.push(newData);
  localStorage.setItem("allData", JSON.stringify(existingData));
}

function init() {
  generateNewWeather();
  let allData = JSON.parse(localStorage.getItem("allData")) || [];

  allData.forEach((newData) => {
    renderCity(newData);
  });
}
init();

//////////////////////////////////////////////
// Event listeners

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let inputValue = inputText.value;

  let newCity = inputValue;

  const API = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${newCity}&days=3`;

  fetch(API, options)
    .then((res) => res.json())
    .then((data) => {
      weatherContainer.classList.remove("hide");
      errorMsg.classList.add("hide");
      gettingInfo(data);
      inputText.value = "";
    })
    .catch((err) => console.error(err));
});

addNewCity.addEventListener("click", function () {
  let inputNewValue = inputText.value;

  let addedCity = inputNewValue;

  const API = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${addedCity}&days=3`;

  fetch(API, options)
    .then((res) => res.json())
    .then((newData) => {
      renderCity(newData);
      addCityToStorage(newData);
    })
    .catch((err) => console.error(err));
});
