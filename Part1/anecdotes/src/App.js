import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const anecdoteInitializer = anecdotes.map((element, i) => 
  {return {anecdote: element, index: i, votes: 0}})

  const [anecdoteInfo, setAnecdoteInfo] = useState(anecdoteInitializer)

  const vote = (index) => {
    return (
      () => {
        const anecdoteInfoNew = [...anecdoteInfo]
        anecdoteInfoNew[index].votes = anecdoteInfo[index].votes + 1
        setAnecdoteInfo(anecdoteInfoNew)
      }
    )
  }

  return (
    <div>
      <TopQuoteDisplay anecdoteInfo={anecdoteInfo}/>
      <CurrentQuoteDisplay anecdoteInfo={anecdoteInfo} vote ={vote}/>
    </div>
  )
}

const TopQuoteDisplay = ({anecdoteInfo}) => {
  let topQuote = anecdoteInfo[0].anecdote
  let topVotes = anecdoteInfo[0].votes
  let topIndex = 0
  anecdoteInfo.forEach(
    (element, index) => {
      if (element.votes > topVotes) {
        topQuote = element.anecdote
        topVotes = element.votes
        topIndex = index
      }
    }
  )
  return (
    <div>
      <DisplayTitle text = "Audience Choice!"/>
      <DisplayQuote quote={topQuote}/>
      <DisplayVote singleAnecdote={anecdoteInfo[topIndex]}/>
    </div>
  )
}


const CurrentQuoteDisplay = ({anecdoteInfo, vote}) => {
  const [selected, setSelected] = useState(0)
  const randSelected = () => {
    let next = Math.floor(Math.random()*anecdoteInfo.length)
    while (selected === next) {
      next = Math.floor(Math.random()*anecdoteInfo.length)
    }
    setSelected(next)}
  return (
    <div>
      <DisplayTitle text = "Quote of the day"/>
      <DisplayQuote quote = {anecdoteInfo[selected].anecdote}/>
      <DisplayVote singleAnecdote={anecdoteInfo[selected]}/>
      <Button onClick={vote(selected)} label = 'vote'/>
      <Button onClick={randSelected} label = 'next'/>
    </div>
  )
}

const DisplayTitle = ({text}) => {
  return (
    <h1>{text}</h1>
  )
}

const DisplayQuote = ({quote}) => {
  return (
    <h3>{quote}</h3>
  )
}

const DisplayVote = ({singleAnecdote}) => {
  return (
    <h3>has {singleAnecdote.votes} votes</h3>
  )
}

const Button = ({onClick, label}) => {
  return (
    <button onClick = {onClick}>{label}</button>
  )
}

export default App