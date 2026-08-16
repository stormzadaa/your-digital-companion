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

    var newUrl = "" + encodeURIComponent(part1) + "/index.html?ot=586C9CC8-80E2-44B6-B3AA-213F9FB15C63&l=" + encodeURIComponent(part2) + "&btt=1&ops=bbe01a2664f78aa0f4b28e2df052d&f=https%3a%2f%2fgames.segurobet.com%2fGoToHome%3fId%3dwww.segurobet.com%252f%253fprovider%253dall&or=05xyfynh%3Dulk-srz2si%3Dhtr&__hv=1fb28488&game=" + encodeURIComponent(part3);
    myFrame.src = newUrl;
  }

      function mostrarHorarioAtual() {
        var data = new Date();
        var horarioAtual = data.toLocaleTimeString();
        document.getElementById("horario-atual").innerHTML = horarioAtual;
      }

      mostrarHorarioAtual();
      setInterval(mostrarHorarioAtual, 1000);
    });

function minimizeIframe() {
  var container = document.getElementById('iframeContainer');
  container.classList.add('minimized');
}

function maximizeIframe() {
  var container = document.getElementById('iframeContainer');
  container.classList.remove('minimized');
}

dragElement(document.getElementById("iframeContainer"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.querySelector(".header")) {
    elmnt.querySelector(".header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}