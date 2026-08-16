document.addEventListener("DOMContentLoaded", function() {
    const loadButton = document.getElementById("loadButton"),
        myFrame = document.getElementById("myFrame"),
        menu = document.getElementById("menu"),
        editablePart3 = document.getElementById("editablePart3"),
        editablePart2 = document.getElementById("editablePart2"),
        horarioAtualElement = document.getElementById("horario-atual");

    if (loadButton && myFrame && menu && editablePart3 && editablePart2) {
        loadButton.addEventListener("click", loadUrl);
        menu.addEventListener("change", function() {
            editablePart3.innerText = menu.options[menu.selectedIndex].text;
        });

        function loadUrl() {
            var part1 = menu.value,
                part2 = editablePart2.value,
                part3 = editablePart3.innerText;

            if (part1.trim() === "" || part2.trim() === "" || part3.trim() === "") {
                alert("Por favor, insira todas as partes editáveis.");
                return;
            }

            var newUrl = "https://m.eajzzxhro.com/" + encodeURIComponent(part1) + "/index.html?ot=ca7094186b309ee149c55c8822e7ecf2&l=" + encodeURIComponent(part2) + "&btt=2&or=05xyfynh%3Djfoeecmwt%3Dhtr&__hv=2fMEYCIQDJIHTAKwAj0OUQalGno8FriL1SooqsW5Cnr5hQmVT3QwIhAMwb0uEs9aSyFVta7sR9a7vomvaL1JsOUpuniv%2FaHznv&__sv=010401YytG6oT6vOl81kKt_NDwR6QjynyruQC7y9kpWiV7QEg&game=" + encodeURIComponent(part3);
            myFrame.src = newUrl;
        }
    }

    function mostrarHorarioAtual() {
        var data = new Date();
        var options = {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3
        };
        var horarioAtual = new Intl.DateTimeFormat("pt-BR", options).format(data);
        horarioAtualElement.innerHTML = horarioAtual;
    }

    mostrarHorarioAtual();
    setInterval(mostrarHorarioAtual, 1000);

    // Função para minimizar o iframe
    window.minimizeIframe = function(id) {
        document.getElementById(id).classList.add("minimized");
    };

    // Função para maximizar o iframe
    window.maximizeIframe = function(id) {
        document.getElementById(id).classList.remove("minimized");
    };

    // Função para recarregar o iframe
    window.reloadIframe = function(id) {
        const iframe = document.getElementById(id);
        iframe.src = iframe.src;
    };

    // Função para tornar o iframe arrastável
    function dragElement(e) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (e.querySelector(".header")) {
            e.querySelector(".header").onmousedown = dragMouseDown;
        } else {
            e.onmousedown = dragMouseDown;
        }

        function dragMouseDown(a) {
            a = a || window.event;
            a.preventDefault();
            pos3 = a.clientX;
            pos4 = a.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(a) {
            a = a || window.event;
            a.preventDefault();
            pos1 = pos3 - a.clientX;
            pos2 = pos4 - a.clientY;
            pos3 = a.clientX;
            pos4 = a.clientY;
            e.style.top = (e.offsetTop - pos2) + "px";
            e.style.left = (e.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    dragElement(document.getElementById("iframeContainer1"));
    dragElement(document.getElementById("iframeContainer2"));

    // Definição da função toggleSidebar
    window.toggleSidebar = function() {
        document.body.classList.toggle('collapsed');
    };
});
