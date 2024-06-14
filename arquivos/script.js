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
        return this.anotacoes;
    }

    setAnotacoes(novasAnotacoes) {
        this.anotacoes = novasAnotacoes;
    }

    exibirCliente() {
        return `Nome: ${this.nome}\nCPF: ${this.cpf}\nEndereço: ${this.endereco}\nAnotações: ${this.anotacoes}`;
    }

    listarCliente() {
        const elemento = document.createElement("div");
        elemento.className = "cliente";

        const info = document.createElement("div");
        info.textContent = this.exibirCliente();

        const acoes = document.createElement("div");
        acoes.className = "acoes";

        const btnEditar = document.createElement("button");
        btnEditar.className = "editar";
        btnEditar.innerHTML = "Editar";
        btnEditar.onclick = () => {
            window.location.href = `editar.html?cpf=${this.cpf}`;
        };

        const btnDeletar = document.createElement("button");
        btnDeletar.className = "deletar";
        btnDeletar.innerHTML = "Deletar";
        btnDeletar.onclick = () => {
            deletarCliente(this.cpf);
        };

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnDeletar);

        elemento.appendChild(info);
        elemento.appendChild(acoes);

        return elemento;
    }
}

function filtrarClientes() {
    const input = document.getElementById("campoPesquisa");
    const filter = input.value.toUpperCase();
    const lista = document.getElementById("guestList");
    const clientes = lista.getElementsByClassName("cliente");

    for (let i = 0; i < clientes.length; i++) {
        const txtValue = clientes[i].textContent || clientes[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            clientes[i].style.display = "";
        } else {
            clientes[i].style.display = "none";
        }
    }
}

function cadastrarCliente() {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const endereco = document.getElementById("endereco").value;
    const anotacoes = document.getElementById("anotacoes").value;

    fetch("http://localhost/users/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            cpf: cpf,
            endereco: endereco,
            anotacoes: anotacoes
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar cliente");
        }
        return response.json();
    })
    .then(data => {
        console.log("Cliente cadastrado com sucesso:", data);
        // Limpar campos do formulário ou outra ação desejada após o cadastro
        document.getElementById("nome").value = "";
        document.getElementById("cpf").value = "";
        document.getElementById("endereco").value = "";
        document.getElementById("anotacoes").value = "";
    
    })
    .catch(error => console.error("Erro ao cadastrar cliente:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    const btnCadastrar = document.getElementById("enviar");
    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarCliente);
    }
});
function carregarClientes() {
    fetch("http://localhost/users")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na rede");
            }
            return response.json();
        })
        .then(clientes => {
            const guestList = document.getElementById("guestList");
            guestList.innerHTML = "";
            clientes.forEach(dadosCliente => {
                let cliente = new Cliente(
                    dadosCliente.nome,
                    dadosCliente.cpf,
                    dadosCliente.endereco,
                    dadosCliente.anotacoes
                );
                const elementoCliente = cliente.listarCliente();

                // Configuração do botão de deletar
                const btnDeletar = elementoCliente.querySelector(".deletar");
                btnDeletar.onclick = () => {
                    deletarCliente(cliente.getCPF());
                };

                guestList.appendChild(elementoCliente);
            });
        })
        .catch(error => console.error("Erro ao carregar dados:", error));
}

function deletarCliente(cpf) {
    fetch(`http://localhost/users`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cpf: cpf
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao deletar cliente");
        }
        return response.json();
    })
    .then(data => {
        console.log("Cliente deletado com sucesso:", data);
        carregarClientes();
    })
    .catch(error => console.error("Erro ao deletar cliente:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    const btnCadastrar = document.getElementById("btnCadastrar");
    if (btnCadastrar) {
        btnCadastrar.addEventListener("click", cadastrarCliente);
    }

    carregarClientes();
});

// Função para enviar os dados de edição para o servidor
function enviarDadosEdicao() {
    // Captura o CPF da URL
    const params = new URLSearchParams(window.location.search);
    const cpf = params.get('cpf');

    // Captura o campo a ser editado e o novo valor
    const campo = document.getElementById("campo").value;
    const novoValor = document.getElementById("novoValor").value;

    // Monta o corpo da requisição com os dados a serem atualizados
    const body = {};
    body.cpf = cpf;
    body[campo] = novoValor;

    fetch(`http://localhost/users`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao editar cliente");
        }
        return response.json();
    })
    .then(data => {
        console.log(`Cliente (${cpf}) atualizado com sucesso:`, data);
        // Redireciona para a página de clientes após a edição
        window.location.href = "clientes.html";
    })
    .catch(error => console.error(`Erro ao editar cliente (${cpf}):`, error));
}
