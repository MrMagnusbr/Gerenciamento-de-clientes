function validarSenha(senha) {
    if (senha.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres.');
    }
    if (senha.length > 10) {
        throw new Error('A senha deve ter no máximo 10 caracteres.');
    }
    if (!/[a-zA-Z]/.test(senha)) {
        throw new Error('A senha deve conter pelo menos uma letra.');
    }
    if (!/[0-9]/.test(senha)) {
        throw new Error('A senha deve conter pelo menos um número.');
    }
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        throw new Error('O email deve ter um formato válido.');
    }
}

// Função para logar usuário
document.getElementById('login-btn').addEventListener('click', () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Redireciona para a página do jogo
            window.location.href = 'gerenciamentoDeClientes.html';
        })
        .catch((error) => {
            alert('Erro ao logar: ' + error.message);
        });
});

// Função para registrar novo usuário
document.getElementById('signup-btn').addEventListener('click', () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    try {
        validarEmail(email);
        validarSenha(password);

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert('Usuário cadastrado com sucesso!');
            })
            .catch((error) => {
                alert('Erro ao cadastrar usuário: ' + error.message);
            });
    } catch (error) {
        alert('Erro de validação: ' + error.message);
    }
});
