"use strict";

const openModal = () => document.getElementById("modal").classList.add("active");

const closeModal = () => {
    clearFields();
    document.getElementById("modal").classList.remove("active");
};


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
                console.log("Clientes lidos do banco de dados:", data); // Adicione este log
                resolve(data);
            })
            .catch((error) => {
                console.error("Erro ao ler clientes:", error);
                reject(error);
            });
    });
};

const createClient = (client) => {
    const newClientRef = database.ref("clients").push();
    newClientRef
        .set({ ...client, index: newClientRef.key })
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

//Interação com o layout

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
    document.getElementById("nome").dataset.index = client.index;
};

const editClient = (id) => {
    console.log("Editando cliente com ID:", id); // Adicionado
    readClient().then(clients => {
        const client = clients.find(client => client.index === id);
        if (client) {
            fillFields(client);
            document.querySelector(".modal-header>h2").textContent = `Editando ${client.nome}`;
            openModal();
        } else {
            console.error("Cliente não encontrado.");
        }
    }).catch(error => console.error("Erro ao ler clientes:", error));
};

const deleteClient = (id) => {
    console.log("Excluindo cliente com ID:", id); // Adicionado
    database.ref("clients/" + id).remove()
        .then(() => updateTable())
        .catch(error => console.error("Erro ao deletar cliente: ", error));
};

const editDelete = (event) => {
    if (event.target.type === "button") {
        const [action, id] = event.target.id.split("-");
        console.log("Ação:", action, "ID:", id); // Adicionado
        if (action === "edit") {
            editClient(id);
        } else if (action === "delete") {
            readClient().then(clients => {
                const client = clients.find(client => client.index === id);
                if (client) {
                    const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`);
                    if (response) {
                        deleteClient(id);
                    }
                } else {
                    console.error("Cliente para exclusão não encontrado.");
                }
            }).catch(error => console.error("Erro ao encontrar cliente para excluir:", error));
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
