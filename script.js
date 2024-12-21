// Defina seu Canal ID e a API Key de leitura aqui
const channelID = '2780400';  // Seu Channel ID do ThingSpeak
const apiKey = '8DC8LR28ZEH5HHVG';  // Sua chave de leitura do ThingSpeak

// Função para buscar os dados do ThingSpeak
function obterTemperatura() {
    // Mostrar indicador de carregamento
    $('#loading').show();
    $('#temperatura').text('Carregando...');

    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=1`;

    $.get(url, function (data) {
        const lastEntry = data.feeds[0];
        let temperatura = parseFloat(lastEntry.field1); // Converter para número
        let timestamp = lastEntry.created_at; // Hora da última atualização em UTC

        // Formatar a temperatura para 2 casas decimais
        temperatura = temperatura.toFixed(2);

        // Converter timestamp de UTC para hora de Brasília
        let dataUtc = new Date(timestamp);
        dataUtc.setHours(dataUtc.getHours() - 3); // Ajuste para horário de Brasília

        // Formatar data e hora no formato "DD/MM/YYYY HH:MM:SS"
        const options = {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        };
        const dataBrasilia = dataUtc.toLocaleString('pt-BR', options);

        // Atualize o HTML com os dados recebidos
        $('#temperatura').text(temperatura + " °C");
        $('#timestamp').text('Última atualização: ' + dataBrasilia);

        // Esconder o indicador de carregamento após os dados serem atualizados
        $('#loading').hide();
    }).fail(function () {
        // Caso ocorra algum erro, esconder o indicador de carregamento e mostrar mensagem de erro
        $('#loading').hide();
        $('#temperatura').text('Erro ao carregar dados.');
    });
}

// Atualizar a temperatura a cada 30 segundos
setInterval(obterTemperatura, 30000); // Atualiza a cada 30 segundos
obterTemperatura(); // Chama a função pela primeira vez ao carregar a página
