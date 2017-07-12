function update(divId, inputId) {
  if (inputId == 'fax1' && document.getElementById(divId).innerHTML != 'Fax: ') {
    document.getElementById(divId).innerHTML = 'Fax: ' + document.getElementById(inputId).value;
  } else {
    document.getElementById(divId).innerHTML = document.getElementById(inputId).value;
  }
}
