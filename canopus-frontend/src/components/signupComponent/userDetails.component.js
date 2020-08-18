import React, { Component } from "react";
// import NavbarComponent from "../navbar.component";
import { Form, Input, Label, FormGroup, Button } from "reactstrap";

export default class UserDetails extends Component {
    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    };
    // state = {  }
    render() {
        const { values } = this.props;
        return (
            <div>
                {/* <NavbarComponent /> */}
                <Form className='block p-4 p-lg-5 mx-4 m-3'>
                    <h3>Enter Details</h3>
                    <FormGroup className='row'>
                        <div className='col-6'>
                            <Label>First Name</Label>
                            <Input
                                placeholder='First Name'
                                onChange={this.props.handleChange("firstName")}
                                defaultValue={values.firstName}
                            />
                        </div>
                        <div className='col-6'>
                            {" "}
                            <Label>Last Name</Label>
                            <Input
                                placeholder='Last Name'
                                onChange={this.props.handleChange("lastName")}
                                defaultValue={values.lastName}
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>Email Address</Label>
                        <Input
                            type='email'
                            placeholder='Email Address'
                            onChange={this.props.handleChange("email")}
                            defaultValue={values.email}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            placeholder='Password'
                            onChange={this.props.handleChange("password")}
                            defaultValue={values.password}
                        />
                    </FormGroup>

                    <Button onClick={this.saveAndContinue} color='primary'>
                        Save And Continue{" "}
                    </Button>
                </Form>
            </div>
        );
    }
}
