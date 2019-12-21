import React from 'react'

const Course = ({course}, {key}) => {
    return (
        <div key={key}>
        <Header name={course.name} />
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
        </div>
    )
}

const Header = ({name}) => {
    return (
        <div>
            <h2>{name}</h2>
        </div>
    )
}

const Content = ({parts}) => {
    
    const result = parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)
    
    return (
        <div>
            {result}
       </div>
    )
}

const Part = (props) => {
    return (
        <div>
            <p>{props.name} {props.exercises}</p>
        </div>
    )
}

const Total = ({parts}) => {

    const totalSum = parts.map(part => part.exercises).reduce(
        function(a,b) {
            return a + b
        }, 0)

    return (
        <div>
            <p><b>Total of exercises {totalSum}</b></p>
        </div>
    )
}

export default Course