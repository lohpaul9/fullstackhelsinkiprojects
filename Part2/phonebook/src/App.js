import { useState, useEffect } from 'react'
import AddPersonForm from './components/AddPersonForm'
import PhonebookTable from './components/PhonebookTable'
import FilterForm from './components/FilterForm'
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
          .catch(error => {
              console.log('sync error', error)
          })
  }

  useEffect(serverSync, [])

  const newPersonHandler = (name, number) => {
    const newPerson = {
      name: name, number: number
    }
    return (
        () => {
            personService
                .create(newPerson)
                .then(dbPerson => {
                    displayNotif(dbPerson.name + ' added to phonebook', false)
                    //in actuality this should be refreshed - every change to persons should also
                    //call the server - is this slow? it might be, but I don't know a better workaround

                    personService.getAll()
                        .then(refreshedPeople => {
                            setPersons(refreshedPeople)
                        })
                        .catch(error => {
                            setPersons(persons.concat(dbPerson))
                        })
                })
                .catch(error => {
                    console.log(error)
                    displayNotif(error.response.data.error, true)
                })

        }
    )
  }

  const updatePerson = (newPerson) => {
      personService
          .update(newPerson, newPerson.id)
          .then(() => {
              displayNotif(newPerson.name + ' updated in phonebook', false)
              personService.getAll()
                  .then(refreshedPeople => {
                      setPersons(refreshedPeople)
                  })
                  .catch(error => {
                      console.log(error, 'manually adding people offline')
                      displayNotif(error.response.data, true)
                      setPersons(persons.concat(newPerson))
                  })
          })
          .catch(error => {
              console.log(error)
              displayNotif(error.response.data.error, true)
              setPersons(persons.filter(person => person.id !== newPerson.id))
          })
  }

  const delUser = id => {
      personService
          .delObj(id)
          .then(() => setPersons(persons.filter(person => person.id !== id)))
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
