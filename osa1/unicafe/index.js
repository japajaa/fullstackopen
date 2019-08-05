import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => (
    <button onClick={props.handleClick}>{props.text}</button>
)

const Header = (props) => (
    <h2>{props.text}</h2>
)

const Statistics = (props) => {

    if (props.good + props.neutral + props.bad === 0) return <p>No feedback given</p>

    return (
        <div>
            <table>
                <tbody>
            <Statistic text="good" value={props.good}/>
            <Statistic text="neutral" value={props.neutral}/>
            <Statistic text="bad" value={props.bad}/>
            <Statistic text="total" value={props.good + props.neutral + props.bad}/>
            <Statistic text="average" value={((props.good * 1) + (props.neutral * 0) + (props.bad * -1)) / (props.good + props.neutral + props.bad)}/>
            <Statistic text="positive" value={props.good / (props.good + props.neutral + props.bad) *100 + " %"} />
                </tbody>
            </table>
        </div>
    )
}


const Statistic = (props) => (
    <tr><td>{props.text}</td><td>{props.value}</td></tr>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Header text="give feedback"/>
      <Button handleClick={handleGoodClick} text="Good"/>
      <Button handleClick={handleNeutralClick} text="Neutral"/>
      <Button handleClick={handleBadClick} text="Bad"/>
      <Header text="statistics"/>
      <Statistics text="Good" good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)