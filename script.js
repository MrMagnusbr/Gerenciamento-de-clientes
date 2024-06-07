class Cliente {
    constructor(nome, cpf, endereco, anotacoes) {
        this.nome = nome;
        this.cpf = cpf;
        this.endereco = endereco;
        this.anotacoes = anotacoes;
    }
    getNome() {
        return this.nome;
    }
    setNome(novoNome) {
        this.nome = novoNome;
    }
    getCPF() {
        return this.cpf;
    }
    setCPF(novoCPF) {
        this.cpf = novoCPF;
    }
    getEndereco() {
        return this.endereco;
    }
    setEndereco(novoEndereco) {
        this.endereco = novoEndereco;
    }
    getAnotacoes() {
        if (!isNaN(this.anotacoes)) {
            return this.anotacoes;
        } else {
            return "Sem anotações";
        }
    }
    setAnotacoes(novasAnotacoes) {
        this.anotacoes = novasAnotacoes;
    }
    exibirCliente() {
        return ` Nome: ${this.nome}\n CPF: ${this.cpf}\n Endereço: ${this.endereco}\n Anotações: ${this.anotacoes}`;
    }
    listarCliente() {
        const elemento = document.createElement("div");
        elemento.textContent = this.exibirCliente();
        elemento.className = "cliente";
        return elemento;
    }
}

function filtrarClientes() {
    var input, filter, lista, cliente, i, txtValue;
    input = document.getElementById("campoPesquisa");
    filter = input.value.toUpperCase();
    lista = document.getElementById("guestList");
    cliente = lista.getElementsByClassName("cliente");

    for (i = 0; i < cliente.length; i++) {
        txtValue = cliente[i].textContent || cliente[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            cliente[i].style.display = "";
        } else {
            cliente[i].style.display = "none";
        }
    }
}

function enviarDados() {
    let nome = document.getElementById("nome").value;
    let cpf = document.getElementById("cpf").value;
    let endereco = document.getElementById("endereco").value;
    let anotacoes = document.getElementById("anotacoes").value;

    let cliente = new Cliente(nome, cpf, endereco, anotacoes);
    listaClientes.push(cliente);
    guestList.appendChild(cliente.listarCliente());

    // Limpar campos
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("anotacoes").value = "";
    alert("Cadastro realizado!!");
}

let listaClientes = [];
let guestList;

document.addEventListener('DOMContentLoaded', () => {
    let enviar = document.getElementById("enviar");
    guestList = document.getElementById("guestList"); // Deve ser uma div ou ul

    enviar.addEventListener("click", enviarDados);
});
