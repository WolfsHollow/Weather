//ec48189d76f293875d59d78ec20af98b

//weather data (left)
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const currentDescription = document.getElementById('description');
const currentLocation = document.getElementById('location');
const currentDate = document.getElementById('date');
const currentTemp = document.getElementById('currentTemp');
const locationInput = document.getElementById('locationInput');
const cityContainer = document.getElementById('locationOutputContainer');
const citySearchBtn = document.getElementById('citySearchBtn');

citySearchBtn.addEventListener('click', ()=>{inputLocation = locationInput.value;
                                            inputLocation = inputLocation[0].toUpperCase() + inputLocation.slice(1);
                                            cityContainer.classList.add('show');
                                            getLatLon(inputLocation)});

//bottom container
const bottomContainer = document.getElementById('bottomContainer');
const tabs = document.getElementById('tabsContainer');
const hourlyTab = document.createElement('div');
const dailyTab = document.createElement('div');
let dailyContainer;
let hourlyContainer;

let isDailyShowing = true;
hourlyTab.addEventListener('click', ()=>{toggleForecast('hourly')});
dailyTab.addEventListener('click', ()=>{toggleForecast('daily')});

//misc info (right)
const miscContainer=document.getElementById('miscInfoContainer');
const feelsLikeContainer = document.getElementById('feelsLikeContainer');
const humidityContainer = document.getElementById('humidityContainer');
const cloudinessContainer = document.getElementById('cloudinessContainer');
const windSpeedContainer = document.getElementById('windSpeedContainer');

let inputLocation;
let currentWeatherArray = [currentDescription, currentLocation, currentDate, currentTemp];
let miscInfoDivArray = [[feelsLikeContainer], [humidityContainer], [cloudinessContainer], [windSpeedContainer]];

class City {
    constructor(name, lat, lon, state, country){
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.state = state;
        this.country = country;
    }
}

setupPage();


function setupPage(){
    //setup misc info (right side)
    let divIconArray = [];
    let divLabelArray = [];
    let divMiscDataArray = [];
    
    for (let i = 0; i<4; i++){
        divIconArray[i] = document.createElement('span');
        divLabelArray[i] = document.createElement('label');
        divMiscDataArray[i] = document.createElement('div');

        let label = getLabelText(i);
        let icon = getIcon(i);
        divIconArray[i].innerText = icon;
        divLabelArray[i].innerText = label;
        divMiscDataArray[i].innerText = 'data';

        divIconArray[i].classList.add('material-icons','icon');
        divLabelArray[i].classList.add('miscLabel');
        divMiscDataArray[i].classList.add('miscData');
        
        miscInfoDivArray[i].push(divIconArray[i], divLabelArray[i], divMiscDataArray[i]);
        miscInfoDivArray[i][0].append(divIconArray[i], divLabelArray[i], divMiscDataArray[i]);
    }

    tabs.append(dailyTab, hourlyTab);
    dailyTab.innerText = 'Daily';
    hourlyTab.innerText = 'Hourly';

    dailyTab.classList.add('tab');
    hourlyTab.classList.add('tab');
    
    createForecastDivs();
}

function getLabelText(i){
    switch (i){
        case 0:
            return 'Feels Like';
        case 1:
            return 'Humidity';
        case 2:
            return 'Cloudiness';
        case 3:
            return 'Wind Speed';
            default:
                break;
                // case 4:
                //     break;
            }
}

function getIcon(i){
    switch (i){
        case 0:
            return 'thermostat';
        case 1:
            return 'water_drop';
        case 2:
            return 'filter_drama';
        case 3:
            return 'air';
            default:
                break;
                // case 4:
                //     break;
            }
}

function createForecastDivs(){
    dailyArray = [];
    hourlyArray = [];

    dailyContainer = document.createElement('div');
    hourlyContainer = document.createElement('div'); 

    dailyContainer.classList.add('forecastContainer');
    dailyContainer.classList.add('show');
    hourlyContainer.classList.add('forecastContainer');
    // hourlyContainer.classList.add('show');

    for (let i = 0; i<7; i++){
        dailyArray[i] = document.createElement('div');
        
        for (let j=0; j<4;j++){            
            let newDiv = createNewSection(j, true);
            dailyArray[i].append(newDiv);
        }

        dailyArray[i].classList.add('section');

        dailyContainer.append(dailyArray[i]);
    }

    for (i = 0; i<48; i++){
        hourlyArray[i] = document.createElement('div');

        for (j=0; j<4; j++){
            newDiv = createNewSection(j, false);
            hourlyArray[i].append(newDiv);
        }
        hourlyArray[i].classList.add('section');
        hourlyContainer.append(hourlyArray[i]);
    }
    bottomContainer.append(dailyContainer, hourlyContainer);
}

