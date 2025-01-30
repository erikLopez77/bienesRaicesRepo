(function () {

    const lat = 19.001634;
    const lng = -98.2044694;
    const mapa = L.map('mapa').setView([lat, lng], 12);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()