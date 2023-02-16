var pokemons;

//Traemos la primera generacion (151 pokemons) aunque podriamos traer hasta 1000000
let url = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";

let getPokemonInfo = async(url) => {
    try{
        let respuesta = await fetch(url);
        let datos = await respuesta.json();
        pokemons.push(datos);
    } catch{
        console.log(error);
    }
}

// Funcion que hace peticion al servidor para pillar la informacion de los pokemons, solo se llama una vez al cargar la web y al cambiar el numero de pokemons
let getPokemons = async() => {
    try{
        pokemons = new Array();
        let respuesta = await fetch(url);
        let datos = await respuesta.json();
        let lista = datos.results;

        for (let pokemon of lista) {
            await getPokemonInfo(pokemon.url);
        }

        await selectPokemons();
        
    } catch{
        console.log(error);
    }
}

// Funcion usada para actualizar el select de los nombres de los pokemons, se llamará cuando se
//  seleccione un tipo de pokemon para solo mostrar los pokemons de ese tipo en el select
let selectPokemons = async() => {

    document.querySelector('#formularioTarjeta').innerHTML += `<img id="opacity" src="../img/pokemons.jpg" alt="pokemon">`;

    let tipoBuscado = document.getElementById("pokemonTipo").value;
    let nombreBuscado = document.getElementById("pokemon").value;

    document.querySelector('#pokemon').innerHTML = '<option value="default">Selecciona un Pokemon</option>';
    
    // Cuando actualizamos el select nos aseguramos de mantener seleccionado el pokemon 
    // que ya habia sido seleccionado por el usuario
    pokemons.forEach((poke) => {

        if (tipoBuscado == "default" || ( poke.types.length == 2 && ( poke.types[0].type.name == tipoBuscado || poke.types[1].type.name == tipoBuscado) 
        || poke.types.length == 1 && poke.types[0].type.name == tipoBuscado )) {
            if (nombreBuscado == poke.name) {
                document.querySelector('#pokemon').innerHTML += `<option selected value=${poke.name}>${poke.name}</option>`; 

            }else{
                document.querySelector('#pokemon').innerHTML += `<option value=${poke.name}>${poke.name}</option>`; 
            }
            
        }
        
    })
}

// Funcion que muestra las carpetas de los pokemons que cumplen las condiciones del formulario
let pintarPokemons = async() =>{

    let nombreBuscado = document.getElementById("pokemon").value;
    let tipoBuscado = document.getElementById("pokemonTipo").value;
    await selectPokemons();
    
    // Filtro por tipo
    let vectorFilterTipo = pokemons.filter( item => tipoBuscado == "default" ||
        ( item.types.length == 2 && ( item.types[0].type.name == tipoBuscado || item.types[1].type.name == tipoBuscado) 
        || item.types.length == 1 && item.types[0].type.name == tipoBuscado ));
    
    //Filtro por nombre
    let vectorFilter = vectorFilterTipo.filter(item => item.name.includes(nombreBuscado) || nombreBuscado == "default");

    // Si el vector de pokemons despues de filtrar por nombre es vacio pero tenemos seleccionado un tipo entonces devolvemos los pokemons de ese tipo
    if(  vectorFilter.length == 0 && tipoBuscado != "default"){
        vectorFilter = vectorFilterTipo;
    }

    // Pintamos una a una las tarjetas de los pokemons que cumplen los filtros
    document.querySelector('#formularioTarjeta').innerHTML = '';
    vectorFilter.forEach((poke) => {
        document.querySelector('#formularioTarjeta').innerHTML += `<div id="tarjetas"><p>${poke.name}</p><img src="${poke.sprites.front_shiny}" alt=""></div>`;
    })
}

let cambiarNumPokemon = async() =>{
    pokemons = new Array();
    let numPokemonBuscar = document.getElementById("numPokemon").value;
    url = "https://pokeapi.co/api/v2/pokemon?limit=" + numPokemonBuscar + "&offset=0";
    await getPokemons();

    await pintarPokemons();
}

document.querySelector('#pokemonTipo').onchange = pintarPokemons;
document.querySelector('#pokemon').onchange = pintarPokemons;
document.querySelector('#numPokemon').onchange = cambiarNumPokemon;
