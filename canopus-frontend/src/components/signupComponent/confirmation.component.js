import React, { Component } from "react";
import axios from "axios";
import {
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Button,
} from "reactstrap";
// import NavbarComponent from "../navbar.component";
export default class Confirmation extends Component {
    submit = (e) => {
        e.preventDefault();
        this.props.nextStep();
        // console.log(this.props);
        const { values } = this.props;
        const user = {
            username: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
            address: {
                pin: values.pin,
                city: values.city,
                state: values.state,
            },
        };
        console.log(user);
        axios
            .post(`/api/user/`, user)
            .then((newUser) => {
                console.log(newUser);
                window.location = "/search-jobs";
            })
            .catch((err) => {
                // this.setState({
                //     alert: true,
                // });
                console.log(err.response);
                console.log(this.state.alert);
            });
    };

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    };
    render() {
        const {
            values: { firstName, lastName, email, pin, city, state },
        } = this.props;
        return (
            <div>
                {/* <NavbarComponent /> */}
                <div className='border-block mx-4 p-4 p-lg-5 m-3'>
                    <h3>Details</h3>
                    <ListGroup style={{ background: "rgba(0,0,0,0)" }}>
                        <ListGroupItem>
                            <ListGroupItemHeading name='users'>
                                First Name:
                            </ListGroupItemHeading>
                            <ListGroupItemText>{firstName}</ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading name='users'>
                                Last Name:
                            </ListGroupItemHeading>
                            <ListGroupItemText>{lastName}</ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading name='mail'>
                                Email
                            </ListGroupItemHeading>
                            <ListGroupItemText>
                                <a href='mailto:jack@semantic-ui.com'>
                                    {email}
                                </a>
                            </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading name='marker'>
                                Address
                            </ListGroupItemHeading>
                            <ListGroupItemText>
                                {city},{pin}, {state}
                            </ListGroupItemText>
                        </ListGroupItem>
                    </ListGroup>
                    <div className='row justify-content-start  mx-auto mr-3 mt-2'>
                        <Button onClick={this.back} className='mr-1'>
                            Back
                        </Button>
                        <Button
                            onClick={this.submit}
                            className='ml-1'
                            color='primary'>
                            Confirm
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
