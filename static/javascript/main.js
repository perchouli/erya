// form出错时显示pointing
var pointings = document.querySelectorAll('form .ui.pointing');
for (var i = 0; i < pointings.length; i++) {
  var pointing = pointings[i];
  if (pointing.innerHTML != '') {
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

var ajaxWrapper = function (method, url, data, callback) {
  var xhr = new XMLHttpRequest(),
    response,
    params;
  if (!data) data = {};

  function serialize (obj) {
    var str = [];
    for(var p in obj)
       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
  }

  xhr.onreadystatechange = function () {
    if (xhr.responseText && xhr.readyState == 4 && xhr.status == 200) {
      try {
        response = JSON.parse(xhr.responseText);
      } catch (e) {
        response = xhr.responseText;
      }
      callback(response);
    }
  };
  if (method == 'POST') {
    xhr.open(method, url, true);
    xhr.send(data);
  }
  else {
    params = (typeof(data) === 'object') ? serialize(data) : data;
    xhr.open(method, url + (params ? '?' + params : ''), true);
    xhr.send();
  }
  return response;
};

          
function sleep (millis, callback) {
  setTimeout(function () {
    callback();
  }, millis);
}