function getWeather() {
    const apiKey = '39f3f1d9d11ed8779b8d5c3d4a86ae48';
    const city = document.getElementById('cityInput').value;
    document.getElementById('msgs').classList.remove('hiddenr');
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Check if the necessary properties exist in the API response
            if (data.list && data.list.length > 0) {
                // Extract relevant weather information for the current day
                const todayForecast = data.list.find(forecast => {
                    const date = new Date(forecast.dt * 1000); // Convert timestamp to Date object
                    const today = new Date();
                    return date.getDate() === today.getDate();
                });

                if (todayForecast) {
                    // Extract current day weather information
                    const temperature = Math.round(todayForecast.main.temp);
                    const description = todayForecast.weather[0].description;
                    const cityName = data.city.name;
                    const humidity = todayForecast.main.humidity;
                    const windSpeed = todayForecast.wind.speed;
                    const weatherIcon = todayForecast.weather[0].icon;

                    // Find maximum and minimum temperatures for the day
                    let maxTemp = todayForecast.main.temp;
                    let minTemp = todayForecast.main.temp;
                    for (const forecast of data.list) {
                        const forecastDate = new Date(forecast.dt * 1000);
                        if (forecastDate.getDate() === new Date(todayForecast.dt * 1000).getDate()) {
                            maxTemp = Math.max(maxTemp, forecast.main.temp_max);
                            minTemp = Math.min(minTemp, forecast.main.temp_min);
                        }
                    }

                    // Populate HTML elements with current day weather information
                    document.querySelector('.weather-description').textContent = description;
                    document.querySelector('.current-temperature').textContent = `${temperature}°C`;
                    document.querySelector('.city-name').textContent = cityName;
                    document.querySelector('.hum').textContent = `${humidity ? humidity + '%' : 'N/A'}`;
                    document.querySelector('.wind').textContent = `${windSpeed ? windSpeed + ' km/h' : 'N/A'}`;
                    document.querySelector('.high-temperature').textContent = `high: ${Math.round(maxTemp)}°C`;
                    document.querySelector('.low-temperature').textContent = `low: ${Math.round(minTemp)}°C`;
                    document.querySelector('.weather-icon').src = `http://openweathermap.org/img/wn/${weatherIcon}.png`;

                    // Update HTML for upcoming days
                    const upcomingDays = document.querySelectorAll('.upcoming > div');
                    let currentDay = new Date(todayForecast.dt * 1000).getDate();
                    let index = 0;
                    for (let i = 1; i < data.list.length && index < upcomingDays.length; i++) {
                        const forecast = data.list[i];
                        const forecastDate = new Date(forecast.dt * 1000);
                        const day = forecastDate.getDate();
                        if (day !== currentDay) {
                            const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                            
                            // Find maximum and minimum temperatures for the day
                            let maxTemp = -Infinity;
                            let minTemp = Infinity;
                            while (i < data.list.length && new Date(data.list[i].dt * 1000).getDate() === day) {
                                maxTemp = Math.max(maxTemp, data.list[i].main.temp_max);
                                minTemp = Math.min(minTemp, data.list[i].main.temp_min);
                                i++;
                            }
                            i--;

                            const forecastIcon = forecast.weather[0].icon;

                            // Update HTML elements for each upcoming day
                            upcomingDays[index].querySelector('.update').textContent = dayName;
                            upcomingDays[index].querySelector('.weather-icon').src = `http://openweathermap.org/img/wn/${forecastIcon}.png`;
                            upcomingDays[index].querySelector('.updiscription').textContent = forecast.weather[0].description;
                            upcomingDays[index].querySelector('.uphigh').textContent = `high: ${Math.round(maxTemp)}°C`;
                            upcomingDays[index].querySelector('.uplow').textContent = `low: ${Math.round(minTemp)}°C`;

                            currentDay = day;
                            index++;
                        }
                    }
                    document.getElementById('msg').classList.add('hidden');
                    document.getElementById('all').classList.remove('hidden');
                    document.getElementById('upcome').classList.remove('hidden');
                    document.getElementById('msgs').classList.add('hiddenr');

                } else {
                    console.error('No forecast available for the current day');
                    document.getElementById('msg').classList.remove('hidden');
                    document.getElementById('all').classList.add('hidden');
                    document.getElementById('upcome').classList.add('hidden');
                    document.getElementById('msgs').classList.add('hiddenr');
                }
            } else {
                console.error('Incomplete weather data received from API');
                document.getElementById('msg').classList.remove('hidden');
                document.getElementById('all').classList.add('hidden');
                document.getElementById('upcome').classList.add('hidden');
                document.getElementById('msgs').classList.add('hiddenr');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('msg').classList.remove('hidden');
            document.getElementById('all').classList.add('hidden');
            document.getElementById('upcome').classList.add('hidden');
            document.getElementById('msgs').classList.add('hiddenr');
        });
}