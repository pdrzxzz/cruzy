/**
 * Script para validação em tempo real da correspondência entre senha e confirmação de senha
 * Aplicado no formulário de registro de usuários
 */
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const form = document.querySelector(".validated-form");

/**
 * Valida se a senha e a confirmação de senha correspondem
 * Aplica classes visuais e mensagens de validação personalizadas
 * - Adiciona mensagem de erro se as senhas não corresponderem
 * - Adiciona classes CSS para feedback visual ao usuário
 */
function validatePassword() {
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords do not match.");
        confirmPassword.classList.add("is-invalid");
        confirmPassword.classList.remove("is-valid");
    } else {
        confirmPassword.setCustomValidity("");
        confirmPassword.classList.remove("is-invalid");
        confirmPassword.classList.add("is-valid");
    }
}

// Listeners de eventos para validação em tempo real enquanto o usuário digita
password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

/**
 * Evento de envio do formulário
 * - Executa a validação de senha
 * - Impede o envio do formulário se houver campos inválidos
 * - Adiciona a classe was-validated para ativar os estilos de validação do Bootstrap
 */
form.addEventListener("submit", function (event) {
    validatePassword();
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add("was-validated");
}, false);