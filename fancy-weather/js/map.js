L.mapbox.accessToken = 'pk.eyJ1IjoiZHViZSIsImEiOiJjazN1OG1xd3YwOWxyM2VwaWdhc2o0aDhwIn0.1WPEuhOINZyDVr7Pbwz8KQ';
let map = L.mapbox.map('map');

export default function loadMap(){
    map.setView([localStorage['city-latitude'], localStorage['city-longitude']], 11);
    map.addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
}