import { useState } from 'react'

const AddPersonForm = ({addPerson, persons, updatePerson, serverSync}) => {
  const [fieldPerson, setFieldPerson] = useState('')
  const [fieldNumber, setFieldNumber] = useState('')

  const handlePersonInput = (e) => {
    setFieldPerson(e.target.value)
  }
  
  const handleNumberInput = (e) => {
    setFieldNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    serverSync().then(
        newPersons => {
          console.log('old persons', persons)
          console.log('new persons', newPersons)
          const alreadyRegistered = newPersons.reduce((p, c) => p || (c.name === fieldPerson), false)
          if (alreadyRegistered) {
            if (window.confirm(`${fieldPerson} is already registered, do you want to update their number?`)){
              const newPerson = {...newPersons.find(person => person.name === fieldPerson), number: fieldNumber}
              updatePerson(newPerson)
              setFieldNumber('')
              setFieldPerson('')
            }
          }
          else {
            addPerson(fieldPerson, fieldNumber)()
            setFieldNumber('')
            setFieldPerson('')
          }

        }
    )
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <p>Person:</p>
      <input type = 'text' value={fieldPerson} onChange={handlePersonInput}></input>
      <p>Number:</p>
      <input type = 'text' value={fieldNumber} onChange={handleNumberInput}></input>
      <button type = 'submit' >Add New Person</button>
    </form>
    </div>
  )
}

export default AddPersonForm