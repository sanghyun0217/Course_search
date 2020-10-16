import React from 'react'
import RecommendCard from './RecommendCard'

class RecommendedCourses extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <div>
                    {
                        this.props.courses.map(data => (
                            <RecommendCard data={data} />
                        ))
                    }
                </div>
            </>
        )
    }
}

export default RecommendedCourses