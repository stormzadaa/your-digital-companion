// Adiciona o CSS ao documento
var css = `
#horario-atual {
  font-family: 'mono', sans-serif, Arial Black, Gadget;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.3em;
  color: #000000; 
  background-color: transparent;
  padding: 5px;
  border-radius: 5px;
  display: block;
  margin-top: 10px;
  text-align: center;
  position: absolute;
  z-index: 1000;
  width: 15%;
  height: auto;
  right: 58px;
  top: 65px;
  -webkit-text-fill-color: #ffffff;
  -webkit-text-stroke: 0.9px #000000;
}
`;
var style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// Função para mostrar o horário atual
function mostrarHorarioAtual() {
    var data = new Date();
    data.setMinutes(data.getMinutes());
    data.setSeconds(data.getSeconds());

    var options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 };
    var horarioAtual = new Intl.DateTimeFormat('pt-BR', options).format(data);
    document.getElementById("horario-atual").innerHTML = horarioAtual;
}

// Cria o elemento HTML para exibir o horário
var horarioElement = document.createElement('div');
horarioElement.id = 'horario-atual';
document.body.appendChild(horarioElement);

// Inicializa a função e define o intervalo para atualização
mostrarHorarioAtual();
setInterval(mostrarHorarioAtual, 1000);