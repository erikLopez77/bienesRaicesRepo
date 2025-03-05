
(function () {
    const lat = 19.001634;
    const lng = -98.2044694;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 12);
    let markers = new L.FeatureGroup().addTo(mapa);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades';
            const respuesta = await fetch(url);
            const propiedades = await respuesta.json();
            mostrarPropiedades(propiedades);
        } catch (error) {
            console.log(error);
        }
    }
    const mostrarPropiedades = propiedades => {
        propiedades.forEach(propiedad => {
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            }).bindPopup('Información').addTo(mapa)

            markers.addLayer(marker);
        });
    }
    obtenerPropiedades();
})()