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

// Dispara a montagem do gráfico após o carregamento da página.
window.onload = () => {
    apresentarGrafico(lancamentos);
}

function apresentarGrafico(dados) {
    // Vamos preparar os dados dos lançamentos para a exibição no gráfico.
    // Para isso, precisamos agrupar os lançamentos por categoria a cada mês.

    // Primeiro vamos criar dois arrays com os meses e as categorias 
    // de forma única. Para isso vamos utilizar uma estrutura do JavaScript
    // denominada Set (Conjunto). Ao criar o Set a partir de um array, 
    // ele tira as duplicidades. 
    const meses = Array.from(new Set(dados.map(objeto => objeto.mes)));
    const categorias = Array.from(new Set(dados.map(objeto => objeto.categoria)));

    // Agora vamos consolidar todos os lancamentos por categoria e por mes
    // para isso, vamos passar em cada mês e totalizar os lançamentos por categorias
    const dadosPorMes = meses.map(mes => {
        const valoresPorCategoria = categorias.map(categoria => {
            const valor = dados.filter(obj => obj.mes === mes && obj.categoria === categoria)
                .reduce((acumulador, objetoCorrente) => acumulador + objetoCorrente.valor, 0);
            return valor;
        });
        return {
            mes: mes,
            valores: valoresPorCategoria
        };
    });

    // Monta o gráfico, utilizando a API do Chart.js,

    // Define um conjunto de cores para as séries do gráfico
    const cores = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
    ];

    // Obtem o elemento DIV da página que vai receber o gráfico
    const contexto = document.getElementById('grafico');

    // Cria o objeto do gráfico passando os parâmetros
    const divBarChart = new Chart(contexto, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: categorias.map((categoria, indice) => {
                return {
                    label: categoria,
                    data: dadosPorMes.map(item => item.valores[indice]),
                    backgroundColor: cores[indice],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                };
            })
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true
                },
                x: {
                    stacked: true
                }
            }
        }
    });
}

