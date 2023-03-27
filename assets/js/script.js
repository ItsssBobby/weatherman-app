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

function displayForecast(forecastData) {
    forecastCards.innerHTML = '';
    forecastData.forEach(day => {
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        const date = document.createElement('h3');
        date.textContent = new Date(day.dt * 1000).toLocaleDateString();

        const icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

        const temp = document.createElement('p');
        temp.textContent = `Temperature: ${day.main.temp} °F`;

        const wind = document.createElement('p');
        wind.textContent = `Wind Speed: ${day.wind.speed} MPH`;

        const hum = document.createElement('p');
        hum.textContent = `Humidity: ${day.main.humidity}%`;

        forecastCard.append(date, icon, temp, wind, hum);
        forecastCards.appendChild(forecastCard);
    });
}

function addToSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Check if the city is already in the search history
    if (searchHistory.includes(city)) {
        return;
    }

    const listItem = document.createElement('li');
    listItem.textContent = city;
    searchHistoryList.appendChild(listItem);

    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function loadSearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.forEach(city => addToSearchHistory(city));
}

loadSearchHistory();