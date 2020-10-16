import React from 'react'
import { Card, Button, Form } from 'react-bootstrap'

class CompleteCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
        this.select = React.createRef()
    }

    getExpansionButton() {
        let buttonText = '▼';
        let buttonOnClick = () => this.setExpanded(true);
  
        if(this.state.expanded) {
          buttonText = '▲';
          buttonOnClick = () => this.setExpanded(false)
        }
  
        return (
          <Button variant='outline-dark' style={{width: 25, height: 25, fontSize: 12, padding: 0, position: 'absolute', right: 20, top: 20}} onClick={buttonOnClick}>{buttonText}</Button>
        )
      }

      setExpanded(value) {
        this.setState({expanded: value});
      }

      render() {
          const { data } = this.props
          let count = 0
          return (
            <Card style={{width: '50%', margin: '5px auto'}}>
                <Card.Body>
                    <Card.Title>
                        <div style={{maxWidth: 250}}>
                        {data.name}
                        </div>
                        {this.getExpansionButton()}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{data.number} - {data.credits} Credits</Card.Subtitle>
                    {
                        this.state.expanded === true && (
                            <div>
                                {data.description}
                            </div>
                        )
                    }
                    <Form>
                        <Form.Group>
                            <Form.Control ref={this.select} as="select" onClick={() => {this.props.onSel(this.select.current.value, data)}}>
                                <option key="No Rating">No Rating</option>
                                <option key="1">1</option>
                                <option key="2">2</option>
                                <option key="3">3</option>
                                <option key="4">4</option>
                                <option key="5">5</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
          )
      }
}

export default CompleteCard