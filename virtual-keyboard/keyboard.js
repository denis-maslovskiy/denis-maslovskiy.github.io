const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        textarea: null
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: '',
        capsLock: false,
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');
        this.elements.textarea = document.createElement('textarea');


        // Setup main elements
        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.textarea.classList.add('use-keyboard-input');

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
        document.body.appendChild(this.elements.textarea);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue =>
                    {
                        element.value = currentValue;
                    });
            });
        });

        // Add keypress
        document.onkeydown = (event) => {
            
            // Add 'active' class on pressed down key
            document.querySelector('[data="'+event.code+'"]').classList.add('active');
            

            if(event.code === 'CapsLock'){
                this._toggleCapsLock();
            }

            if(event.code === 'Backspace'){
                this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            }

            if(event.code==='Tab'){
                this.properties.value += '  ';
                this._triggerEvent('oninput');
            }

            if(event.code === 'ShiftLeft'){
                this._toggleCapsLock();
                document.onkeyup = (event) => {
                    if(event.code === 'ShiftLeft') this._toggleCapsLock();
                };
            }

            if(event.code !== 'Backspace' && event.code !== 'Tab' && event.code !== 'CapsLock' && event.code !== 'ControlLeft' && event.code !== 'AltLeft' && event.code !== 'ShiftLeft'){
                this.properties.value += event.key;
            }
        };    
        
        // Remove 'active' class from pressed up key
        document.onkeyup = (event) => {
            document.querySelector('[data="'+event.code+'"]').classList.remove('active');
        };
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout_current = [
            "`","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "Tab","q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";","'", "enter",
            "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", 
            "ctrl", "win", "alt", "space", "<", "^", "|", ">" 
        ];

        // Create HTML for an icon
        const createIconHTML = (icon_name) =>{
            return `<i class='material-icons'>${icon_name}</i>`;
        };


        keyLayout_current.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', ']', 'enter', '/', 'ъ', 'ю'].indexOf(key) !== -1;

            // Set Data Attribute
            function getData(){
                for(let item in Keys_en){
                    if(key === Keys_en[item]) return `${item}`;
                }
            }
            keyElement.setAttribute('data', `${getData()}`);


            // Add attributes/classes
            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch(key){
                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHTML('backspace');

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });

                    break;


                case 'CapsLock':
                        keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                        keyElement.innerHTML = createIconHTML('keyboard_capslock');
    
                        keyElement.addEventListener('click', () => {
                            this._toggleCapsLock();
                            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                        });
    
                        break;


                case 'enter':
                        keyElement.classList.add('keyboard__key--wide');
                        keyElement.innerHTML = createIconHTML('keyboard_return');
    
                        keyElement.addEventListener('click', () => {
                            this.properties.value += '\n';
                            this._triggerEvent('oninput');
                        });
    
                        break;


                case 'space':
                        keyElement.classList.add('keyboard__key--extra-wide');
                        keyElement.innerHTML = createIconHTML('space_bar');

                        keyElement.addEventListener('click', () => {
                            this.properties.value += ' ';
                            this._triggerEvent('oninput');
                        });

                        break;

                case 'Tab':
                        keyElement.classList.add('keyboard__key--wide');
                        keyElement.innerHTML = createIconHTML('sync_alt');

                        keyElement.addEventListener('click', () => {
                            this.properties.value += '  ';
                            this._triggerEvent('oninput');
                        });

                        break;

                case 'shift':
                        keyElement.classList.add('keyboard__key--wide');
                        keyElement.innerHTML = createIconHTML('expand_less');
                        

                        break;

                case 'win':
                        keyElement.classList.add('keyboard__key');
                        keyElement.innerHTML = createIconHTML('dashboard');

                        break;

                case '<':
                        keyElement.classList.add('keyboard__key');
                        keyElement.innerHTML = createIconHTML('arrow_left');

                        keyElement.addEventListener('click', () =>{
                            this.properties.value += '\u2190';
                            this._triggerEvent('oninput');
                        });

                        break;

                case '^':
                        keyElement.classList.add('keyboard__key');
                        keyElement.innerHTML = createIconHTML('arrow_drop_up');
                        
                        keyElement.addEventListener('click', () =>{
                            this.properties.value += '\u2191';
                            this._triggerEvent('oninput');
                        });

                        break;

                case '|':
                        keyElement.classList.add('keyboard__key');
                        keyElement.innerHTML = createIconHTML('arrow_drop_down');
                        
                        keyElement.addEventListener('click', () =>{
                            this.properties.value += '\u2193';
                            this._triggerEvent('oninput');
                        });

                        break;

                case '>':
                        keyElement.classList.add('keyboard__key');
                        keyElement.innerHTML = createIconHTML('arrow_right');

                        keyElement.addEventListener('click', () =>{
                            this.properties.value += '\u2192';
                            this._triggerEvent('oninput');
                        });

                        break;

                default:
                        keyElement.textContent = key.toLowerCase();

                        keyElement.addEventListener('click', () => {
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                            this._triggerEvent('oninput');
                        });

                        break;
            }

            fragment.appendChild(keyElement);

            if(insertLineBreak){
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;

    },

    _triggerEvent(handlerName){
        if(typeof this.eventHandlers[handlerName] == 'function'){
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for(const key of this.elements.keys){
            if(key.childElementCount === 0){
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    },
    
    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    }

};

window.addEventListener('DOMContentLoaded', function() {
    Keyboard.init();

});



const Keys_en = {
    Backquote: '`',
    Digit1: '1',
    Digit2: '2',
    Digit3: '3',
    Digit4: '4', 
    Digit5: '5',
    Digit6: '6',
    Digit7: '7',
    Digit8: '8',
    Digit9: '9',
    Digit0: '0',
    Minus: '-',
    Equal: '=',
    Backspace: 'backspace',
    Tab: 'Tab',
    KeyQ: 'q',
    KeyW: 'w',
    KeyE: 'e',
    KeyR: 'r', 
    KeyT: 't', 
    KeyY: 'y', 
    KeyU: 'u', 
    KeyI: 'i', 
    KeyO: 'o', 
    KeyP: 'p', 
    BracketLeft: '[', 
    BracketRight: ']', 
    Backslash: '|' , 
    CapsLock: 'CapsLock',
    KeyA: 'a', 
    KeyS: 's', 
    KeyD: 'd', 
    KeyF: 'f', 
    KeyG: 'g', 
    KeyH: 'h', 
    KeyJ: 'j', 
    KeyK: 'k', 
    KeyL: 'l', 
    Semicolon: ';', 
    Quote: "'", 
    Enter: 'enter', 
    ShiftLeft: 'shift',
    KeyZ: 'z', 
    KeyX: 'x', 
    KeyC: 'c', 
    KeyV: 'v', 
    KeyB: 'b', 
    KeyN: 'n', 
    KeyM: 'm', 
    Comma: ',', 
    Period: '.', 
    Slash: '/', 
    ShiftRight: 'shift', 
    ControlLeft: 'ctrl', 
    MetaLeft: 'win', 
    AltLeft: 'alt', 
    Space: 'space', 
    AltRight: 'alt', 
    ControlRight: 'ctrl', 
    ArrowLeft: 'arrw l', 
    ArrowUp: 'arrw u', 
    ArrowDown: 'arrw d', 
    ArrowRight: 'arrw r',
};