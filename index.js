//ec48189d76f293875d59d78ec20af98b

//weather data (left)
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const currentDescription = document.getElementById('description');
const currentLocation = document.getElementById('location');
const currentDate = document.getElementById('date');
const currentTemp = document.getElementById('currentTemp');

//bottom container
const bottomContainer = document.getElementById('bottomContainer');
const tabs = document.getElementById('tabsContainer');
const hourlyTab = document.createElement('div');
const dailyTab = document.createElement('div');

//misc info (right)
const miscContainer=document.getElementById('miscInfoContainer');
const feelsLikeContainer = document.getElementById('feelsLikeContainer');
const humidityContainer = document.getElementById('humidityContainer');
const rainChanceContainer = document.getElementById('rainChanceContainer');
const windSpeedContainer = document.getElementById('windSpeedContainer');

let currentWeatherArray = [currentDescription, currentLocation, currentDate, currentTemp];
let miscInfoDivArray = [[feelsLikeContainer], [humidityContainer], [rainChanceContainer], [windSpeedContainer]];

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
        divIconArray[i] = document.createElement('i');
        divLabelArray[i] = document.createElement('label');
        divMiscDataArray[i] = document.createElement('div');

        divIconArray[i].innerText = 'icon';
        divLabelArray[i].innerText = 'label';
        divMiscDataArray[i].innerText = 'data';

        divIconArray[i].classList.add('icon');
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

function createForecastDivs(){
    dailyArray = [];
    hourlyArray = [];

    const dailyContainer = document.createElement('div');
    const hourlyContainer = document.createElement('div'); 

    dailyContainer.classList.add('forecastContainer');
    dailyContainer.classList.add('show');
    hourlyContainer.classList.add('forecastContainer');

    for (let i = 0; i<7; i++){
        dailyArray[i] = document.createElement('div');
        hourlyArray[i] = document.createElement('div');
        
        for (let j=0; j<4;j++){            
            let newDiv = createNewSection(j);
            dailyArray[i].append(newDiv);
        }

        dailyArray[i].classList.add('section');
        hourlyArray[i].classList.add('section');

        dailyContainer.append(dailyArray[i]);
        hourlyContainer.append(hourlyArray[i]);
    }
    bottomContainer.append(dailyContainer, hourlyContainer);
}

function createNewSection(index){
    let newDiv;
    switch (index){
        case 0:
            newDiv = document.createElement('div');
            newDiv.classList.add('forecastDay');
            return newDiv;
        case 1:
            newDiv = document.createElement('div');
            newDiv.classList.add('forecastTemp');
            return newDiv;
        case 2:
            newDiv = document.createElement('div');
            newDiv.classList.add('forecastTempLow');
            return newDiv;
        case 3:
            newDiv = document.createElement('i');
            newDiv.classList.add('forecastIcon');
            return newDiv;
    }    
}

let inputLocation = 'chicago';



// getLatLon(inputLocation);

async function getLatLon(inputLocation){
    let cityResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputLocation}&limit=5&appid=ec48189d76f293875d59d78ec20af98b`, {mode: 'cors'});
    
    let parsedResponse = await cityResponse.json();
    let locationArray = parseResponse(parsedResponse);   
    let weatherData = await getWeatherData(locationArray[0].lat, locationArray[0].lon);
    console.log(weatherData);
}

// current.feels_like;
// current.humidity;
// current.pressure;
// current.temp;// in kelvin
// current.temp_max;
// current.temp_min;
// sys.country/id/sunrise/sunset/type
// timezone
// visibility
// weather[0].description/icon/id/main
// window.deg/gust/speed

function parseResponse(response){
   
    let locationArray = [];
    
    for (let i = 0; i<5; i++){
        locationArray[i] = new City(
            response[i].name, 
            response[i].lat,
            response[i].lon,
            response[i].state,
            response[i].country)
    }
    return locationArray;
}

// async function getCurrentData(lat, lon){
    
//     let latLonResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ec48189d76f293875d59d78ec20af98b`, {mode: 'cors'});

//     let weatherData = await latLonResponse.json();

//     return weatherData;    
// }

async function getWeatherData(lat, lon){
    
    let forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=ec48189d76f293875d59d78ec20af98b`, {mode: 'cors'});

    let forecastData = await forecastResponse.json();

    return forecastData;  
}