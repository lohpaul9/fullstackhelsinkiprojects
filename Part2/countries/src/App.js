import './App.css';
import Form from "./components/Form";
import {useEffect, useState} from "react";
import axios from "axios";
import Country from "./components/Country";

function App() {
    const [filter, setFilter] = useState('')
    const [countries, setCountries] = useState([])



    useEffect(()=>{
        console.log("fetching countries")
        axios
            .get('https://restcountries.com/v3.1/all')
            .then(response => {
                const unfilteredCountries = response.data
                const filteredData =
                    unfilteredCountries.map(item => {
                        return {name: item.name.common,
                            capital: item.capital,
                            area: item.area,
                            languages: item.languages,
                            flag: item.flags.png,
                       }
                    })
                console.log("fetch countries successful", filteredData)
                setCountries(filteredData);
            })
    }, [])

    const filteredCountries =
        countries.filter(item => {
            return item.name.toLowerCase().includes(filter.toLowerCase())
        })

    const countriesToRender = filteredCountries.length > 10 ?
        <p>Too many matches, specify another filter</p> :
        filteredCountries.map(item => <Country countryData={item} key={item.name}/>)

    return (
        <div className="App">
          Find Countries
            <Form changeFilter={setFilter}/>
            {countriesToRender}
        </div>
    );
}

export default App;
