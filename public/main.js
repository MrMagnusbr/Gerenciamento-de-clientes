"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");
const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const openDetailsModal = (client) => {
  document.getElementById("detailNome").textContent = client.nome;
  document.getElementById("detailContato").textContent = client.contato;
  document.getElementById("detailCEP").textContent = client.cep;
  document.getElementById("detailCpf").textContent = client.cpf;
  document.getElementById("detailNascimento").textContent = client.nascimento;
  document.getElementById("detailBairro").textContent = client.bairro;
  document.getElementById("detailEndereco").textContent = client.endereco;
  document.getElementById("detailNotas").textContent = client.notas;
  document.getElementById("detailCidade").textContent = client.cidade; // Adicionado
  document.getElementById("detailEstado").textContent = client.estado; // Adicionado
  document.getElementById("detailsModal").classList.add("active");
};

const closeDetailsModal = () =>
  document.getElementById("detailsModal").classList.remove("active");

function uniqueID() {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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

const readClient = async () => {
  try {
    const snapshot = await database.ref("clients").once("value");
    const data = snapshot.val()
      ? Object.entries(snapshot.val()).map(([index, client]) => ({
          index,
          ...client,
        }))
      : [];
    console.log("Clientes lidos do banco de dados:", data);
    return data;
  } catch (error) {
    console.error("Erro ao ler clientes: ", error.message);
    throw error;
  }
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
const isValidCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, ""); // Remove caracteres não numéricos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0,
    resto;
  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
};
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPhone = (phone) => {
  const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[-\s]?\d{4}$/;
  return regex.test(phone);
};
const fetchCityAndState = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) {
      alert("CEP inválido!");
      return false;
    } else {
      document.getElementById("cidade").value = data.localidade;
      document.getElementById("estado").value = data.uf;
      return true;
    }
  } catch (error) {
    alert("Erro ao buscar o CEP!");
    return false;
  }
};

const isValidCEP = async (cep) => {
  const regex = /^\d{5}-?\d{3}$/;
  if (!regex.test(cep)) {
    alert("CEP inválido!");
    return false;
  }
  return await fetchCityAndState(cep);
};

const validateContact = (contact) => {
  if (/\D/.test(contact)) {
    // Se contém letras, considere como e-mail
    if (!isValidEmail(contact)) {
      alert("E-mail inválido!");
      return false;
    }
  } else {
    // Se contém apenas números, considere como telefone
    if (!isValidPhone(contact)) {
      alert("Número de telefone inválido!");
      return false;
    }
  }
  return true;
};
const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
  document.getElementById("nome").dataset.index = "new";
  document.querySelector(".modal-header>h2").textContent = "Novo Cliente";
};
const saveClient = async () => {
    if (!isValidFields()) return;

    const cpf = document.getElementById("cpf").value;
    const contato = document.getElementById("contato").value;
    const cep = document.getElementById("CEP").value;
  
    if (!isValidCPF(cpf)) {
      alert("CPF inválido!");
      return;
    }
  
    if (!validateContact(contato)) {
      return;
    }
  
    if (!(await isValidCEP(cep))) {
      return;
    }
  
    const client = {
      nome: document.getElementById("nome").value,
      contato: contato,
      cep: cep,
      cidade: document.getElementById("cidade").value,
      estado: document.getElementById("estado").value,
      cpf: cpf,
      endereco: document.getElementById("endereco").value,
      notas: document.getElementById("notas").value,
      bairro: document.getElementById("bairro").value,
      nascimento: document.getElementById("nascimento").value,
    };
  
    const index = document.getElementById("nome").dataset.index;
    if (index === "new") {
      createClient(client);
      closeModal();
    } else {
      updateClient(index, client);
      closeModal();
    }
};


const createRow = (client) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.contato}</td>
        <td>${client.cpf}</td>
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
  document.getElementById("contato").value = client.contato;
  document.getElementById("CEP").value = client.cep;
  document.getElementById("cpf").value = client.cpf;
  document.getElementById("endereco").value = client.endereco;
  document.getElementById("notas").value = client.notas;
  document.getElementById("bairro").value = client.bairro;
  document.getElementById("nascimento").value = client.nascimento;
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
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", openModal);
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("salvar").addEventListener("click", saveClient);
document
  .querySelector("#tableClient>tbody")
  .addEventListener("click", editDelete);
document.getElementById("cancelar").addEventListener("click", closeModal);
document
  .getElementById("detailsModalClose")
  .addEventListener("click", closeDetailsModal);
document
  .getElementById("detailsClose")
  .addEventListener("click", closeDetailsModal);
