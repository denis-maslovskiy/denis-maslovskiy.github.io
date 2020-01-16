// Save canvas before page reload
window.onbeforeunload = () =>{
    window.localStorage.setItem('canvas', canvas.toDataURL());
};

// CANVAS SETTINGS
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
function restoreImage(canvas,image){
    if(!image){
        return;
    }
    
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img,0,0);
    };
    img.src = image;
}
restoreImage(canvas,window.localStorage['canvas']);

let canvasSize = 512;
canvas.width = canvasSize;                                     
canvas.height = canvasSize;

ctx.strokeStyle = localStorage['current-color'];

const bucket = document.getElementById('bucket');
const pencil = document.getElementById('pencil');
const pipette = document.getElementById('pipette');

let tools = {
    bucket: false,
    pipette: false,
    pencil: true,
    transform: false
};

bucket.addEventListener('click', () => {
    tools.bucket = true;
    tools.pipette = false;
    tools.pencil = false;
    tools.transform = false;
    pencil.firstElementChild.classList.remove('active');
    pipette.firstElementChild.classList.remove('active');
    bucket.firstElementChild.classList.add('active');
});

pencil.addEventListener('click', () => {
    tools.bucket = false;
    tools.pipette = false;
    tools.pencil = true;
    tools.transform = false;
    bucket.firstElementChild.classList.remove('active');
    pipette.firstElementChild.classList.remove('active');
    pencil.firstElementChild.classList.add('active');
});

pipette.addEventListener('click', () => {
    tools.bucket = false;
    tools.pipette = true;
    tools.pencil = false;
    tools.transform = false;
    pencil.firstElementChild.classList.remove('active');
    bucket.firstElementChild.classList.remove('active');
    pipette.firstElementChild.classList.add('active');
});


let isDrawing = false;

function draw(event){
    if(!isDrawing) return; // stop the function from running when they aren't moused down
    
    localStorage.setItem('fsize',4);
    
    if(tools.pencil === true){
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        let x = Math.floor(event.offsetX / localStorage['fsize']);
        let y = Math.floor(event.offsetY / localStorage['fsize']);
        ctx.fillRect(x * localStorage['fsize'], y * localStorage['fsize'], localStorage['fsize'], localStorage['fsize']);
        ctx.fillStyle = localStorage['current-color'];
        ctx.fill();
        window.localStorage.setItem('canvas', canvas.toDataURL());
    }

    
}

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// Pipette(Color picker) realization
const getColorAtPixel = (imageData, x, y) => { 
    const {width,data} = imageData;
        
    let rgb = {
        r: data[4 * (width * y + x) + 0],
        g: data[4 * (width * y + x) + 1],
        b: data[4 * (width * y + x) + 2],
    }; 
   
    // rgb -> hex
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);

};

canvas.addEventListener('click', (event) =>{
    if(tools.bucket === true){
        ctx.fillStyle = localStorage['current-color'];
        ctx.fillRect(0, 0, 512, 512);
        window.localStorage.setItem('canvas', canvas.toDataURL());
    }
    if(tools.pipette === true){
      const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
      localStorage.setItem('prev-color', localStorage['current-color']);
      localStorage.setItem('current-color', getColorAtPixel(imageData,event.offsetX, event.offsetY)); 
      currentColor.setAttribute('value', localStorage['current-color']);
      previousColor.style.background = localStorage['prev-color'];
    }
});

// Keyboard hot keys
document.onkeypress = (event) => {
    if(event.code === 'KeyP'){
        tools.bucket = false;
        tools.pipette = false;
        tools.pencil = true;
        tools.transform = false;
        bucket.firstElementChild.classList.remove('active');
        pipette.firstElementChild.classList.remove('active');
        pencil.firstElementChild.classList.add('active');
    }
    if(event.code === 'KeyB'){
        tools.bucket = true;
        tools.pipette = false;
        tools.pencil = false;
        tools.transform = false;
        pencil.firstElementChild.classList.remove('active');
        pipette.firstElementChild.classList.remove('active');
        bucket.firstElementChild.classList.add('active');
    }
    if(event.code === 'KeyC'){
        tools.bucket = false;
        tools.pipette = true;
        tools.pencil = false;
        tools.transform = false;
        pencil.firstElementChild.classList.remove('active');
        bucket.firstElementChild.classList.remove('active');
        pipette.firstElementChild.classList.add('active');
    }
};


// ----- COLOR -----

const currentColor = document.getElementById('current-color');
const previousColor = document.querySelector('.prev-color');
const redColor = document.querySelector('.red-color');
const blueColor = document.querySelector('.blue-color');

