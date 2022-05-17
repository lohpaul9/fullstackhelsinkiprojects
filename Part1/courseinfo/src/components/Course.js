import React from 'react'

const Course = ({course}) => {
  return (
    <div>
      <Header name = {course.name}/>
      <Content topics = {course.parts}/>
      <TotalEx topics = {course.parts}/>
    </div>
  )
}


const Header = ({name}) => {
  return (
    <>
      <h1>{name}</h1>
    </>
  )
}

const Content = ({topics}) => {
  return (
    <div>
    {topics.map(value => <Topic details = {value} key = {value.id}/>)}
    </div>
  )
}

const Topic = ({details}) => {
  console.log(details)
  return (
    <>
      <p key={details.id}>{details.name} {details.exercises}</p>
    </>
  )
}

const TotalEx = ({topics}) => {
  let total = topics.reduce((p, c) => p + c.exercises, 0);
  return (
    <>
      <p>Number of exercises {total}</p>
    </>
  )
}

export default Course