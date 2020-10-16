import React from 'react'
import { Card, Button } from 'react-bootstrap'
import CompleteCard from './CompleteCard'

class CompletedCourses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            completeCourses: [],
            complete: []
        }
    }

    componentDidMount() {
        this.initialData()
    }

    async initialData() {
        let coursesURL = 'http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed'
        let coursesData = await (await fetch(coursesURL)).json()
        let temp = this.props.courses

        temp = temp.filter((v) => {
            return coursesData.data.includes(v.number)
        })
        
        this.setState({
            completeCourses: coursesData.data,
            complete: temp
        })
    }

    render() {
        return (
            <>
                { 
                    this.state.complete.map((data) => (  
                        <CompleteCard data={data} courses={this.state.complete} onSel={(data, course) => { this.props.onSel(data, course) }} />
                    ))
                }
            </>
        )
    }
}

export default CompletedCourses