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
        let valor = parseFloat(lastEntry[campo]).toFixed(2);
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

// Atualizações automáticas
setInterval(() => obterTemperatura('Q1', 2780400, 'field1'), 30000);
setInterval(() => obterTemperatura('Q2', 2780400, 'field2'), 30000);
setInterval(() => obterHumidade('Q3', 1234567, 'field3'), 30000);

// Atualização inicial
obterTemperatura('Q1', 2780400, 'field1');
obterTemperatura('Q2', 2780400, 'field2');
obterHumidade('Q3', 2780400, 'field3');
