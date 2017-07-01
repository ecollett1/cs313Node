function update(divId, inputId) {
  document.getElementById(divId).innerHTML = document.getElementById(inputId).value;
  
  if (inputId == 'fax1' && document.getElementById(divId).innerHTML == '') {
    document.getElementById(divId).innerHTML = '&nbsp'
  }
}
