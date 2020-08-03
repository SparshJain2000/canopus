import React, { Component } from "react";
// import NavbarComponent from "../navbar.component";
import { Form, Input, Label, FormGroup, Button } from "reactstrap";

export default class PersonalDetails extends Component {
    saveAndContinue = (e) => {
        e.preventDefault();
        this.props.nextStep();
    };
    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    };
    // state = {  }
    render() {
        const { values } = this.props;
        return (
            <div>
                {/* <NavbarComponent /> */}
                <Form className='border-block p-4 p-lg-5 mx-4 m-3'>
                    <h3>Enter Address Details</h3>
                    <FormGroup>
                        <Label>Pin</Label>
                        <Input
                            placeholder='Pin'
                            onChange={this.props.handleChange("pin")}
                            defaultValue={values.pin}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>City</Label>
                        <Input
                            placeholder='City'
                            onChange={this.props.handleChange("city")}
                            defaultValue={values.city}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>State</Label>
                        <Input
                            placeholder='state'
                            onChange={this.props.handleChange("state")}
                            defaultValue={values.state}
                        />
                    </FormGroup>
                    <FormGroup className='ml-auto mr-1'>
                        <Button onClick={this.back} className='mr-1'>
                            Back
                        </Button>
                        <Button
                            onClick={this.saveAndContinue}
                            className='ml-1'
                            color='primary'>
                            Save And Continue
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}
