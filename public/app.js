// Dados iniciais
const filmesIniciais = [
    {
        id: 1,
        titulo: "O Poderoso Chefão",
        sinopse: "Uma épica saga familiar sobre o crime organizado italiano na América.",
        genero: "Drama",
        ano: 1972,
        avaliacao: 9.2,
        diretor: "Francis Ford Coppola",
        poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        pais: "Estados Unidos",
        cidade: "Nova York",
        coordenadas: [40.7128, -74.006] // [lat, lng] para Leaflet
    },
    {
        id: 2,
        titulo: "Matrix",
        sinopse: "Um hacker descobre a verdadeira natureza de sua realidade.",
        genero: "Ficção Científica",
        ano: 1999,
        avaliacao: 8.7,
        diretor: "Lana e Lilly Wachowski",
        poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        pais: "Austrália",
        cidade: "Sydney",
        coordenadas: [-33.8688, 151.2093]
    },
    {
        id: 3,
        titulo: "O Auto da Compadecida",
        sinopse: "As aventuras de João Grilo e Chicó no sertão nordestino.",
        genero: "Comédia",
        ano: 2000,
        avaliacao: 8.6,
        diretor: "Guel Arraes",
        poster: "https://m.media-amazon.com/images/M/MV5BZGJjNDUwYTItYTM5MC00YzM3LWEyYTctMDM4Y2Q2N2I4N2E0XkEyXkFqcGdeQXVyNDU3Mzc0NjE@._V1_.jpg",
        pais: "Brasil",
        cidade: "Cabaceiras",
        coordenadas: [-7.4896, -36.2871]
    },
    {
        id: 4,
        titulo: "Vingadores: Ultimato",
        sinopse: "Os heróis se reúnem para desfazer o estrago de Thanos.",
        genero: "Ação",
        ano: 2019,
        avaliacao: 8.4,
        diretor: "Anthony e Joe Russo",
        poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        pais: "Estados Unidos",
        cidade: "Atlanta",
        coordenadas: [33.749, -84.388]
    }
];

// Variáveis globais
let filmes = [];
let mapa;
let filmeEditandoId = null;
let graficoPizza, graficoBarras, graficoAnos;

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();
    configurarFormulario();
    mostrarSecao('filmes');
});

// ========== LOCALSTORAGE ==========

function carregarFilmes() {
    const filmesSalvos = localStorage.getItem('cinecollection-filmes');
    if (filmesSalvos) {
        filmes = JSON.parse(filmesSalvos);
    } else {
        filmes = filmesIniciais;
        salvarFilmes();
    }
    renderizarFilmes();
}

function salvarFilmes() {
    localStorage.setItem('cinecollection-filmes', JSON.stringify(filmes));
}

// ========== MAPA COM LEAFLET ==========

function inicializarMapa() {
    // Criar o mapa
    mapa = L.map('mapa').setView([-15.7801, -47.9292], 3); // Centro do Brasil, zoom 3
    
    // Adicionar camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(mapa);
    
    console.log('Mapa Leaflet inicializado com sucesso!');
    atualizarMapa();
}

function atualizarMapa() {
    if (!mapa) {
        console.error('Mapa não inicializado');
        return;
    }

    // Limpar marcadores existentes
    mapa.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            mapa.removeLayer(layer);
        }
    });

    // Adicionar marcadores para cada filme
    filmes.forEach(filme => {
        if (filme.coordenadas && filme.coordenadas.length === 2) {
            const [lat, lng] = filme.coordenadas;
            
            // Criar popup com informações do filme
            const popupContent = `
                <div style="color: #000; max-width: 250px;">
                    <img src="${filme.poster}" alt="${filme.titulo}" 
                         style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;">
                    <div style="padding: 10px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 16px;">${filme.titulo}</h4>
                        <p style="margin: 0; font-size: 12px; line-height: 1.4;">
                            <strong>Gênero:</strong> ${filme.genero}<br>
                            <strong>Ano:</strong> ${filme.ano}<br>
                            <strong>Nota:</strong> ⭐ ${filme.avaliacao}/10<br>
                            <strong>Diretor:</strong> ${filme.diretor}<br>
                            <strong>Local:</strong> ${filme.cidade}, ${filme.pais}
                        </p>
                    </div>
                </div>
            `;

            // Criar marcador vermelho
            const marker = L.marker([lat, lng])
                .addTo(mapa)
                .bindPopup(popupContent);

            // Estilizar o marcador
            marker.on('add', function() {
                const icon = marker.getElement();
                if (icon) {
                    icon.style.filter = 'hue-rotate(300deg)'; // Tornar vermelho
                }
            });
        }
    });

    // Ajustar zoom para mostrar todos os marcadores
    if (filmes.length > 0 && filmes.some(f => f.coordenadas)) {
        const group = new L.featureGroup(
            filmes
                .filter(f => f.coordenadas)
                .map(f => L.marker(f.coordenadas))
        );
        mapa.fitBounds(group.getBounds().pad(0.1));
    }
}

