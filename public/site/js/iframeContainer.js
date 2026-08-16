document.querySelector('.minimize-btn1').addEventListener('click', function() {
  document.querySelector('.iframe-container').classList.toggle('minimized');
});

document.querySelector('.minimize-btn2').addEventListener('click', function() {
  document.getElementById('iframeContainer2').classList.toggle('minimized');
});