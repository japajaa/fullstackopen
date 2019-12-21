import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom';


const Filter = (props) => {

    return (
      <div>find countries<input 
      value={props.value}
      onChange={props.onChange}
        />
      </div>      
    )
  }


const Weather = (props) => {

    const [ weather, setWeather ] = useState({})

    const weatherUrl = `http://api.weatherstack.com/current?access_key=5070d5d9ff7a75ec3aadff628c37c8f9&query=${props.city}&units=m`
    
    useEffect(() => {

        axios
          .get(weatherUrl)
          .then(response => {
            setWeather(response.data)
          })
      }, [])

if (weather.current) {
    return (
      <div>
          <p><b>temperature:</b> {weather.current.temperature}</p>
          <img alt="flag" src={weather.current.weather_icons[0]} />
          <p><b>wind: </b> {weather.current.wind_speed} kph direction {weather.current.wind_dir}</p>
      </div>      
    )
}

return(<div></div>)
  }

  const Countries2 = (props) => {

    if (props.countryList.length === 1) props.setCountry(props.countryList[0])



    const countryContent = 
    (props.countryList.length > 10) ? 
        'Too many matches, specify another filter' : 
        (props.countryList.length > 1) ?
            props.countryList.map(name => <CountryShortList key={name.name} countries={name} setFilterList={props.setFilterList} setCountry={props.setCountry}/>) :
             ''


        return (
          <div>
          {countryContent}
          </div>
      
        )
      }


const CountryShortList= (props) => {

  const buttonHandler = (event) => {
    event.preventDefault()

    props.setCountry(props.countries)
    props.setFilterList(props.countries)
    }

        return (
            <div>
            <li key={props.countries.name}>{props.countries.name}<button value={props.countries.name} onClick={buttonHandler} >show</button></li>
            </div>
        )
    
      }


  const CountryLanguage = (props) => {

const languages = props.languages.map(name => <li key={name.name}>{name.name}</li>)
    return (
        <div>
        {languages}
        </div>
    )

  }

const CountryInfo2 = (country) => {

    return (country.country.name !== '' ? 
        <div>
        <h2>{country.country.name}</h2>
        <table>
            <tbody>
                <tr><td>capital</td><td>{country.country.capital}</td></tr>
                <tr><td>population</td><td>{country.country.population}</td></tr>
            </tbody>
        </table>
        <h3>Languages</h3>
        <CountryLanguage languages={country.country.languages}/>
        <img alt="flag" src={country.country.flag} />
        <h3>Weather in {country.country.capital}</h3>
        <Weather city={country.country.capital} />
</div> : <div />
)
}



const App = () => {
    const [countryList, setCountryList] = useState([]) 
    const [ filter, setFilter ] = useState('')
    const [ chosenCountry, setChosenCountry ] = useState({name: ''})
    const [ filterList, setFilterList ] = useState([])
    const handleFilterChange = (event) => {

      const filteredCountries = countryList.filter((country) => country.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setFilter(event.target.value)
        setFilterList(filteredCountries)

        if (filteredCountries.length !== 1) setChosenCountry({name: ''})
      }

      const setCountry = (country) => {
        setChosenCountry(country)
      }
 
    useEffect(() => {
      axios
        .get('https://restcountries.eu/rest/v2/all')
        .then(response => {
         setCountryList(response.data)
        })
    }, [])

    return(
<div>
    <Filter value={filter} onChange={handleFilterChange}/>
    <Countries2 countryList={filterList} filter={filter} setFilterList={setFilterList} setCountry={setCountry} />
    <CountryInfo2 country={chosenCountry} /> 
</div>



    )

}


ReactDOM.render(<App />, document.getElementById('root'));
