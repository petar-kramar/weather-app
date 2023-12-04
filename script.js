const apiKey = '009285023f38a9fa372129d6472df5f8'
const button = document.querySelector('#button')
const home = document.querySelector('.home')
const weather = document.querySelector('.weather')
const temperature = document.querySelector('#temperature')
const weatherType = document.querySelector('#weatherType')
const cityCountry = document.querySelector('#cityCountry')
const feelsLike = document.querySelector('#feelsLike')
const humidity = document.querySelector('#humidity')
const weatherIcon = document.querySelector('#weatherIcon')
const form = document.querySelector('#weatherForm')
const errorMessage = document.querySelector('#error')
const time = document.querySelector('#time')
const disclaimer = document.querySelector('#disclaimer')
const daysOfWeek = ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota']

form.addEventListener('submit', function (event) {
  event.preventDefault()
  showWeather()
})

function showWeather() {
  const city = document.querySelector('#city').value
  home.style.display = 'none'
  weather.style.display = 'flex'
  errorMessage.innerText = ''

  fetchData(city)
    .then(data => {
      displayWeatherData(data)
    })
    .catch(error => {
      handleFetchError(city, error)
    })
}

function fetchData(city) {
  return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`).then(
    response => {
      if (!response.ok) {
        throw new Error(`${response.status}`)
      }
      return response.json()
    }
  )
}

function displayWeatherData(data) {
  console.log(data);
  const timezoneOffsetSeconds = data.timezone
  const currentTime = new Date()
  const localTime = new Date(currentTime.getTime() + timezoneOffsetSeconds * 1000)
  const day = daysOfWeek[localTime.getDay()]
  const hours = (localTime.getHours() - 1 < 10 ? '0' : '') + (localTime.getHours() - 1)
  const minutes = (localTime.getMinutes() < 10 ? '0' : '') + localTime.getMinutes()
  time.innerText = `${day}, ${hours}:${minutes}`
  temperature.innerHTML = `${data.main.temp.toFixed(1)}°C`
  weatherType.innerHTML = data.weather[0].description
  cityCountry.innerHTML = `${city.value} (${data.sys.country})`
  feelsLike.innerHTML = `${data.main.feels_like.toFixed(1)}°C`
  humidity.innerHTML = `${data.main.humidity}%`
  weatherIcon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
  if (data.main.temp > 25) {
    disclaimer.innerHTML = 'Caution, high temperature!'
  }
}

function handleFetchError(city, error) {
  weather.style.display = 'none'
  errorMessage.innerText = `There is no city named "${city}"! Try again with the correct city name.`
  console.log(error)
}
