(function () {
    const cambiarEstadoBtns = document.querySelectorAll('.cambiar-estado');

    cambiarEstadoBtns.forEach(btn => {
        btn.addEventListener('click', cambiarEstadoPropiedad)
    })

    function cambiarEstadoPropiedad(e) {
        const { propiedadId: id } = e.target.dataset;

    }
})()