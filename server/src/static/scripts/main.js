function formToJson (form) {
  return Array.from(form.querySelectorAll('input, select, textarea'))
    .filter(elem => elem.name)
    .reduce((json, elem) => {
      json[elem.name] = elem.type === 'checkbox' ? elem.checked : elem.value
      return json
    }, {})
}

function postData (url, data) {
  return window.fetch(
    url,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  )
    .then(
      response => response.json()
    ).then(
      html => console.log(html)
    )
}

var form = document.getElementById('user-settings-form')

if (form) {
  form.addEventListener('input', function (evt) {
    console.log(formToJson(form))
    postData('/user-settings', formToJson(form))
  })
}
