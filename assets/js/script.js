//Global Variables to grab for easy access later
var inputEl = document.querySelector("input[name=city");
var submitBtn = document.querySelector("#searchbtn");
var priorSearches = document.querySelector("#prior-searches");
var mainEl = document.querySelector("#main-card");
var forecast = document.querySelector("#forecast");
var formEl = document.querySelector("form");
var cityButtons = [];
var openWeatherApiKey = "d91f911bcf2c0f925fb6535547a5ddc9";

function searchAndGenerateWeather(city) {
    mainEl.innerHTML = "";
    forecast.innerHTML = "";

    var geoLocateCityURL =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        ",US&limit=5&appid=" +
        openWeatherApiKey;

    fetch(geoLocateCityURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var cityInfo = data[0];
            var getWeatherUrl =
                "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                cityInfo.lat +
                "&lon=" +
                cityInfo.lon +
                "&exclude=minutely,hourly&units=imperial&appid=" +
                openWeatherApiKey;

            //Fetching the Openweather API to generate the weather data
            fetch(getWeatherUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (weatherData) {
                    var cityNameEl = document.createElement("h3");
                    cityNameEl.textContent = city.toUpperCase() + " " + moment.unix(weatherData.current.sunrise).format("MM/DD/YYYY");
                    var mainWeatherIcon = document.createElement("img");
                    mainWeatherIcon.setAttribute(
                        "src",
                        "https://openweathermap.org/img/w/" +
                        weatherData.current.weather[0].icon +
                        ".png"
                    );
                    cityNameEl.append(mainWeatherIcon);

                    mainEl.append(cityNameEl);

                    var cityWeatherList = document.createElement("ul");
                    var uviInfo = weatherData.current.uvi
                    
                    //Items that will appear on the weather card
                    var temp = document.createElement("li");
                    temp.textContent = "Temperature: " + weatherData.current.temp + " F";
                    cityWeatherList.append(temp);

                    var wind = document.createElement("li");
                    wind.textContent = "Wind Speed: " + weatherData.current.wind_speed + " mph";
                    cityWeatherList.append(wind);

                    var humidity = document.createElement("li");
                    humidity.textContent = "Humidity: " + weatherData.current.humidity + "%";
                    cityWeatherList.append(humidity);

                    var uvi = document.createElement("li");
                    uvi.textContent = "UV Index: " + uviInfo;

                    if(uviInfo <3){
                      uvi.classList.add('green')
                    }else if (uviInfo <7){
                      uvi.classList.add('yellow')
                    }else{
                      uvi.classList.add('red')
                    }
                    cityWeatherList.append(uvi);

                    mainEl.append(cityWeatherList);

                    // Forecast Section
                    var forecastTitle = document.createElement("h3");
                    forecastTitle.textContent = "5-Day Forecast";
                    forecast.append(forecastTitle);

                    for (var i = 0; i < 5; i++) {
                        var dailyWeather = weatherData.daily[i];
                        var container = document.createElement('div');
                        var dailyWeatherCard = document.createElement("div");
                        dailyWeatherCard.setAttribute("class", "card h-100  p-2 forecastCard")
                        var date = moment.unix(dailyWeather.sunrise).format("MM/DD/YYYY");

                        dailyWeatherCard.append(date);

                        var weatherIcon = document.createElement("img");
                        weatherIcon.setAttribute(
                            "src",
                            "https://openweathermap.org/img/w/" +
                            dailyWeather.weather[0].icon +
                            ".png"
                        );
                        weatherIcon.setAttribute(
                          "class",
                          "forecastImg"
                      );
                      
                        //Write all of the data to the screen
                        dailyWeatherCard.append(weatherIcon);
            
                        var temp = document.createElement("p");
                        temp.textContent = "Temperature: " + dailyWeather.temp.day + " F";
                        dailyWeatherCard.append(temp);

                        var wind = document.createElement("p");
                        wind.textContent = "Wind Speed: " + dailyWeather.wind_speed + " mph";
                        dailyWeatherCard.append(wind);

                        var humidity = document.createElement("p");
                        humidity.textContent = "Humidity: " + dailyWeather.humidity + "%";
                        dailyWeatherCard.append(humidity);
                        container.setAttribute('class', 'col-md')

                        container.append(dailyWeatherCard)

                        forecast.append(container);
                    }
                });
        });
}

//Event Listener for the search form
formEl.addEventListener("click", function (e) {
    e.preventDefault();
    var searchValue = inputEl.value.trim();

    if (!searchValue) {
        return;
    }
    if (!cityButtons.includes(searchValue)){
        cityButtons.unshift(searchValue);
        cityButtons = cityButtons.slice(0,5);
    }
    
    searchAndGenerateWeather(searchValue);
    makeResultsButtons()
});

function initialLoad() {
    var priorSearchesButtons = localStorage.getItem("previousCities");
    if (priorSearchesButtons) {
        cityButtons = JSON.parse(priorSearchesButtons);
        makeResultsButtons();
    }
}

function makeResultsButtons() {
    priorSearches.innerHTML = "";
    for (var i = 0; i < cityButtons.length; i++) {
        const city = cityButtons[i];
        var newBtn = document.createElement("button");

        newBtn.textContent = city;
        newBtn.setAttribute("data-value", city);

        newBtn.addEventListener("click", function () {
            var searchCity = this.getAttribute("data-value");
            searchAndGenerateWeather(searchCity);
        });
        priorSearches.append(newBtn);
    }

    localStorage.setItem("priorSearches", JSON.stringify(cityButtons));
}

initialLoad()