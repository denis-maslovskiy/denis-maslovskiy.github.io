function displayCurrentDateAndTime(){
    let date = new Date().toString().split('G');
    date = date[0].split(':');
    date = date[0] + ':' + date[1];
    document.querySelector('.city__date').textContent = date;
    localStorage.setItem('current_day', date.split(' ')[2])
}
displayCurrentDateAndTime();
setInterval(() => displayCurrentDateAndTime(), 60000);