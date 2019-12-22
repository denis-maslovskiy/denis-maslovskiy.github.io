export default function getValueFromInput(){
    let value = document.querySelector('.input-and-search__input').value;
//     return value || localStorage['current-city'];
    return value || 'Minsk';
}
