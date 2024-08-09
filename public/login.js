document.getElementById('login-btn').addEventListener('click', () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = 'gerenciamentoDeClientes.html';
        })
        .catch((error) => {
            alert('Erro ao logar: ' + error.message);
        });
});
