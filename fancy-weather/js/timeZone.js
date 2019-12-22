export default async function getTimeZone(){
    
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=WATWWREWYH81&format=json&by=position&lat=${localStorage['city-latitude']}&lng=${localStorage['city-longitude']}
    `;
    const response = await fetch(url);
    const data = await response.json();

    let todays_date = data.formatted.split(' ').shift();
    localStorage.setItem('todays_date', todays_date);
}
