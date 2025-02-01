(function () {

    const lat = 19.001634;
    const lng = -98.2044694;
    const mapa = L.map('mapa').setView([lat, lng], 12);
    let marker;

    //usar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    //pin
    marker = new L.marker([lat, lng], {
        draggable: true,//p mover el pin
        autoPan: true//centra el mapa
    }).addTo(mapa);

    //latitud y longitud
    marker.on('moveend', function (evt) {
        marker = evt.target;
        const posicion = marker.getLatLng();
        mapa.panTo(L.latLng(posicion.lat, posicion.lng));

        //obtener calle al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {
            marker.bindPopup(resultado.address.LongLabel);
            console.log(resultado);
            //llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';

        });
    });

})()