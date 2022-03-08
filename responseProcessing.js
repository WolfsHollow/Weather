async function getLatLon(inputLocation){
    let cityResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputLocation}&limit=5&appid=ec48189d76f293875d59d78ec20af98b`, {mode: 'cors'});
        
    let parsedResponse = await cityResponse.json();
    let locationArray = parseResponse(parsedResponse);  
    // let weatherData = await getWeatherData(locationArray[0].lat, locationArray[0].lon);
    // console.log(weatherData);
    // parseWeatherResponse(weatherData);
}

function parseResponse(response){
   
    let locationArray = [];
    let cityArray = cityContainer.children;
    
    for (let i = 0; i<5; i++){
        locationArray[i] = new City(
            response[i].name, 
            response[i].lat,
            response[i].lon,
            response[i].state,
            response[i].country)

        cityArray[i].innerText = response[i].name + ', ' + response[i].state + ', ' + response[i].country;
        cityArray[i].value = locationArray[i];
        cityArray[i].addEventListener('click', (e)=>{chooseCity(e)});
    }
    return locationArray;
}

async function chooseCity(e){
    let weatherData = await getWeatherData(e.target.value.lat, e.target.value.lon);
    cityContainer.classList.remove('show');
    parseWeatherResponse(weatherData, e.target.value.name);
}

async function getWeatherData(lat, lon){
    
    let forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=ec48189d76f293875d59d78ec20af98b`, {mode: 'cors'});
    
    let forecastData = await forecastResponse.json();
    
    return forecastData;  
}

function parseWeatherResponse(response, city){
    console.log(response);
    let description = response.current.weather[0].description;
    description = description[0].toUpperCase() + description.slice(1);    
    currentDescription.innerText = description;
    currentLocation.innerText = city;
    currentDate.innerText = getDateFromTimestamp(response.current.dt, 'full');
    currentTemp.innerText = KtoCelsius(response.current.temp) + getUnit(isCelsius);
    miscInfoDivArray[0][3].childNodes[0].nodeValue = KtoCelsius(response.current.feels_like)
    miscInfoDivArray[1][3].childNodes[0].nodeValue = response.current.humidity; //humidity data
    miscInfoDivArray[2][3].childNodes[0].nodeValue = response.current.clouds; //cloudiness data
    miscInfoDivArray[3][3].childNodes[0].nodeValue = response.current.wind_speed; //wind speed data

    //Daily forecast sections    
    for (let i = 0; i < 7; i++){
        for (let j = 0; j < 4; j++){
            setDailyForecastData(dailyArray[i].childNodes[j], j, response, i);
        }
    }

    //Hourly forecast sections
    for (let k = 0; k < 48; k++){
        for (p = 0; p < 4; p++){
            setHourlyForecastData(hourlyArray[k].childNodes[p], p, response, k);
        }
    }
}

function setHourlyForecastData(node, index, response, hourlyIndex){
    let nodeSpan = node.children[0];
    switch (index){
        case 0: //time
            node.innerText = getDateFromTimestamp(response.hourly[hourlyIndex].dt, 'time');
            break;
        case 1: //temp
            if (isCelsius){
                node.innerText = KtoCelsius(response.hourly[hourlyIndex].temp);
                node.append(nodeSpan);
                break;      
            }
            else if (!isCelsius){
                node.innerText = KtoFahrenheit(response.hourly[hourlyIndex].temp);
                node.append(nodeSpan);
                break;
            }
            console.log('Error creating hourly forecast data');
        case 2: //chance of rain
            node.innerText = response.hourly[hourlyIndex].pop*100;
            node.append(nodeSpan);
            break;
        case 3: //weather icon
            let icon = response.hourly[hourlyIndex].weather[0].icon; 
            node.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            break;
        default:
            break;
    }
}

function setDailyForecastData(node, index, response, dailyIndex){
    let nodeSpan = node.children[0];
    switch (index){
        case 0: //day
            node.innerText = getDateFromTimestamp(response.daily[dailyIndex].dt, 'day');
            break;
        case 1: //high temp
            if (isCelsius){
                node.innerText = KtoCelsius(response.daily[dailyIndex].temp.max);
                node.append(nodeSpan);
                break;
            }
            else if (!isCelsius){
                node.innerText = KtoFahrenheit(response.daily[dailyIndex].temp.max);
                node.append(nodeSpan);
                break;
            }
        case 2: //low temp
            if (isCelsius){
                node.innerText = KtoCelsius(response.daily[dailyIndex].temp.min);
                node.append(nodeSpan);
                break;
            }
            else if (!isCelsius){
                node.innerText = KtoFahrenheit(response.daily[dailyIndex].temp.min);
                node.append(nodeSpan);
                break;
            }

        case 3: //weather icon
            let icon = response.daily[dailyIndex].weather[0].icon; 
            node.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            break;
        default:
            break;
    }
}

