import { useState } from 'react'

const FilterForm = ({changeFilter}) => {
  const [field1, setField1] = useState('')

  const handleField1Input = (e) => {
    changeFilter(e.target.value)()
    setField1(e.target.value)
  }


  return (
    <div>
      <form>
        <input type = 'text' value={field1} onChange={handleField1Input}></input>
      </form>
    </div>
  )
  
}

export default FilterForm