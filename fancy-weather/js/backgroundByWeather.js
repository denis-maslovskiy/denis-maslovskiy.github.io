export default async function changeBackgroundByWeather(){
    const url = `https://api.unsplash.com/photos/random?query=town,${currentMonthCheck()}&client_id=f98534a63e1ee7b28bffe8ba4568155098fd9c44a1d10838479653ab6dca0d05`;
    const response = await fetch(url);
    const data = await response.json();

    document.querySelector('body').style.backgroundImage= `url(${data.urls.small})`;
}

function currentMonthCheck(){
    let date = new Date();
    let currentMonth;

    switch(date.getMonth()){
        case 11:
        case 0:
        case 1:
            currentMonth = 'winter';
            break;
        case 2:
        case 3:
        case 4:
            currentMonth = 'spring';
            break;
        case 5:
        case 6:
        case 7:
            currentMonth = 'summer';
            break;
        case 8:
        case 9:
        case 10:
            currentMonth = 'autumn';
            break;
        default:
            alert('Error');
    }
    
    return currentMonth;
}