import { useState } from 'react'


const PhonebookTable = ({persons, delUser}) => {
  if (persons.length === 0) {
    return <h3>No matches / Phonebook Empty</h3>
  }
  else {
    return (
      <table>
        <tbody>
        {persons.map(value => <TablePerson person = {value} key = {value.id} delUser={delUser}/>)}
        </tbody>
      </table>
    )
  }
}


const TablePerson = ({person, delUser}) => {
    const handleDelete = e => {
        e.preventDefault()
        if (window.confirm('Are you sure you want to delete ' + person.name + ' from the phonebook?')) {
            delUser(person.id)
        }
    }

    return (
    <tr>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td><button onClick={handleDelete}>Delete User</button></td>
    </tr>
  )
}

export default PhonebookTable