// API Key de leitura do ThingSpeak
const apiKey = '8DC8LR28ZEH5HHVG';

// Função genérica para buscar dados do ThingSpeak
function obterDado(identificador, canalID, campo, tipo) {
    const url = `https://api.thingspeak.com/channels/${canalID}/feeds.json?api_key=${apiKey}&results=1`;

    // Mostrar indicador de carregamento
    $(`#loading${identificador}`).show();
    $(`#${tipo}${identificador}`).text('Carregando...');

    // Requisitar dados do ThingSpeak
    $.get(url, function (data) {
        const lastEntry = data.feeds[0];
        if (!lastEntry || !lastEntry[campo]) {
            $(`#${tipo}${identificador}`).text('Sem dados disponíveis.');
            $(`#loading${identificador}`).hide();
            return;
        }

        // Processar os dados
        let valor = parseFloat(lastEntry[campo]).toFixed(1);
        let timestamp = new Date(lastEntry.created_at).toLocaleString('pt-BR', { hour12: false });

        // Atualizar o HTML
        $(`#${tipo}${identificador}`).text(`${valor} ${tipo === 'humidade' ? '%' : '°C'}`);
        $(`#timestamp${identificador}`).text(`Última atualização: ${timestamp}`);
        $(`#loading${identificador}`).hide();
    }).fail(function () {
        // Em caso de erro, exibir mensagem
        $(`#loading${identificador}`).hide();
        $(`#${tipo}${identificador}`).text('Erro ao carregar dados.');
    });
}

// Funções específicas para Temperatura e Humidade
function obterTemperatura(identificador, canalID, campo) {
    obterDado(identificador, canalID, campo, 'temperatura');
}

function obterHumidade(identificador, canalID, campo) {
    obterDado(identificador, canalID, campo, 'humidade');
}

// Função para calcular o delta de temperatura
function calcularDelta() {
    // Garantir que as temperaturas de Q1 e Q2 estejam carregadas
    const tempQ1 = parseFloat(document.getElementById("temperaturaQ1").textContent) || null;
    const tempQ2 = parseFloat(document.getElementById("temperaturaQ2").textContent) || null;

    // Verificar se ambos os valores de temperatura estão disponíveis
    if (tempQ1 === null || tempQ2 === null) {
        document.getElementById("deltaTemperatura").textContent = "Aguardando dados...";
        return;
    }

    // Calcular o delta se ambos os valores de temperatura forem válidos
    const delta = (tempQ2 - tempQ1).toFixed(1);
    document.getElementById("deltaTemperatura").textContent = `${delta} °C`;

    const now = new Date();
    document.getElementById("timestampDelta").textContent = `Atualizado em: ${now.toLocaleTimeString()}`;
    document.getElementById("loadingDelta").style.display = "none";
}

// Atualizações automáticas
setInterval(() => obterTemperatura('Q1', 2780400, 'field1'), 60000);
setInterval(() => obterTemperatura('Q2', 2780400, 'field2'), 60000);
setInterval(() => obterHumidade('Q3', 2780400, 'field3'), 60000);

// Atualização inicial
obterTemperatura('Q1', 2780400, 'field1');
obterTemperatura('Q2', 2780400, 'field2');
obterHumidade('Q3', 2780400, 'field3');

// Chama calcularDelta imediatamente após 1 segundo e depois a cada 30 segundos
setTimeout(() => {
    calcularDelta();
}, 1000);

setInterval(() => {
    calcularDelta();
}, 4000);

// Define o intervalo de tempo em milissegundos (10 minutos = 600.000 ms)
setInterval(function() {
    location.reload(); // Recarrega a página
}, 600000); // 600.000 milissegundos = 10 minutos