document.addEventListener('DOMContentLoaded', function() {
  const loadButton = document.getElementById("loadButton");
  const myFrame = document.getElementById("myFrame");
  const menu = document.getElementById("menu");
  const editablePart3 = document.getElementById("editablePart3");

  loadButton.addEventListener('click', loadUrl);

  menu.addEventListener('change', function() {
    editablePart3.innerText = menu.options[menu.selectedIndex].text;
  });

  function loadUrl() {
    var part1 = menu.value;
    var part2 = document.getElementById("editablePart2").value;
    var part3 = editablePart3.innerText;

    if (part1.trim() === '' || part2.trim() === '' || part3.trim() === '') {
      alert('Por favor, insira todas as partes editáveis.');
      return;
    }

    var newUrl = "https://m.pgf-nmu2nd.com/" + encodeURIComponent(part1) + "/index.html?ot=EB5E93E6-8D97-1E0B-30F2-4E59E1872888&btt=1&ops=aHtK0%2BleN2hqWuC5rivW9kmk0w6LxyMwvebH0kaq6jwVey8V5p0GnBfhL%2BxNoFu9Q5yo3vEkBIweBT%2BDxKydlbBDGvy3m3nPiQK4ldm2IWENs%2FWK5Vt%2BvDTkpsBrEW3z&l=" + encodeURIComponent(part2) + "&iwk=1&oc=0&or=10cdkdsm%3Dzqp-xwe2xn%3Dmyw&__hv=1f94ebef&game=" + encodeURIComponent(part3);
    myFrame.src = newUrl;
  }

  function mostrarHorarioAtual() {
    var data = new Date();
    data.setMinutes(data.getMinutes());
    data.setSeconds(data.getSeconds());
    
    var options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    var horarioAtual = new Intl.DateTimeFormat('pt-BR', options).format(data);
    document.getElementById("horario-atual").innerHTML = horarioAtual;
  }

  mostrarHorarioAtual();
  setInterval(mostrarHorarioAtual, 1000);
});