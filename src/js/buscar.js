
document.addEventListener('DOMContentLoaded', function () {

    const buscaForm = document.querySelector("#buscar");
    buscaForm.addEventListener('submit', async (e) => {
        console.log('1PK');
        e.preventDefault();
        const id = document.querySelector('input[name="id"]').value
        const termino = buscaForm.querySelector('input[name="termino"]').value;

        try {
            console.log('2PK');
            const url = `/propiedad/buscar`;
            const csrfToken = document.querySelector('input[name="_csrf"]').value;
            const solicitud = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-Token': csrfToken
                }, body: JSON.stringify({ id, termino })
            })
            if (solicitud.ok) {
                console.log('3PK');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    })
})()