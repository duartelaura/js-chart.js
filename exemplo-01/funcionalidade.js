window.onload = () => {
   aquisicoesAnuais();
}

function aquisicoesAnuais() {
    const dados = [
        { ano: 2010, valor: 10 },
        { ano: 2011, valor: 20 },
        { ano: 2012, valor: 15 },
        { ano: 2013, valor: 25 },
        { ano: 2014, valor: 22 },
        { ano: 2015, valor: 30 },
        { ano: 2016, valor: 28 },
    ];

    const aquisicoes = document.getElementById('grafico-de-aquisicoes');

    const grafico = new Chart(
        aquisicoes,
        {
            type: 'bar',
            data: {
                labels: dados.map(objeto => objeto.ano),
                datasets: [
                    {
                        label: 'Aquisições por Ano',
                        data: dados.map(objeto => objeto.valor)
                    }
                ]
            }
        }
    );
}