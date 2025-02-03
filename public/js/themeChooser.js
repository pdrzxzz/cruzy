for (let button of document.querySelectorAll('#themeButton')) {
    button.addEventListener('click', function (e) {
        const theme = e.target.value;
        
        console.log("Tema selecionado:", theme);

        // Criar o formulário dinamicamente
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/single";  // A URL para onde os dados serão enviados

        // Criar um campo de entrada escondido para armazenar o tema
        const themeInput = document.createElement("themeInput");
        themeInput.type = "hidden";
        themeInput.name = "theme";  // Nome do campo que o servidor vai receber
        themeInput.value = theme;   // Valor do botão clicado

        const ownerInput = document.createElement("ownerInput");
        ownerInput.type = "hidden";
        ownerInput.name = "input";  // Nome do campo que o servidor vai receber
        ownerInput.value = 'emanuel';   // Valor do botão clicado
        
        form.append(themeInput, ownerInput);

        // Adicionar o formulário ao corpo e enviá-lo
        document.body.appendChild(form);
        form.submit();  // Envia o formulário
    });
}