import React, { Component } from "react";
// import NavbarComponent from "./navbar.component.js";
// import { Form, Input, Label, FormGroup, Button } from "reactstrap";
import UserDetails from "./signupComponent/userDetails.component";
import PersonalDetails from "./signupComponent/personalDetails.component";
import Confirmation from "./signupComponent/confirmation.component.js";
export default class SignupUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            age: "",
            pin: "",
            city: "",
            state: "",
            experience: {
                title: "",
                name: "",
                line: "",
            },
        };
    }
    nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1,
        });
    };

    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1,
        });
    };
    handleChange = (input) => (event) => {
        this.setState({ [input]: event.target.value });
    };
    render() {
        const { step } = this.state;
        const {
            firstName,
            lastName,
            email,
            age,
            city,
            state,
            pin,
            password,
        } = this.state;
        const values = {
            firstName,
            lastName,
            email,
            age,
            city,
            state,
            pin,
            password,
        };
        switch (step) {
            case 1:
                return (
                    <UserDetails
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        values={values}
                    />
                );
            case 2:
                return (
                    <PersonalDetails
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        handleChange={this.handleChange}
                        values={values}
                    />
                );
            case 3:
                return (
                    <Confirmation
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        values={values}
                    />
                );
            // case 4:
            //     return <Success />
            default:
                return (
                    <UserDetails
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                        values={values}
                    />
                );
        }
    }
}
