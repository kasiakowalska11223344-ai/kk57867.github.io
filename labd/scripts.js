function getCurrentWeather(city) {
    const apiKey = '543f4941fbb98a2a852174c1d6ea5e19';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
        } else {
            console.error('Błąd pobierania bieżącej pogody');
        }
    };

    xhr.onerror = function() {
        console.error('Błąd sieciowy');
    };

    xhr.send();
}

async function getWeatherData(city) {
    const apiKey = '543f4941fbb98a2a852174c1d6ea5e19';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === '200') {
            return data;
        } else {
            throw new Error('Nie znaleziono danych');
        }
    } catch (error) {
        console.error('Błąd pobierania prognozy 5-dniowej:', error);
    }
}

function generateTableRows(data) {
    const tableBody = document.getElementById("weather-table-body");

    tableBody.innerHTML = '';

    const forecasts = data.list.slice(0, 9);

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        const row = document.createElement("tr");

        for (let i = 0; i < 3; i++) {
            const forecastIndex = rowIndex * 3 + i;
            const forecast = forecasts[forecastIndex];

            const cell = document.createElement("td");
            cell.classList.add("b");

            const icon = document.createElement("div");
            icon.classList.add("ikona");
            icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">`;

            const date = document.createElement("h1");
            date.classList.add("date");
            date.textContent = formatDate(forecast.dt);

            const temp = document.createElement("h2");
            temp.classList.add("temp");
            temp.textContent = `${forecast.main.temp} °C`;

            const description = document.createElement("h3");
            description.classList.add("description");
            description.textContent = forecast.weather[0].description;

            cell.appendChild(icon);
            cell.appendChild(date);
            cell.appendChild(temp);
            cell.appendChild(description);

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

document.getElementById('get-weather-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;

    if (city) {
        const weatherData = await getWeatherData(city);

        if (weatherData) {
            generateTableRows(weatherData);
        }

        getCurrentWeather(city);
    }
});