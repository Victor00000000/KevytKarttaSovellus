/* eslint-disable no-undef */
window.addEventListener('load', event => {
  const mymap = L.map('mapid', {
    doubleClickZoom: false
  }).setView([60.1698, 24.9386], 5)

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidmljdG9yMDAwMDAwMDAiLCJhIjoiY2sydGE1cWY1MHB2NTNkdGpsaTRvcmUzdiJ9.vEkGiSDpV_r1c65QrVlVSA'
  }).addTo(mymap)

  fetch('http://localhost:8080/locations')
    .then(response => {
      if (response.status === 200) {
        return response.json()
      } else {
        console.log('ERROR: Unable to get data')
      }
    })
    .then(jsonObject => {
      jsonObject.forEach(element => {
        L.marker([element.lat, element.lon]).addTo(mymap)
      })
    })

  mymap.on('dblclick', onMapDoubleClick)

  function onMapDoubleClick (e) {
    const myHeaders = new Headers()
    myHeaders.append('Content-type', 'application/json')

    const data = {
      lat: e.latlng.lat, lon: e.latlng.lng
    }

    const init = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(data)
    }

    fetch('http://localhost:8080/locations/', init)
      .then(httpResponse => {
        if (httpResponse.status === 201) {
          L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        } else {
          console.log('ERROR: Unable to create new location')
        }
      })
  }
})
