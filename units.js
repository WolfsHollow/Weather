function KtoCelsius(tempK){
    tempC = tempK-273.15;
    return tempC.toFixed(1);
}

function KtoFahrenheit(tempK){
    tempF = (tempK-273.15)*(9/5)+32;
    return tempF.toFixed(1);
}

function toFahrenheit(tempC){
    tempF = (tempC*(9/5))+32;
    return tempF.toFixed(1);
}

function toCelsius(tempF){
    tempC =(tempF-32)*(5/9);
    return tempC.toFixed(1);
}

function getUnit(isCelsius){
    if (isCelsius){
        return ' °C';
    }
    else { 
        return ' °F';
    }
}

function toggleUnit(isCelsius){
    isCelsius = !isCelsius;
    updateWeatherUnits(isCelsius);
    return isCelsius;
}

function updateWeatherUnits(isCelsius){
    
    let tempText;
    let newSpan;
    let forecastTempArray = document.querySelectorAll('div.forecastTemp');
    let forecastTempLowArray = document.querySelectorAll('div.forecastTempLow');
    
    let temperatureArray = [currentTemp, miscInfoDivArray[0][3]];
    temperatureArray.push(...forecastTempArray);
    temperatureArray.push(...forecastTempLowArray);

    for (let i = 0; i < temperatureArray.length; i++){
        tempText = temperatureArray[i].innerText;
        tempText = Number.parseFloat(tempText);
        if (isCelsius){
            temperatureArray[i].innerText = toCelsius(tempText);
        }
        else if (!isCelsius){
            temperatureArray[i].innerText = toFahrenheit(tempText);
        }
        newSpan = document.createElement('span'); 
        newSpan.classList.add('unit');
        newSpan.innerText = getUnit(isCelsius);
        temperatureArray[i].append(newSpan);
    }
    currentTemp.childNodes[1].classList.remove('unit');
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