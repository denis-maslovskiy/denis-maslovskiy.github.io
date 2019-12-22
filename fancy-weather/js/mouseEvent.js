import changeBackgroundByWeather from './backgroundByWeather.js'

document.querySelector('.input-and-search__search-btn').onclick = () => {
    onload();
    () => map.setView([localStorage['city-latitude'], localStorage['city-longitude']], 11);
}

document.querySelector('#refresh-bg').onmousedown = () =>{
    document.querySelector('#refresh-bg').classList.add('active');

    document.querySelector('#refresh-bg').onmouseup = () =>{
        document.querySelector('#refresh-bg').classList.remove('active');
        changeBackgroundByWeather();
    }
}