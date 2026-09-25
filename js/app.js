document.getElementById('txtBtn').addEventListener('click', cargarTXT);
document.getElementById('jsonBtn').addEventListener('click', cargarJSON);
document.getElementById('apiBTN').addEventListener('click', cargarREST);
document.getElementById('pokeBtn').addEventListener('click', buscarPokemon);

function cargarTXT(e) {
    e.preventDefault();
    fetch('datos.txt')
        .then(function (res) {
            return res.text();
        })
        .then(function (empleados) {
            console.log(empleados);
            // Transformamos el texto plano en una tarjeta bonita con estilo
            document.getElementById('resultado').innerHTML = `
                <div class="info-card">
                    <h4>Datos Cargados desde TXT</h4>
                    <p>${empleados}</p>
                </div>
            `;
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cargarJSON(e) {
    e.preventDefault();
    fetch('empleados.json')
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            let html = '<div class="grid-cards">';
            data.forEach(function (empleado) {
                // Creamos una tarjeta individual (card) para cada empleado del JSON
                html += `
                    <div class="card-item">
                        <h4>👤 ${empleado.nombre}</h4>
                        <p><strong>Puesto:</strong> ${empleado.puesto}</p>
                    </div>
                `;
            });
            html += '</div>';
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(function (error) {
            console.log(error);
        });
}

function cargarREST(e) {
    e.preventDefault();
    fetch('https://picsum.photos/v2/list?page=1&limit=10')
        .then(function (res) {
            return res.json();
        })
        .then(function (imagenes) {
            let html = '<div class="grid-cards">';
            imagenes.forEach(function (imagen) {
                html += `
                    <div class="card-item">
                        <p><strong>Autor:</strong> ${imagen.author}</p>
                        <a target="_blank" href="${imagen.url}" class="link-btn">Ver Imagen</a>
                    </div>
                `;
            });
            html += '</div>';
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function buscarPokemon(e) {
    e.preventDefault();

    const inputVal = document.getElementById('pokemonInput').value;
    const nombrePokemon = inputVal.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultado');

    if (nombrePokemon === '') {
        resultadoDiv.innerHTML = `<p style="color: #ef4444; font-weight: bold; text-align: center;">Por favor, ingresa el nombre o número de un Pokémon.</p>`;
        return;
    }

    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);

        if (!respuesta.ok) {
            throw new Error('Pokémon no encontrado');
        }

        const datos = await respuesta.json();

        let tiposHtml = '';
        datos.types.forEach(t => {
            tiposHtml += `<span class="badge">${t.type.name} </span>`;
        });

        let html = `
            <div class="pokemon-card">
                <h3>${datos.name.toUpperCase()} <small>(ID: ${datos.id})</small></h3>
                <img src="${datos.sprites.front_default}" alt="${datos.name}">
                <p><strong>Tipo(s):</strong> ${tiposHtml}</p>
                <p><strong>Altura:</strong> ${datos.height / 10} m &nbsp;|&nbsp; <strong>Peso:</strong> ${datos.weight / 10} kg</p>
            </div>
        `;

        resultadoDiv.innerHTML = html;

    } catch (error) {
        resultadoDiv.innerHTML = `<p style="color: #ef4444; font-weight: bold; text-align: center;">Error: El Pokémon "${nombrePokemon}" no fue encontrado.</p>`;
        console.log(error);
    }
}