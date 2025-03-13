/**
 * Script para validação complexa de senha no formulário de registro
 * Verifica requisitos de segurança como tamanho mínimo, caracteres especiais, etc.
 * Integrado com a barra de progresso visual
 */
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordFeedback = document.getElementById('passwordFeedback');
    const submitButton = document.getElementById('submitButton');

    /**
     * Valida se a senha atende a todos os requisitos de segurança
     * @param {string} password - A senha a ser validada
     * @returns {boolean} - True se a senha atender a todos os requisitos
     */
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };

    /**
     * Valida o formulário completo e habilita/desabilita o botão de envio
     * Atualiza classes visuais para feedback ao usuário
     */
    const validateForm = () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const isPasswordValid = validatePassword(password);
        
        // Check if passwords match only if both fields have content
        // This fixes the bug where empty passwords were considered "matching"
        const doPasswordsMatch = password && confirmPassword ? 
            password === confirmPassword : false;

        // Only enable submit button if all validations pass and both fields have content
        if (isPasswordValid && doPasswordsMatch && password && confirmPassword) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }

        // Validate password field
        if (!password) {
            // If password is empty, remove both classes
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.remove('is-valid');
        } else if (!isPasswordValid) {
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
        } else {
            passwordInput.classList.add('is-valid');
            passwordInput.classList.remove('is-invalid');
        }

        // Validate confirm password field
        if (!confirmPassword) {
            // If confirm password is empty, remove both classes
            confirmPasswordInput.classList.remove('is-invalid');
            confirmPasswordInput.classList.remove('is-valid');
        } else if (!doPasswordsMatch) {
            confirmPasswordInput.classList.add('is-invalid');
            confirmPasswordInput.classList.remove('is-valid');
        } else {
            confirmPasswordInput.classList.add('is-valid');
            confirmPasswordInput.classList.remove('is-invalid');
        }
    };

    // Event listeners para validação em tempo real
    passwordInput.addEventListener('input', validateForm);
    confirmPasswordInput.addEventListener('input', validateForm);
});