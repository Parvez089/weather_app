const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardDiv = document.querySelector(".weather-cards");



const API_KEY = "6a8b147d38e1659ae5fecec661565a15";

const createWeatherCard = (cityName,weatherItem,index) =>{
    if(index === 0){ // HTML for the main weather card
        return `
                <div class="details">
                    <h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
                      <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}</h4>
                        <h4>Wind: ${weatherItem.wind.speed}°C</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}°C</h4>
                </div>
                <div class="icon">
                    <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>
        `;   
    }else{ // HTML for the other five day forecast card
                return `
                    <li class="card">
                       <h3>(${weatherItem.dt_txt.split(" ")[0]}) </h3>
                         <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}</h4>
                        <h4>Wind: ${weatherItem.wind.speed}°C</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}°C</h4>
                        
                    </li>
    `;
    }

}

const  getWeatherDetails = (cityName,lat,lon) =>{
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data => {
        const uniqueForecastDays =[];
        // console.log(data);
// Filter the forecasts to get only one forecast per day
     const  fiveDaysForecast =   data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();//22:42
            if(!uniqueForecastDays.includes(forecastDate)){
             return uniqueForecastDays.push(forecastDate);
            }
        });

        //Clearing Previous weather data
        cityInput.value ="";
        currentWeatherDiv.innerHTML = "";
        weatherCardDiv.innerHTML = "";
        console.log(fiveDaysForecast);

        //Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem,index) =>{
            if(index === 0 ){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
            } else{
                 weatherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
            }
            
        });

    }).catch(()=>{
    alert("An error occurred while featching the weather forecast!");
})
}


const getCityCoordinates=()=>{
    const cityName = cityInput.value.trim(); //get user entered city name and remove extra spaces
    if(!cityName) return; //Return if cityName is empty
    console.log(cityName);
   const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`


   //Get entered city coordinates (latitude, longitude, and name) from the API response
fetch(GEOCODING_API_URL)
.then(res => res.json())
.then(data =>{
    if(!data.length) return alert(`No coordinates found for ${cityName}`);
    const {name, lat,lon } = data[0];
    getWeatherDetails(name,lat,lon);
}).catch(()=>{
    alert("An error occurred while featching the cordinates!");
})

};

searchButton.addEventListener("click",getCityCoordinates)