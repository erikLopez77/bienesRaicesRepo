
(function () {
    const lat = 19.001634;
    const lng = -98.2044694;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 12);
    let markers = new L.FeatureGroup().addTo(mapa);
    let propiedades = [];
    //filtros
    const filtros = {
        categoria: '',
        precio: ''
    }
    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    })
    const obtenerPropiedades = async () => {
        try {
            const idInput = document.querySelector("#idPer");
            const id = idInput ? idInput.value : null;

            const url = id ? `/api/propiedades?id=${id}` : '/api/propiedades';
            const respuesta = await fetch(url);
            propiedades = await respuesta.json();
            mostrarPropiedades(propiedades);
        } catch (error) {
            console.log(error);
        }
    }//funcion p/ poner pines en el mapa 
    const mostrarPropiedades = propiedades => {
        //limpiar pines previos
        markers.clearLayers();

        propiedades.forEach(propiedad => {
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            }).bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-5">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver propiedad</a>
                `).addTo(mapa)

            markers.addLayer(marker);
        });
    }
    const filtrarPropiedades = () => {
        //filter devuelve un nuevo arreglo a partir del arreglo dado  
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio);
        mostrarPropiedades(resultado);
    }//si el elemento es verdadero se agrega al array
    const filtrarCategoria = propiedad => filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;
    const filtrarPrecio = propiedad => filtros.precio ? propiedad.precioId === filtros.precio : propiedad;
    obtenerPropiedades();
})()