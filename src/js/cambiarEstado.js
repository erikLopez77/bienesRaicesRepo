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

            const respuesta = await fetch(url, {
                method: 'PUT',
                headers: {// ese nombre en mayus espera el csurf en headers
                    'CSRF-Token': token
                }
            });
            const resultado = await respuesta.json();
            console.log(resultado);

        } catch (error) {
            console.log(error);
        }
    }
})()