function createNewSection(index, isDaily){
    let newDiv, unitSpan;
    let icon = '11n';
    switch (index){
        case 0:
            newDiv = document.createElement('div');            
            newDiv.innerText = 'Wednesday';          
            newDiv.classList.add('forecastDay');           
            return newDiv;
        case 1:
            newDiv = document.createElement('div');
            unitSpan = document.createElement('span');
            
            newDiv.classList.add('forecastTemp');
            unitSpan.classList.add('unit');
            
            newDiv.innerText = 'temp';
            unitSpan.innerText = ' °C'

            newDiv.appendChild(unitSpan);              
            return newDiv;
        case 2:
            newDiv = document.createElement('div');
            unitSpan = document.createElement('span');
            
            newDiv.innerText = isDaily ? 'tempLow' : 'Chance of Rain';
            unitSpan.innerText = isDaily ? ' °C' : '%';

            let divClass = isDaily ? 'forecastTempLow' : 'forecastRainChance';
            newDiv.classList.add(divClass);
            unitSpan.classList.add('unit');

            newDiv.appendChild(unitSpan);                        
            return newDiv;

        case 3:
            newDiv = document.createElement('img');
            newDiv.classList.add('forecastIcon');
            newDiv.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            newDiv.innerText = 'icon'
            return newDiv;
        default:
            break;
    }    
}


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
    currentTemp.innerText = KtoCelsius(response.current.temp) + ' °C';
    // miscInfoDivArray[0][1].innerText = ; //icon
    miscInfoDivArray[0][3].innerText = KtoCelsius(response.current.feels_like) + ' °C'; //feels like data
    miscInfoDivArray[1][3].innerText = response.current.humidity +'%'; //humidity data
    miscInfoDivArray[2][3].innerText = response.current.clouds+'%'; //cloudiness data
    miscInfoDivArray[3][3].innerText = response.current.wind_speed+' m/s'; //wind speed data

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

function setDailyForecastData(node, index, response, dailyIndex){
    let nodeSpan = node.children[0];
    switch (index){
        case 0: //day
            node.innerText = getDateFromTimestamp(response.daily[dailyIndex].dt, 'day');
            break;
        case 1: //high temp
            node.innerText = KtoCelsius(response.daily[dailyIndex].temp.max);
            node.append(nodeSpan);
            break;
        case 2: //low temp
            node.innerText = KtoCelsius(response.daily[dailyIndex].temp.min);
            node.append(nodeSpan);
            break;
        case 3: //weather icon
            let icon = response.daily[dailyIndex].weather[0].icon; 
            node.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            break;
        default:
            break;
    }
}

function setHourlyForecastData(node, index, response, hourlyIndex){
    let nodeSpan = node.children[0];
    switch (index){
        case 0: //time
            node.innerText = getDateFromTimestamp(response.hourly[hourlyIndex].dt, 'time');
            break;
        case 1: //temp
            node.innerText = KtoCelsius(response.hourly[hourlyIndex].temp);
            node.append(nodeSpan);
            break;
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

function KtoCelsius(tempK){
    tempC = tempK-273.15;
    return tempC.toFixed(1);
}

function toFahrenheit(tempC){
    tempF = (tempC*(9/5))+32;
    return tempF.toFixed(1);
}

function toCelsius(tempF){
    tempC =(tempF-32)*(5/9);
    return tempC.toFixed(1);
}

function getDateFromTimestamp(timestamp, form){
    let time = new Date(timestamp*1000);
    let hour = time.toLocaleTimeString('en-US', {hour: 'numeric'});
    let day = time.toLocaleDateString('en-US',{weekday: 'long'}); 
    let date = time.toLocaleDateString('en-US',
                 {year:'numeric', month: 'long', day: 'numeric'});
    switch (form){
        case 'day':
            return day;
        case 'date':
            return date;
        case 'full':
            return day + ', ' + date;
        case 'time':
            return hour;
    }
}

function toggleForecast(tab){
    if (tab == 'hourly'){ 
        dailyContainer.classList.remove('show');
        hourlyContainer.classList.add('show');
        isDailyShowing = !isDailyShowing;
    }
    else if (tab == 'daily'){
        dailyContainer.classList.add('show');
        hourlyContainer.classList.remove('show');    
        isDailyShowing = !isDailyShowing;    
    }
}