// ========== GRÁFICOS COM CHART.JS ==========

function atualizarGraficos() {
    criarGraficoPizza();
    criarGraficoBarras();
    criarGraficoAnos();
}

function criarGraficoPizza() {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    
    if (graficoPizza) graficoPizza.destroy();
    
    const generosCount = {};
    filmes.forEach(filme => {
        generosCount[filme.genero] = (generosCount[filme.genero] || 0) + 1;
    });

    const generos = Object.keys(generosCount);
    const quantidades = Object.values(generosCount);

    graficoPizza = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: generos,
            datasets: [{
                data: quantidades,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                borderColor: '#141414',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

function criarGraficoBarras() {
    const ctx = document.getElementById('graficoBarras').getContext('2d');
    
    if (graficoBarras) graficoBarras.destroy();
    
    const generosAvaliacao = {};
    filmes.forEach(filme => {
        if (!generosAvaliacao[filme.genero]) {
            generosAvaliacao[filme.genero] = { soma: 0, count: 0 };
        }
        generosAvaliacao[filme.genero].soma += filme.avaliacao;
        generosAvaliacao[filme.genero].count += 1;
    });

    const generos = Object.keys(generosAvaliacao);
    const medias = generos.map(genero => 
        (generosAvaliacao[genero].soma / generosAvaliacao[genero].count).toFixed(1)
    );

    graficoBarras = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: generos,
            datasets: [{
                label: 'Avaliação Média',
                data: medias,
                backgroundColor: '#e50914',
                borderColor: '#b20710',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

function criarGraficoAnos() {
    const ctx = document.getElementById('graficoAnos').getContext('2d');
    
    if (graficoAnos) graficoAnos.destroy();
    
    const anosAvaliacao = {};
    filmes.forEach(filme => {
        if (!anosAvaliacao[filme.ano]) {
            anosAvaliacao[filme.ano] = { soma: 0, count: 0 };
        }
        anosAvaliacao[filme.ano].soma += filme.avaliacao;
        anosAvaliacao[filme.ano].count += 1;
    });

    const anos = Object.keys(anosAvaliacao).sort();
    const medias = anos.map(ano => 
        (anosAvaliacao[ano].soma / anosAvaliacao[ano].count).toFixed(1)
    );

    graficoAnos = new Chart(ctx, {
        type: 'line',
        data: {
            labels: anos,
            datasets: [{
                label: 'Avaliação Média',
                data: medias,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                },
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: '#404040' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#ffffff' }
                }
            }
        }
    });
}

// ========== CRUD FUNCTIONS ==========

function renderizarFilmes() {
    const grid = document.getElementById('grid-filmes');
    grid.innerHTML = '';

    if (filmes.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #b3b3b3; grid-column: 1 / -1;">Nenhum filme cadastrado. Adicione o primeiro filme!</p>';
        return;
    }

    filmes.forEach(filme => {
        const card = document.createElement('div');
        card.className = 'filme-card';
        card.onclick = () => mostrarDetalhes(filme.id);
        
        card.innerHTML = `
            <img src="${filme.poster}" alt="${filme.titulo}" class="filme-poster" 
                 onerror="this.src='https://via.placeholder.com/300x450/2f2f2f/ffffff?text=Poster+Não+Encontrado'">
            <div class="filme-info">
                <span class="filme-genero">${filme.genero}</span>
                <h3 class="filme-titulo">${filme.titulo}</h3>
                <p class="filme-sinopse">${filme.sinopse}</p>
                <div class="filme-metadados">
                    <span>${filme.ano}</span>
                    <span class="filme-avaliacao">⭐ ${filme.avaliacao}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function configurarFormulario() {
    const form = document.getElementById('form-filme');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        salvarFilme();
    });
}

function salvarFilme() {
    const coordenadasInput = document.getElementById('coordenadas').value;
    let coordenadas;
    
    try {
        coordenadas = coordenadasInput.split(',').map(coord => parseFloat(coord.trim()));
        // Leaflet usa [lat, lng] - garantir ordem correta
        if (coordenadas.length === 2) {
            // Se o primeiro número for muito grande (provavelmente longitude), inverter
            if (Math.abs(coordenadas[0]) > 90) {
                coordenadas = [coordenadas[1], coordenadas[0]];
            }
        }
    } catch (error) {
        alert('Coordenadas inválidas! Use o formato: latitude,longitude');
        return;
    }

    const formData = {
        titulo: document.getElementById('titulo').value,
        sinopse: document.getElementById('sinopse').value,
        genero: document.getElementById('genero').value,
        ano: parseInt(document.getElementById('ano').value),
        avaliacao: parseFloat(document.getElementById('avaliacao').value),
        diretor: document.getElementById('diretor').value,
        poster: document.getElementById('poster').value,
        pais: document.getElementById('pais').value,
        cidade: document.getElementById('cidade').value,
        coordenadas: coordenadas
    };

    if (filmeEditandoId) {
        const index = filmes.findIndex(f => f.id === filmeEditandoId);
        filmes[index] = { ...filmes[index], ...formData };
    } else {
        const novoId = filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1;
        filmes.unshift({ id: novoId, ...formData });
    }

    salvarFilmes();
    renderizarFilmes();
    fecharModal();
    alert(filmeEditandoId ? 'Filme atualizado!' : 'Filme adicionado!');
}

function mostrarDetalhes(id) {
    const filme = filmes.find(f => f.id === id);
    if (filme) {
        const conteudo = document.getElementById('detalhes-conteudo');
        conteudo.innerHTML = `
            <div class="detalhes-header">
                <img src="${filme.poster}" alt="${filme.titulo}" class="detalhes-poster"
                     onerror="this.src='https://via.placeholder.com/300x450/2f2f2f/ffffff?text=Poster+Não+Encontrado'">
                <div class="detalhes-info">
                    <h1 class="detalhes-titulo">${filme.titulo}</h1>
                    <div class="detalhes-meta">
                        <span><strong>🎭 Gênero:</strong> ${filme.genero}</span>
                        <span><strong>📅 Ano:</strong> ${filme.ano}</span>
                        <span><strong>⭐ Avaliação:</strong> ${filme.avaliacao}/10</span>
                        <span><strong>🎬 Diretor:</strong> ${filme.diretor}</span>
                        <span><strong>🌍 Local:</strong> ${filme.cidade}, ${filme.pais}</span>
                    </div>
                    <div class="detalhes-descricao">
                        <h3>Sinopse</h3>
                        <p>${filme.sinopse}</p>
                    </div>
                    <div class="detalhes-acoes">
                        <button class="btn-primario" onclick="abrirModalEditar(${filme.id}); fecharDetalhes()">✏️ Editar</button>
                        <button class="btn-secundario" onclick="excluirFilme(${filme.id})">🗑️ Excluir</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('modal-detalhes').style.display = 'block';
    }
}

function excluirFilme(id) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
        filmes = filmes.filter(f => f.id !== id);
        salvarFilmes();
        renderizarFilmes();
        fecharDetalhes();
        alert('Filme excluído!');
    }
}

function abrirModalAdicionar() {
    filmeEditandoId = null;
    document.getElementById('modal-titulo').textContent = '🎬 Adicionar Filme';
    document.getElementById('form-filme').reset();
    document.getElementById('modal-filme').style.display = 'block';
}

function abrirModalEditar(id) {
    const filme = filmes.find(f => f.id === id);
    if (filme) {
        filmeEditandoId = id;
        document.getElementById('modal-titulo').textContent = '✏️ Editar Filme';
        document.getElementById('filme-id').value = filme.id;
        document.getElementById('titulo').value = filme.titulo;
        document.getElementById('sinopse').value = filme.sinopse;
        document.getElementById('genero').value = filme.genero;
        document.getElementById('ano').value = filme.ano;
        document.getElementById('avaliacao').value = filme.avaliacao;
        document.getElementById('diretor').value = filme.diretor;
        document.getElementById('poster').value = filme.poster;
        document.getElementById('pais').value = filme.pais;
        document.getElementById('cidade').value = filme.cidade;
        document.getElementById('coordenadas').value = filme.coordenadas.join(', ');
        document.getElementById('modal-filme').style.display = 'block';
    }
}

function fecharModal() {
    document.getElementById('modal-filme').style.display = 'none';
    filmeEditandoId = null;
}

function fecharDetalhes() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

function mostrarSecao(secao) {
    document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa'));
    document.getElementById(`secao-${secao}`).classList.add('ativa');
    
    if (secao === 'graficos') {
        setTimeout(atualizarGraficos, 100);
    } else if (secao === 'mapa') {
        setTimeout(() => {
            if (!mapa) {
                inicializarMapa();
            } else {
                atualizarMapa();
            }
        }, 100);
    }
}

function filtrarFilmes() {
    const termo = document.getElementById('busca').value.toLowerCase();
    const cards = document.querySelectorAll('.filme-card');
    
    cards.forEach(card => {
        const titulo = card.querySelector('.filme-titulo').textContent.toLowerCase();
        const genero = card.querySelector('.filme-genero').textContent.toLowerCase();
        const sinopse = card.querySelector('.filme-sinopse').textContent.toLowerCase();
        
        if (titulo.includes(termo) || genero.includes(termo) || sinopse.includes(termo)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modalFilme = document.getElementById('modal-filme');
    const modalDetalhes = document.getElementById('modal-detalhes');
    
    if (event.target === modalFilme) fecharModal();
    if (event.target === modalDetalhes) fecharDetalhes();
}