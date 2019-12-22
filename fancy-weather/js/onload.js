import getWeather from './weather.js'
import getValueFromInput from './input.js'
import getTimeZone from './timeZone.js'
import getCurrentLocation from './location.js'
import loadMap from './map.js'
import changeBackgroundByWeather from './backgroundByWeather.js'

export default function onload(){
    getWeather()
    .then(() => document.querySelector('.city__current').textContent = getValueFromInput() + ', ' + localStorage['country'])
    .then(() => document.querySelector('.current-temp__value').textContent = localStorage['current-weather'])
    .then(() => getTimeZone())
    .then(() => getCurrentLocation())
    .then(() => loadMap())
    .then(() => changeBackgroundByWeather())
}