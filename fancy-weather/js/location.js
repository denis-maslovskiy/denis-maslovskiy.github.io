export default async function getCurrentLocation(){
    const url =`https://ipinfo.io?token=7bd3de0931e378`;
    const response = await fetch(url);
    const data = await response.json();
    
    localStorage.setItem('current-city', data.city);
}