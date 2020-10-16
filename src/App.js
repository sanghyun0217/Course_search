import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CompletedCourses from './CompletedCourses';
import RecommendedCourses from './RecommendedCourses'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      stop: false,
      recommend: [],
      modal: false,
      requi: []
    };
  }



  componentDidMount() {
   this.loadInitialState()
  }

  async loadInitialState(){
    let courseURL = "http://mysqlcs639.cs.wisc.edu:53706/api/react/classes";
    await this.setState({
      stop: true
    })
    let courseData = await (await fetch(courseURL)).json()
    console.log(courseData)
    await this.setState({
      stop: false
    })

    this.setState({allCourses: courseData, filteredCourses: courseData, subjects: this.getSubjects(courseData)});
  }


  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(let i = 0; i < data.length; i++) {
      if(subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))// I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {return x.number===data.course})
    if (courseIndex === -1)
    {
      return 
    }
    if('subsection' in data) {
      if(data.course in this.state.cartCourses) {
        if(data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        }
        else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    }
    else if('section' in data) {
      if(data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) {
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      
      
      }
      else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for(let i = 0; i < this.state.allCourses[courseIndex].sections[data.section].subsections.length; i++) { 
          newCartCourses[data.course][data.section].push(this.state.allCourses[courseIndex].sections[data.section].subsections[i]);
        }
      }
    }
    else {
      newCartCourses[data.course] = {};


      for (let i = 0; i < this.state.allCourses[courseIndex].sections.length; i++){
        newCartCourses[data.course][i] = [];

         for(let c= 0; c < this.state.allCourses[courseIndex].sections[i].subsections.length; c ++){
          newCartCourses[data.course][i].push(this.state.allCourses[courseIndex].sections[i].subsections[c]);
        }

      }


    }
    if(Object.keys(this.state.cartCourses).length === 0) {
      let filterCourse = this.state.requi
      let temp
      temp = this.state.allCourses.filter(v => {
        return v.number === data.course
      })[0]
      filterCourse.push(temp)
      this.setState({requi: filterCourse})
    }
    let tempReq = this.state.requi
    let Count = 0
    tempReq.forEach(v => {
      if(v.requisites.length !== 0) {
        v.requisites[0].forEach(name => {
          if(name === data.course) {
            Count++;
          }
        })
      }
    })
    console.log(Count)
    if(Count > 0) {
      if(!window.confirm("You add it ?")) {
        return 
      }
    }
    if(Object.keys(this.state.cartCourses).length !== 0){
      let filterCourse = this.state.requi
      let temp
      temp = this.state.allCourses.filter(v => {
        return v.number === data.course
      })[0]
      filterCourse.push(temp)
      this.setState({requi: filterCourse})
    }

    this.setState({
      cartCourses: newCartCourses
    });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses))

    if('subsection' in data) {
      newCartCourses[data.course][data.section].splice(newCartCourses[data.course][data.section].indexOf(data.subsection), 1);
      if(newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else if('section' in data) {
      delete newCartCourses[data.course][data.section];
      if(Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    }
    else {
      delete newCartCourses[data.course];
    }
    this.setState({cartCourses: newCartCourses});
  }

  getCartData() {
    let cartData = [];

    for(const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {return x.number === courseKey})

      cartData.push(course);
    }
    return cartData;
  }

  onSel(courses, course) {
    let temp = this.state.recommend
    if(Number(courses) >= 3 && courses !== 'No Rating' && !temp.includes(course)) {
      temp.push(course)
    } else {
      temp = temp.filter(v => {
        return !(course === v)
      })
    }
    this.setState({
      recommend: temp
    })
  }

  render() {

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" style={{position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white'}}>
          <Tab eventKey="search" title="Search" style={{paddingTop: '5vh'}}>
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.state.filteredCourses} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea data={this.getCartData()} addCartCourse={(data) => this.addCartCourse(data)} removeCartCourse={(data) => this.removeCartCourse(data)} cartCourses={this.state.cartCourses}/>
            </div>
          </Tab>
          <Tab eventKey="completedCourses" title="Completed Courses" style={{paddingTop: '5vh'}}>
            {
            this.state.stop ?<>loading...</> : (<div style={{marginLeft: '9vw'}}>
              <CompletedCourses courses={this.state.allCourses} onSel={(data, course) => {this.onSel(data, course)}} />
            </div>)
            }
          </Tab>
          <Tab eventKey="recommendedCourses" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '9vw'}}>
              <RecommendedCourses courses={this.state.recommend}  />
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;
