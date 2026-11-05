const URL_API = "https://fipe.api.br/api/v2/cars"; // endereço base da API (só carros)

async function buscar(url) { // função auxiliar: faz o fetch e devolve os dados
    const response = await fetch(url); // chama a API e espera a resposta
    if (!response.ok) { // se a resposta não for sucesso
        throw new Error("Erro ao conectar a API da FIPE"); // cria um erro, que vai para o catch de quem chamou
    }
    return await response.json(); // converte a resposta em array/objeto e devolve
}

function preencherSelect(id, itens, texto) { // função auxiliar: coloca os itens dentro de um <select>
    const select = document.getElementById(id); // pega o select pelo id
    select.innerHTML = '<option value="">' + texto + '</option>'; // limpa e cria a primeira opção ("Selecione...")
    itens.forEach(i => { // percorre cada item recebido da API
        const option = document.createElement("option"); // cria uma opção
        option.value = i.code; // o valor da opção é o código (usado na próxima consulta)
        option.textContent = i.name; // o texto da opção é o nome que o usuário vê
        select.appendChild(option); // coloca a opção dentro do select
    });
}

async function carregarMarcas() { // chamada pelo botão "Carregar marcas"
    const status = document.getElementById("status"); // pega a div de mensagens
    status.textContent = "Carregando marcas..."; // avisa que está buscando
    try { // tenta executar; se der erro, cai no catch
        const marcas = await buscar(URL_API + "/brands"); // busca a lista de marcas
        console.log(marcas); // mostra no console (F12) para conferir
        preencherSelect("marcas", marcas, "Selecione a marca"); // coloca as marcas no select
        status.textContent = ""; // limpa a mensagem
    } catch (error) { // se deu erro
        status.textContent = error.message; // mostra o erro na tela
    }
}

async function carregarModelos() { // chamada quando escolhe uma marca
    const status = document.getElementById("status"); // pega a div de mensagens
    const marca = document.getElementById("marcas").value; // pega o código da marca escolhida
    document.getElementById("anos").innerHTML = ""; // limpa os anos da busca anterior
    document.getElementById("resultado").textContent = ""; // limpa o resultado anterior
    if (!marca) { // se não escolheu nenhuma marca
        return; // para por aqui
    }
    status.textContent = "Carregando modelos..."; // avisa que está buscando
    try { // tenta executar
        const modelos = await buscar(URL_API + "/brands/" + marca + "/models"); // busca os modelos da marca
        console.log(modelos); // mostra no console para conferir
        preencherSelect("modelos", modelos, "Selecione o modelo"); // coloca os modelos no select
        status.textContent = ""; // limpa a mensagem
    } catch (error) { // se deu erro
        status.textContent = error.message; // mostra o erro na tela
    }
}

async function carregarAnos() { // chamada quando escolhe um modelo
    const status = document.getElementById("status"); // pega a div de mensagens
    const marca = document.getElementById("marcas").value; // pega o código da marca
    const modelo = document.getElementById("modelos").value; // pega o código do modelo
    document.getElementById("resultado").textContent = ""; // limpa o resultado anterior
    if (!modelo) { // se não escolheu nenhum modelo
        return; // para por aqui
    }
    status.textContent = "Carregando anos..."; // avisa que está buscando
    try { // tenta executar
        const anos = await buscar(URL_API + "/brands/" + marca + "/models/" + modelo + "/years"); // busca os anos do modelo
        console.log(anos); // mostra no console para conferir
        preencherSelect("anos", anos, "Selecione o ano"); // coloca os anos no select
        status.textContent = ""; // limpa a mensagem
    } catch (error) { // se deu erro
        status.textContent = error.message; // mostra o erro na tela
    }
}

async function mostrarPreco() { // chamada quando escolhe um ano
    const status = document.getElementById("status"); // pega a div de mensagens
    const marca = document.getElementById("marcas").value; // pega o código da marca
    const modelo = document.getElementById("modelos").value; // pega o código do modelo
    const ano = document.getElementById("anos").value; // pega o código do ano
    if (!ano) { // se não escolheu nenhum ano
        return; // para por aqui
    }
    status.textContent = "Carregando preço..."; // avisa que está buscando
    try { // tenta executar
        const carro = await buscar(URL_API + "/brands/" + marca + "/models/" + modelo + "/years/" + ano); // busca o preço do carro
        console.log(carro); // mostra no console para conferir
        document.getElementById("resultado").textContent = // escreve o resultado na tela
            carro.brand + " - " + carro.model + " - " + carro.modelYear + " - " + carro.fuel + " - " + carro.price; // marca, modelo, ano, combustível e preço
        status.textContent = ""; // limpa a mensagem
    } catch (error) { // se deu erro
        status.textContent = error.message; // mostra o erro na tela
    }
}
