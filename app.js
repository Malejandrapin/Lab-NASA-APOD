// Configuracion de la API de NASA
const API_KEY = 'iyvf3MyeENqqFaIfTiftBoruSDVA2kOaiKqvdYRa';
const API_URL = 'https://api.nasa.gov/planetary/apod';

//Traemos los elementos del DOM
const seleccionFecha = document.getElementById('seleccion-fecha');
const titulo = document.getElementById('titulo');
const explicacion = document.getElementById('explicacion-imagen');
const imagen = document.getElementById('contenedor-imagen');
const errorMensaje = document.getElementById('mensaje-error');
const botonFavoritos = document.getElementById('btn-favoritos');
const listaFavoritos = document.getElementById('lista-favoritos');
const botonBuscar = document.getElementById('btn-buscar');


let apodActual = null;

// botón de buscar APOD por fecha
botonBuscar.addEventListener('click', () => {
    const fechaSeleccionada = seleccionFecha.value;
    if (fechaSeleccionada) {
        cargarAPOD(fechaSeleccionada);
    } else {
        alert('Por favor, selecciona una fecha válida.');
    }
});

// Inicializamos la aplicación, cargamos el APOD del día actual y los favoritos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date().toISOString().split('T')[0];
    seleccionFecha.max = hoy;
    seleccionFecha.value = hoy;
    cargarFavoritos();
});

// Función para cargar el APOD de una fecha específica
async function cargarAPOD(fecha) {
    showLoader(true);
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&date=${fecha}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        apodActual = data;
        mostrarAPOD(data);
    } catch (error) {
        console.error('Error al cargar el APOD:', error);
        errorMensaje.textContent = 'Error al cargar el APOD. Por favor, inténtalo de nuevo.';
    } finally {
        showLoader(false);
    }
}

// Función para mostrar el APOD en la página
function mostrarAPOD(data) {
    titulo.textContent = data.title;
    explicacion.textContent = data.explanation;
    seleccionFecha.value = data.date;

    imagen.innerHTML = "";
    if (data.media_type === 'image') {
        imagen.innerHTML = `<img src="${data.url}" alt="${data.title}" width="100%" height="auto"> `;
    } else {
        imagen.innerHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
    }
}
// Funcion para agregar a favoritos
botonFavoritos.addEventListener('click', () => {
    if (!apodActual) {
        alert('No hay una imagen cargada para agregar a favoritos.');
        return;
    }
    let favorito = JSON.parse(localStorage.getItem('nasa_favs')) || [];
    if (!favorito.some(item => item.date === apodActual.date)) {
        favorito.push({
            date: apodActual.date,
            title: apodActual.title,
            media_type: apodActual.media_type
        });
        localStorage.setItem('nasa_favs', JSON.stringify(favorito));
        cargarFavoritos();
        alert('¡Agregado a favoritos!');
    } else {
        alert('¡Ya está en favoritos!');
    }
});
// Función para cargar favoritos desde localStorage y mostrarlos en la lista
function cargarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('nasa_favs')) || [];
    listaFavoritos.innerHTML = '';
    favoritos.forEach((fav, index) => {
        const li = document.createElement('li');
        const spanText = document.createElement('span');
        spanText.textContent = `${fav.date} - ${fav.title} `;
        spanText.style.cursor = 'pointer';
        spanText.style.flexGrow = '1';

        spanText.addEventListener('click', () => {
            cargarAPOD(fav.date);
        });

        const btnEliminar = document.createElement('button');
        btnEliminar.id = 'btnEliminar';
        btnEliminar.textContent = '❌';

        btnEliminar.addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarFavorito(index);
        });
        li.appendChild(spanText);
        li.appendChild(btnEliminar);
        listaFavoritos.appendChild(li);
    });

}
// Función para eliminar un favorito
function eliminarFavorito(index) {
    let favorito = JSON.parse(localStorage.getItem('nasa_favs')) || [];
    favorito.splice(index, 1);
    localStorage.setItem('nasa_favs', JSON.stringify(favorito));
    cargarFavoritos();
} 
 function showLoader(show) {
        const loader = document.getElementById('loader');
        loader.style.display = show ? 'block' : 'none';
    }