// Save color in locale storage
currentColor.setAttribute('value', localStorage['current-color']);
previousColor.style.background = localStorage['prev-color'];

// Current color
currentColor.addEventListener('change', (event) => {
    const target = event.target;

    localStorage.setItem('prev-color', localStorage['current-color']); // set prev-color
    localStorage['current-color'] = target.value; // set current-color

    currentColor.setAttribute('value', localStorage['current-color']); // change color on elem
    previousColor.style.background = localStorage['prev-color'];

    ctx.strokeStyle = localStorage['current-color'];
});

// Red circle
redColor.addEventListener('click', () => {
    localStorage.setItem('prev-color', localStorage['current-color']);
    localStorage.setItem('current-color', '#ff0000');
    currentColor.setAttribute('value', localStorage['current-color']);
    previousColor.style.background = localStorage['prev-color'];
});

// Blue circle
blueColor.addEventListener('click', () => {
    localStorage.setItem('prev-color', localStorage['current-color']);
    localStorage.setItem('current-color', '#0000ff');
    currentColor.setAttribute('value', localStorage['current-color']);
    previousColor.style.background = localStorage['prev-color'];
});

// Previous circle
previousColor.addEventListener('click', () => {
    let newCurrentColor = localStorage['prev-color'];
    localStorage.setItem('prev-color', localStorage['current-color']);
    localStorage.setItem('current-color', newCurrentColor);

    currentColor.setAttribute('value', localStorage['current-color']);
    previousColor.style.background = localStorage['prev-color'];
    ctx.strokeStyle = localStorage['current-color'];
});


// ----- IMAGE LOAD -----

function clearCanvas(){
    ctx.fillStyle = '#ffff';
    ctx.fillRect(0, 0, 512, 512);
}

document.querySelector('.btn-load').onclick = () => {
    clearCanvas();
    // Get a link to the image from unsplash.com
    getLinkToImage();
};

// Take info from input
function getValueFromInput(){
  let getValue = document.querySelector('.town-search-input').value;
  return getValue || 'Minsk';
}

async function getLinkToImage(){
    const url = `https://api.unsplash.com/photos/random?query=town,${getValueFromInput()}&client_id=f98534a63e1ee7b28bffe8ba4568155098fd9c44a1d10838479653ab6dca0d05`;
    const response = await fetch(url);
    const data = await response.json();

    localStorage.setItem('data',data.urls.small);
    
    drawFixedImage(canvasSize);
}

// Draw Image according to the set canvas size
function drawFixedImage(canvasSize) {
    const img = new Image();
    img.onload = function() {
        let height, width, dWidth, dHeight;
        if(img.width > img.height){
            width = 0;
            height = canvasSize*0.11;
            dWidth = canvasSize;
            dHeight = canvasSize - canvasSize*0.11*2;
        }else{
            height = 0;
            width = canvasSize*0.11;
            dWidth = canvasSize - canvasSize*0.11*2;
            dHeight = canvasSize;
        }
        ctx.drawImage(img,width,height,dWidth,dHeight);
        console.log(width, height, dWidth, dHeight);
    };    
    img.src = localStorage['data'];
    img.crossOrigin = 'Anonymous';
    
    console.log(img.height + ': heigh', img.width + ': width');
}

// Resolution change buttons
document.querySelector('.btn-32x32').onclick = () => {
    clearCanvas();
    canvasSize = 32;
    canvas.width = canvasSize;                                     
    canvas.height = canvasSize;

    drawFixedImage(canvasSize);
};

document.querySelector('.btn-128x128').onclick = () => {
    clearCanvas();
    canvasSize = 128;
    canvas.width = canvasSize;                                     
    canvas.height = canvasSize;

    drawFixedImage(canvasSize);
    window.localStorage.setItem('canvas', canvas.toDataURL());
};

document.querySelector('.btn-256x256').onclick = () => {
    clearCanvas();
    canvasSize = 256;
    canvas.width = canvasSize;                                     
    canvas.height = canvasSize;

    drawFixedImage(canvasSize);
    window.localStorage.setItem('canvas', canvas.toDataURL());
};

document.querySelector('.btn-512x512').onclick = () => {
    clearCanvas();
    canvasSize = 512;
    canvas.width = canvasSize;                                     
    canvas.height = canvasSize;

    drawFixedImage(canvasSize);
    window.localStorage.setItem('canvas', canvas.toDataURL());
};

// Grayscale function
let grayscale = function(){
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    for(let i=0;i<data.length;i+=4){
        
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

let grayscaleBtn = document.querySelector('.grayscale-btn');
grayscaleBtn.addEventListener('click', grayscale);
