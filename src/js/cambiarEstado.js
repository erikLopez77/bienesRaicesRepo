(function () {
    const cambiarEstadoBtns = document.querySelectorAll('.cambiar-estado');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    cambiarEstadoBtns.forEach(btn => {
        btn.addEventListener('click', cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(e) {
        const { propiedadId: id } = e.target.dataset;
        try {
            const url = `/propiedades/${id}`;

            const respuesta = fetch(url, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
})()