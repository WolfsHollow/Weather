//ec48189d76f293875d59d78ec20af98b

class City {
    constructor(name, lat, lon, state, country){
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.state = state;
        this.country = country;
    }
}

let inputLocation = 'chicago';

getLatLon(inputLocation);

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