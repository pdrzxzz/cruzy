/**
 * Script para visualização interativa da força da senha
 * Atualiza uma barra de progresso conforme o usuário digita
 */
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('password-strength-meter');
    const strengthText = document.getElementById('password-strength-text');

    /**
     * Calcula e exibe a força da senha
     * @param {string} password - A senha a ser avaliada
     */
    const calculatePasswordStrength = (password) => {
        // Critérios de avaliação
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Conta quantos critérios foram atendidos
        const metCriteria = Object.values(criteria).filter(Boolean).length;
        
        // Calcula a porcentagem de força (0-100%)
        const strengthPercentage = (metCriteria / 5) * 100;
        
        // Atualiza a barra de progresso
        strengthMeter.style.width = strengthPercentage + '%';
        strengthMeter.setAttribute('aria-valuenow', strengthPercentage);

        // Define a cor da barra baseada na força
        if (strengthPercentage <= 20) {
            strengthMeter.className = 'progress-bar bg-danger';
            strengthText.textContent = 'Password strength: Too weak';
            strengthText.className = 'form-text text-danger';
        } else if (strengthPercentage <= 40) {
            strengthMeter.className = 'progress-bar bg-warning';
            strengthText.textContent = 'Password strength: Weak';
            strengthText.className = 'form-text text-warning';
        } else if (strengthPercentage <= 60) {
            strengthMeter.className = 'progress-bar bg-info';
            strengthText.textContent = 'Password strength: Medium';
            strengthText.className = 'form-text text-info';
        } else if (strengthPercentage <= 80) {
            strengthMeter.className = 'progress-bar bg-primary';
            strengthText.textContent = 'Password strength: Strong';
            strengthText.className = 'form-text text-primary';
        } else {
            strengthMeter.className = 'progress-bar bg-success';
            strengthText.textContent = 'Password strength: Very strong';
            strengthText.className = 'form-text text-success';
        }

        // Exibe indicadores visuais de quais critérios foram atendidos
        updateCriteriaStatus(criteria);
    };

    /**
     * Atualiza os indicadores visuais dos critérios de senha
     * @param {Object} criteria - Objeto com os critérios atendidos
     */
    const updateCriteriaStatus = (criteria) => {
        const passwordFeedback = document.getElementById('passwordFeedback');
        if (!passwordFeedback) return;

        // Cria ou atualiza a lista de critérios com indicadores visuais
        const ul = passwordFeedback.querySelector('ul') || document.createElement('ul');
        ul.innerHTML = '';
        
        const items = [
            { name: '8 characters', met: criteria.length },
            { name: '1 uppercase letter', met: criteria.uppercase },
            { name: '1 lowercase letter', met: criteria.lowercase },
            { name: '1 number', met: criteria.numbers },
            { name: '1 special character', met: criteria.special }
        ];

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            li.className = item.met ? 'text-success' : 'text-danger';
            li.style.listStyleType = item.met ? '"✓ "' : '"✗ "';
            ul.appendChild(li);
        });

        // Substitui a lista existente ou adiciona a nova lista
        const existingUl = passwordFeedback.querySelector('ul');
        if (existingUl) {
            passwordFeedback.replaceChild(ul, existingUl);
        } else {
            passwordFeedback.appendChild(ul);
        }
    };

    // Atualiza a força da senha em tempo real conforme o usuário digita
    passwordInput.addEventListener('input', function() {
        calculatePasswordStrength(this.value);
    });
});