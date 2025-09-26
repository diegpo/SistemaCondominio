document.addEventListener('DOMContentLoaded', () => {
    const btnAcessar = document.getElementById('btnAcessar');
    const loginForm = document.getElementById('loginForm');
    const voltar = document.getElementById('voltar');
    const entrar = document.getElementById('entrar');
    const esqueceu = document.getElementById('esqueceu');

    if (btnAcessar && loginForm) {
        btnAcessar.addEventListener('click', () => {
            btnAcessar.style.display = 'none';
            loginForm.classList.add('active');
        });
    }

    if (voltar && btnAcessar && loginForm) {
        voltar.addEventListener('click', () => {
            loginForm.classList.remove('active');
            setTimeout(() => { btnAcessar.style.display = 'inline-block'; }, 500);
        });
    }

    if (entrar) {
        entrar.addEventListener('click', () => { window.location.href = "dashboard.html"; });
    }

    if (esqueceu) {
        esqueceu.addEventListener('click', () => { alert('Recuperação de senha não implementada.'); });
    }
});
