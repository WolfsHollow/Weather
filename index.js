//ec48189d76f293875d59d78ec20af98b

//weather data (left)
const currentWeatherContainer = document.getElementById('currentWeatherContainer');
const currentDescription = document.getElementById('description');
const currentLocation = document.getElementById('location');
const currentDate = document.getElementById('date');
const currentTemp = document.getElementById('currentTemp');
const tempUnitBtn = document.getElementById('tempUnit');
tempUnitBtn.addEventListener('click', ()=>{isCelsius = toggleUnit(isCelsius)
                                          tempUnitBtn.innerText = isCelsius ? 'Display F':'Display C';
                                          });


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
let isCelsius = false;
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
    let dataSpan;

    for (let i = 0; i<4; i++){
        divIconArray[i] = document.createElement('span');
        divLabelArray[i] = document.createElement('label');
        divMiscDataArray[i] = document.createElement('div');
        dataSpan = document.createElement('span');

        let label = getLabelText(i);
        let icon = getIcon(i);
        let unit = getMiscUnit(i);
        divIconArray[i].innerText = icon;
        divLabelArray[i].innerText = label;
        divMiscDataArray[i].innerText = 'data';
        dataSpan.innerText = unit;
        divMiscDataArray[i].append(dataSpan);

        divIconArray[i].classList.add('material-icons','icon');
        divLabelArray[i].classList.add('miscLabel');
        divMiscDataArray[i].classList.add('miscData');
        dataSpan.classList.add('unit');

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

function getMiscUnit(i){
    switch (i){
        case 0:
            return getUnit(isCelsius);
        case 1:
        case 2:
            return ' %';
        case 3:
            return ' m/s';
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
            unitSpan.innerText = getUnit(isCelsius);

            newDiv.appendChild(unitSpan);              
            return newDiv;
        case 2:
            newDiv = document.createElement('div');
            unitSpan = document.createElement('span');
            
            newDiv.innerText = isDaily ? 'tempLow' : 'Chance of Rain';
            unitSpan.innerText = isDaily ? getUnit(isCelsius) : '%';

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