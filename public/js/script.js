for (let button of document.querySelectorAll('#themeButton')) {
    button.addEventListener('click', function (e) {
        const theme = e.target.value;
        
        console.log("Tema selecionado:", theme);

        // Criar o formulário dinamicamente
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/single";  // A URL para onde os dados serão enviados

        // Criar um campo de entrada escondido para armazenar o tema
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "theme";  // Nome do campo que o servidor vai receber
        input.value = theme;   // Valor do botão clicado
        form.appendChild(input);

        // Adicionar o formulário ao corpo e enviá-lo
        document.body.appendChild(form);
        form.submit();  // Envia o formulário
    });
}