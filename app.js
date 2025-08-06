//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.

let amigos = [];

// função para adicionarmos os amigos
window.adicionarAmigo = function() {
    let input = document.getElementById('amigo');
    let nome = input.value.trim(); //esse trim vao eliminar os espaços que tiver
    
    // verificando se foi digitado um nome no campo 
    if (!nome) {
        alert('Opa! Preciso que insira um nome válido!');
        return;
    }
    
    // Adiciona ao array
    amigos.push(nome);
    
    // vamos atualizar a tela para ver o amigo inserido
    atualizarListaAmigos();
    
    // Limpa o campo que acabei de digitar o nome ficando disponivel para um novo nome a ser adicionado.
    input.value = '';
    input.focus();
};

function atualizarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = ''; 
    
    amigos.forEach(amigo => {
        let item = document.createElement('li');
        item.textContent = amigo;
        lista.appendChild(item);
    });
}

// Função para sortear
window.sortearAmigo = function() {
    if (amigos.length === 0) {
        alert('Adicione amigos antes de sortear!');
        return;
    }
    
    let indice = Math.floor(Math.random() * amigos.length);
     sorteado = amigos[indice];
    
    document.getElementById('resultado').textContent = 
        `Amigo secreto: ${sorteado}`;
};