"use strict";

const openModal = () => document.getElementById("modal").classList.add("active");
const closeModal = () => {
    clearFields();
    document.getElementById("modal").classList.remove("active");
};

const openDetailsModal = (client) => {
    document.getElementById("detailNome").textContent = client.nome;
    document.getElementById("detailEmail").textContent = client.email;
    document.getElementById("detailCelular").textContent = client.celular;
    document.getElementById("detailCidade").textContent = client.cidade;
    document.getElementById("detailCpf").textContent = client.cpf;
    document.getElementById("detailEndereco").textContent = client.endereco;
    document.getElementById("detailNotas").textContent = client.notas;
    document.getElementById("detailsModal").classList.add("active");
};

const closeDetailsModal = () => document.getElementById("detailsModal").classList.remove("active");

let indice = 0;

function uniqueID() {
    return `id-${indice++}`;
}

const updateClient = (index, client) => {
    database
        .ref("clients/" + index)
        .set(client)
        .then(() => {
            updateTable();
        })
        .catch((error) => {
            console.error("Erro ao atualizar cliente: ", error);
        });
};

const readClient = () => {
    return new Promise((resolve, reject) => {
        database
            .ref("clients")
            .once("value")
            .then((snapshot) => {
                const data = snapshot.val()
                    ? Object.entries(snapshot.val()).map(([index, client]) => ({
                          index,
                          ...client,
                      }))
                    : [];
                console.log("Clientes lidos do banco de dados:", data);
                resolve(data);
            })
            .catch((error) => {
                console.error("Erro ao ler clientes:", error);
                reject(error);
            });
    });
};

const createClient = (client) => {
    const id = uniqueID();
    database
        .ref("clients/" + id)
        .set({ ...client, index: id })
        .then(() => {
            updateTable();
        })
        .catch((error) => {
            console.error("Erro ao criar cliente: ", error);
        });
};

const isValidFields = () => {
    return document.getElementById("form").reportValidity();
};

const clearFields = () => {
    const fields = document.querySelectorAll(".modal-field");
    fields.forEach((field) => (field.value = ""));
    document.getElementById("nome").dataset.index = "new";
    document.querySelector(".modal-header>h2").textContent = "Novo Cliente";
};

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            celular: document.getElementById("celular").value,
            cidade: document.getElementById("cidade").value,
            cpf: document.getElementById("cpf").value,
            endereco: document.getElementById("endereco").value,
            notas: document.getElementById("notas").value,
        };
        const index = document.getElementById("nome").dataset.index;
        if (index == "new") {
            createClient(client);
            closeModal();
        } else {
            updateClient(index, client);
            closeModal();
        }
    }
};


const createRow = (client) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${client.index}">Editar</button>
            <button type="button" class="button red" id="delete-${client.index}">Excluir</button>
            <button type="button" class="button white" id="moreInfo-${client.index}">Detalhes</button>
        </td>
    `;
    document.querySelector("#tableClient>tbody").appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll("#tableClient>tbody tr");
    rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
    readClient()
        .then((clients) => {
            clearTable();
            clients.forEach((client) => createRow(client));
        })
        .catch((error) => console.error("Erro ao atualizar a tabela: ", error));
};

const fillFields = (client) => {
    document.getElementById("nome").value = client.nome;
    document.getElementById("email").value = client.email;
    document.getElementById("celular").value = client.celular;
    document.getElementById("cidade").value = client.cidade;
    document.getElementById("cpf").value = client.cpf;
    document.getElementById("endereco").value = client.endereco;
    document.getElementById("notas").value = client.notas;
    document.getElementById("nome").dataset.index = client.index;
};

const editClient = (id) => {
    console.log("Editando cliente com ID:", id);
    readClient()
        .then((clients) => {
            const client = clients.find((client) => client.index === id);
            if (client) {
                fillFields(client);
                document.querySelector(
                    ".modal-header>h2"
                ).textContent = `Editando ${client.nome}`;
                openModal();
            } else {
                console.error("Cliente não encontrado.");
            }
        })
        .catch((error) => console.error("Erro ao ler clientes:", error));
};

const deleteClient = (id) => {
    console.log("Excluindo cliente com ID:", id);
    database
        .ref("clients/" + id)
        .remove()
        .then(() => updateTable())
        .catch((error) => console.error("Erro ao deletar cliente: ", error));
};

const showDetails = (id) => {
    console.log("Exibindo detalhes do cliente com ID:", id);
    readClient()
        .then((clients) => {
            const client = clients.find((client) => client.index === id);
            if (client) {
                openDetailsModal(client);
            } else {
                console.error("Cliente não encontrado.");
            }
        })
        .catch((error) => console.error("Erro ao ler clientes:", error));
};

const editDelete = (event) => {
    if (event.target.type === "button") {
        const [action, ...idParts] = event.target.id.split("-");
        const id = idParts.join("-"); // Combine as partes do ID novamente
        console.log("Ação:", action, "ID:", id);
        if (action === "edit") {
            editClient(id);
        } else if (action === "delete") {
            readClient()
                .then((clients) => {
                    const client = clients.find((client) => client.index === id);
                    if (client) {
                        const response = confirm(
                            `Deseja realmente excluir o cliente ${client.nome}`
                        );
                        if (response) {
                            deleteClient(id);
                        }
                    } else {
                        console.error("Cliente para exclusão não encontrado.");
                    }
                })
                .catch((error) =>
                    console.error("Erro ao encontrar cliente para excluir:", error)
                );
        } else if (action === "moreInfo") {
            showDetails(id);
        }
    }
};

updateTable();

// Eventos
document.getElementById("cadastrarCliente").addEventListener("click", openModal);
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("salvar").addEventListener("click", saveClient);
document.querySelector("#tableClient>tbody").addEventListener("click", editDelete);
document.getElementById("cancelar").addEventListener("click", closeModal);
document.getElementById("detailsModalClose").addEventListener("click", closeDetailsModal);
document.getElementById("detailsClose").addEventListener("click", closeDetailsModal);
