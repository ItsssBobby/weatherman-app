const apiKey = 'e9f65d00ed4061a7445156bd36b65b44';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistoryList = document.getElementById('search-history-list');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastCards = document.getElementById('forecast-cards');

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchCity(cityInput.value);
    }
});

searchBtn.addEventListener('click', () => {
    searchCity(cityInput.value);
});

searchHistoryList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        searchCity(e.target.textContent);
    }
});

function searchCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            cityName.textContent = `${data.name} (${new Date().toLocaleDateString()})`;
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            temperature.textContent = `Temperature: ${data.main.temp} °F`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;

            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
        })
        .then(response => response.json())
        .then(data => {
            displayForecast(data.list.filter((_, index) => index % 8 === 0));
            addToSearchHistory(city);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}