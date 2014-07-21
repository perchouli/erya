// form出错时显示pointing
var pointings = document.querySelectorAll('form .ui.pointing');
for (var i = 0; i < pointings.length; i++) {
  var pointing = pointings[i];
  if (pointing.innerText != '') {
    pointing.style.display = '';
    pointing.parentElement.className = 'field error';
  }
};
// 点击input隐藏pointing
var inputs = document.querySelectorAll('form input');
for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('click', function () {
    var pointing = this.nextElementSibling;
    if (pointing && pointing.className.search('pointing') != -1) {
      pointing.style.display = 'none';
      pointing.parentElement.className = 'field';
    }
  });
};