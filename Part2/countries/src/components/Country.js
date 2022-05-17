import {useEffect, useState} from 'react'
import axios from "axios";


const Country = ({countryData}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [weatherData, setWeatherData] = useState()

    const api_key = process.env.REACT_APP_WEATHER_API_CODE
    const name = countryData.name
    const capital = countryData.capital !== undefined ? countryData.capital[0] : 'NIL'
    const area = countryData.area
    const languages = countryData.languages !== undefined ? Object.values(countryData.languages).map(item => {
        return <li key={item.toString()}>{item}</li>
    }) : <p>None</p>
    const flagURL = countryData.flag

    useEffect(() => {
        if (countryData.capital !== undefined) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`
            console.log('fetching weather data from ', url)
                axios
                    .get(url)
                    .then(response => {
                        console.log(name, 'fetched weather data success', response.data)
                        setWeatherData(response.data)
                    })
        }
    }, [])

    const weatherDisplay = (() => {
        if (capital === 'NIL' || weatherData === undefined) {
            return (
                <p>Weather Data unavailable</p>
            )
        }
        return (
            <div>
                <h4>Weather at {capital}</h4>
                <p>Temperature : {weatherData.main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} width = '50'/>
                <p>Wind Speed : {weatherData.wind.speed} m/s</p>
            </div>
        )
    }) ()



    const displayData = (()=> {
        return (
            <div>
                <p>Capital : {capital}</p>
                <p>Area : {area}</p>
                <h5>Languages</h5>
                <ul>
                    {languages}
                </ul>
                <img src={flagURL} width = '100'/>
                {weatherDisplay}
            </div>
        )
    }) ()

    return (
        <div>
            <h4>{name} <button type="button" onClick={() => setIsOpen(!isOpen)}>{isOpen? 'hide' : 'show'}</button></h4>
            {isOpen? displayData : <></>}
        </div>
    )
}

export default Country