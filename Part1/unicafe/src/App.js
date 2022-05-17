import { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good + neutral + bad
  const average = ((good - bad))/all
  const positive = good/all
  const arr = [['Good', good],['Neutral', neutral], ['Bad', bad],
  ['all', all], ['average', average], ['positive', positive]]

  const addGood = () =>{
    setGood(good + 1)
  }

  const addNeutral = () =>{
    setNeutral(neutral + 1)
  }

  const addBad = () =>{
    setBad(bad + 1)
  }

  

  return (
    <div>
      <Title text = 'give feedback'/>
      <Button onClick = {addGood} label = 'good'/>
      <Button onClick = {addNeutral} label = 'neutral'/>
      <Button onClick = {addBad} label = 'bad'/>
      <Table allDataArray = {arr}/>
    </div>
  )
}

const Title = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const Button = ({onClick, label}) => {
  return (
    <button onClick = {onClick}>{label}</button>
  )
}

const TableElement = ({dataArray}) => {
  const arrToHTML = dataArray.map((value) => <td key={value}>{value}</td>)
  return (
    <>
      {arrToHTML}
    </>
  )
}

const Table = ({allDataArray}) => {
  if (allDataArray[3][1] === 0) {
    return <p>'add feedback to start!'</p>
  }
  else {
    const arrToHTML = allDataArray.map((value, index) => <tr key={index}><TableElement dataArray = {value}/></tr>)
    return (
      <table>
        <tbody>
        {arrToHTML}
        </tbody>
      </table>
    )
  }

}



export default App