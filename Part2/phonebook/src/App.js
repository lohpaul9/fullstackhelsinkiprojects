import { useState, useEffect } from 'react'
import AddPersonForm from './components/AddPersonForm'
import PhonebookTable from './components/PhonebookTable'
import FilterForm from './components/FilterForm'
import axios from 'axios'
import personService from './services/persons'
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterWord, setFilterWord] = useState('')
    const [notifInfo, setNotifInfo] = useState({message: undefined, isError : false})

  const changeFilter = (word) => {
    return () => setFilterWord(word)
  }

  const displayNotif = (message, isError) => {
      setNotifInfo({message: message, isError: isError})
      setTimeout(() => setNotifInfo({message: undefined, isError : false}) , 5000)
  }

  const serverSync = ()=> {
      console.log("Effect")
      return personService
          .getAll()
          .then(response => {
              console.log(response)
              setPersons(response)
              return response
          })
  }

  useEffect(serverSync, [])

  const newPersonHandler = (name, number) => {
    const newPerson = {
      name: name, number: number
    }
    console.log(newPerson)
    return (
        () => {
            personService
                .create(newPerson)
            displayNotif(newPerson.name + ' added to phonebook', false)
            setPersons(persons.concat(newPerson))
        }
    )
  }

  const updatePerson = (newPerson) => {
      personService
          .update(newPerson, newPerson.id)
          .then(() => setPersons(persons.map(person => person.id === newPerson.id ? newPerson : person)))
          .catch(error => {
              displayNotif(newPerson.name + ' not in database', true)
              setPersons(persons.filter(person => person.id !== newPerson.id))
          })
  }

  const delUser = id => {
      personService
          .delObj(id)
          .then(() => personService
              .getAll()
              .then(response => {
                  setPersons(response)
              }))
          .catch(error => {
              displayNotif(persons.find(person => person.id === id).name + ' not in database', true)
              setPersons(persons.filter(person => person.id !== id))
          })
  }


  const filteredString = filterWord === '' ? persons :
  persons.filter(value => (value.name.toLowerCase()).includes(filterWord.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notifInfo.message} isError={notifInfo.isError}/>
      <AddPersonForm addPerson={newPersonHandler} persons = {persons} updatePerson={updatePerson}
      serverSync={serverSync}/>
      <h2>Numbers</h2>
      <PhonebookTable persons = {filteredString} delUser={delUser} />
      <h2>Filter</h2>
      <FilterForm changeFilter = {changeFilter}/>
    </div>
  )
}

export default App
