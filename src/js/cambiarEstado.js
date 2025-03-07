(function () {
    const cambiarEstadoBtns = document.querySelectorAll('.cambiar-estado');

    cambiarEstadoBtns.forEach(btn => {
        btn.addEventListener('click', cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(e) {
        const { propiedadId: id } = e.target.dataset;
        try {
            const url = `/propiedades/${id}`;

            const respuesta = fetch(url, {
                method: 'PUT',
            });
        } catch (error) {
            console.log(error);
        }
    }
})()