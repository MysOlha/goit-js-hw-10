import './css/styles.css'
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'
import { fetchCountries } from './fetchCountries'

const DEBOUNCE_DELAY = 300

const inputForm = document.querySelector('#search-box')
const countryList = document.querySelector('.country-list')
const countryInfo = document.querySelector('.country-info')

inputForm.addEventListener('input', debounce(inputCountry, DEBOUNCE_DELAY))

function inputCountry() {
  const name = inputForm.value.trim()
  if (name === '') {
   return resetInput()
  }

  fetchCountries(name)
    .then(countries => {
      resetInput()
        if (countries.length >= 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.') 
        } else if (countries.length === 1) {   
        countryInfo.insertAdjacentHTML('beforeend', countriesList(countries))
        countryList.insertAdjacentHTML('beforeend', oneCountryInfo(countries))
      } else {
        countryList.insertAdjacentHTML('beforeend', oneCountryInfo(countries))
      }
      return
    })
    .catch(noCountry)
}

function resetInput(){
  countryList.innerHTML = '';
  countryInfo.innerHTML = ''
}

function oneCountryInfo(countries) {
  // console.log(countries)
  return countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img src="${flags.svg}" alt="Flag of ${name.official}" width = 60px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `
    })
    .join('')
  
}

function countriesList(countries) {
//  console.log(countries)
return countries
    .map(({ capital, population, languages }) => {
      return `
        <ul >
            <li><p><b>Capital: </b>${capital}</p></li>
            <li><p><b>Population: </b>${population}</p></li>
            <li><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `
    })
    .join('')
  
}

function noCountry(){
    Notiflix.Notify.failure('Oops, there is no country with that name')
}