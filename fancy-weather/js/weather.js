import getValueFromInput from './input.js'

export default async function getWeather(){
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${getValueFromInput()}&lang=ua&units=metric&APPID=613274154e290eb90c1b64a632f4a789`;
    const response = await fetch(url);
    const data = await response.json();

    localStorage.setItem('country', data.city.country);
    localStorage.setItem('city-latitude', data.city.coord.lat);
    localStorage.setItem('city-longitude', data.city.coord.lon);
    localStorage.setItem('current-weather', Math.round(data.list[0].main.temp))

    let nextDays =[]
    for(let i=0;i<40;i++){
        if(data.list[i].dt_txt.split(' ').pop().split(':').shift() === '12'){
            nextDays.push(data.list[i]);
        }
    }

    document.querySelector('.weather').textContent = data.list[0].weather[0].main;
    document.querySelector('.wind').textContent = data.list[0].wind.speed;
    document.querySelector('.humidity').textContent = data.list[0].main.humidity;
    document.querySelector('.latitude').textContent = data.city.coord.lat;
    document.querySelector('.longitude').textContent = data.city.coord.lon;

    if(!(nextDays[0].dt_txt.split('-')[2].split(' ')[0] === localStorage['current_day'])){
        document.querySelector('.next-three-days-weather__next_one').textContent = Math.round(nextDays[0].main.temp);
        document.querySelector('.next-three-days-weather__next_two').textContent = Math.round(nextDays[1].main.temp);
        document.querySelector('.next-three-days-weather__next_three').textContent = Math.round(nextDays[2].main.temp);
    }else{
        document.querySelector('.next-three-days-weather__next_one').textContent = Math.round(nextDays[1].main.temp);
        document.querySelector('.next-three-days-weather__next_two').textContent = Math.round(nextDays[2].main.temp);
        document.querySelector('.next-three-days-weather__next_three').textContent = Math.round(nextDays[3].main.temp);
    }

}