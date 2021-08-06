const { ipcRenderer, clipboard } = require('electron');

const teclas = document.querySelectorAll('#calculadora span');
let pantalla = document.querySelector('.pantalla p');

const operadores = ['+', '-', '*', '/'];
const operables = [...operadores, ...['.', '=']];

let puntoPresionado = false;
let valorIngresado = pantalla.textContent;

for (let i = 0; i < teclas.length; i++) {
    teclas[i].onclick = presionBoton;    
}

document.addEventListener('keydown', pulsacionTeclas);
document.querySelector('#cerrar').addEventListener('click', cerrarAplicacion);
document.querySelector('#copiar').addEventListener('click', copiarContenido);

function presionTecla(e, tecla) {

    const valorIngresado = pantalla.textContent;
    
    if (tecla.toLowerCase() == 'c') {
        limpiarPantalla();

    } else if (tecla == '=') {
        let ecuacion = valorIngresado;
        const ultimoCaracter = ecuacion[ecuacion.length - 1];

        if (operadores.indexOf(ultimoCaracter) != -1 || ultimoCaracter == '.') {
            ecuacion = ecuacion.replace(/.$/, '');
        }

        if (ecuacion) {
            pantalla.textContent = eval(ecuacion);
        }

        puntoPresionado = false;

    } else if (operadores.indexOf(tecla) != -1) {

        const ultimoCaracter = valorIngresado[valorIngresado.length - 1];

        if (valorIngresado != '' && operadores.indexOf(ultimoCaracter) === -1) {
            pantalla.textContent += tecla;

        } else if (valorIngresado == '' && tecla == '-') {
            pantalla.textContent += tecla;
        }

        if (operadores.indexOf(ultimoCaracter) != -1 && valorIngresado.length > 1) {
            pantalla.textContent = valorIngresado.replace(/.$/, tecla);
        }

        puntoPresionado = false;

    } else if (tecla == '.') {

        if (!puntoPresionado) {
            puntoPresionado = true;
            pantalla.textContent += tecla;
        }

    } else {
        pantalla.textContent += tecla;
    }

    e.preventDefault();
}

function pulsacionTeclas(e) {

    resaltarTecla(e.key);

    if (e.code.indexOf('Numpad') == 0) {
        console.log('Numpad');
        if (e.key == 'Enter') {
            return presionTecla(e, '=');
        }

        presionTecla(e, e.key);
    
    } else if (!isNaN(e.key)) {
        presionTecla(e, e.key);

    } else if (operables.indexOf(e.key) != -1) {
        presionTecla(e, e.key);

    } else if (e.key == 'Backspace') {
        console.log('Backspace');
        pantalla = document.querySelector('.pantalla p');
        valorIngresado = pantalla.textContent;
        const contenido = valorIngresado.split('');
        contenido.pop();
        pantalla.textContent = contenido.join('');

    } else if (e.key.toLowerCase() == 'c') {
        limpiarPantalla();
    
    } else if (e.key == 'Enter') {
        presionTecla(e, '=');
    }
}

function presionBoton(e) {
    presionTecla(e, e.target.innerHTML);
}

function limpiarPantalla() {
    pantalla.textContent = '';
    puntoPresionado = false;
}

function resaltarTecla(tecla) {
    const teclaPresionada = document.querySelector(`span[data-tecla="${tecla}"]`);

    if (teclaPresionada) {
        teclaPresionada.classList.add('activa');
        setTimeout(() => {
            teclaPresionada.classList.remove('activa');
        }, 250);
    }
}

function copiarContenido() {
    const contenidoPantalla = pantalla.textContent;
    if (contenidoPantalla != '') {
        clipboard.writeText(contenidoPantalla);
    }
}

function cerrarAplicacion() {
    ipcRenderer.send('finalizar-aplicacion');
}