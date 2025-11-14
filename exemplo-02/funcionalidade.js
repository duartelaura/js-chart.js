const lancamentos = [
    { "mes": "jan-24", "categoria": "Alimentação", "valor": 500.00 },
    { "mes": "jan-24", "categoria": "Transporte", "valor": 200.00 },
    { "mes": "jan-24", "categoria": "Lazer", "valor": 300.00 },
    { "mes": "fev-24", "categoria": "Alimentação", "valor": 450.00 },
    { "mes": "fev-24", "categoria": "Transporte", "valor": 180.00 },
    { "mes": "fev-24", "categoria": "Lazer", "valor": 350.00 },
    { "mes": "mar-24", "categoria": "Alimentação", "valor": 600.00 },
    { "mes": "mar-24", "categoria": "Transporte", "valor": 250.00 },
    { "mes": "mar-24", "categoria": "Lazer", "valor": 400.00 }
];

window.onload = () => {
    apresentarGrafico(lancamentos);
}

function apresentarGrafico(dados) {
    // Vamos preparar os dados dos lançamentos para a exibição no gráfico.
    // Para isso, precisamos agrupar os lançamentos por categoria.

    // Primeiro, vamos criar um array com a lista de categorias de forma única.
    // Para isso, vamos utilizar uma estrutura do JavaScript
    // denominada Set (Conjunto). Ao criar o Set a partir de um array, 
    // ele tira as duplicidades. 
    const categorias = Array.from(new Set(dados.map(objeto => objeto.categoria)));

    // Agora vamos consolidar todos os lancamentos por categoria.
    // Para isso, vamos passar em cada categoria e totalizar os lançamentos 
    const valoresPorCategoria = categorias.map(categoria => {
        const valorTotal = dados.filter(objeto => objeto.categoria === categoria)
            .reduce((acumulador, obj) => acumulador + obj.valor, 0);
        return valorTotal;
    });

    // Obtem o elemento DIV da página que vai receber o gráfico
    const contexto = document.getElementById('grafico');

    // Cria o objeto do gráfico passando os parâmetros
    const grafico = new Chart(contexto, {
        type: 'pie',
        data: {
            labels: categorias,
            datasets: [{
                data: valoresPorCategoria,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 255, 2555, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false
        }
    });
}