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
    changeBackground(response.current.weather[0].id);
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

function changeBackground(id){
    let condition;
    id = id.toString();
    console.log('changing background', id, id[0]);

    if (id[0] == '2'){
        condition = 'thunderstorm';
    }
    else if (id[0] == '3'){
        condition = 'drizzle';
    }
    else if (id[0] == '5'){
        condition = 'rain';
    }
    else if (id[0] == '6'){
        condition = 'snow';
    }
    else if (id[0] == '7'){
        condition = 'atmosphere';
    }
    else if (id[0] == '8' && id[2] == '0'){
        condition = 'clear';
    }
    else if (id[0] == '8'){
        condition = 'clouds';
    }
    
    console.log(condition);
    let background = document.body.style; 

    switch(condition){   
        case "thunderstorm":
            background.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('https://cdn.forumcomm.com/dims4/default/c04748f/2147483647/strip/true/crop/1380x920+270+0/resize/840x560!/format/webp/quality/90/?url=https%3A%2F%2Ffcc-cue-exports-brightspot.s3.us-west-2.amazonaws.com%2Fagweek%2Fbinary%2Fcopy%2Fc1%2F91%2F8065335377bbc22cc285e61fbfe7%2F3158371-lightning-1158027-1920-binary-4937661.jpg')";
            break;
        case "drizzle":
        case "rain":
            background.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('https://fox5sandiego.com/wp-content/uploads/sites/15/2021/12/AdobeStock_366903907-e1640748488433.jpeg?strip=1')";
            break;
        case "snow":
            background.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('https://www.ashevillenc.gov/wp-content/uploads/2021/01/Asheville-Old-Toll-Road-in-snow-scaled.jpg')";
            break;
        case "atmosphere":
            background.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('https://images.wallpaperscraft.com/image/single/forest_trees_fog_110131_1920x1080.jpg')";
            break;
        case "clear":
            background.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('https://www.willseye.org/wp-content/uploads/2017/08/sun-clouds-blue-sky-14641020076aM.jpg')";
        case "clouds":
            background.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url('https://images.freeimages.com/images/large-previews/d05/cloudy-sky-1200230.jpg')";
            break;
        default: 
            background.backgroundImage = `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),
            url('https://mir-s3-cdn-cf.behance.net/projects/max_808/65dfc6101821053.Y3JvcCwxNjAwLDEyNTEsMCwyMw.png')`;
        }
}