import React, { Component, Fragment } from "react";
import { Label, Input, FormGroup, Form, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faMinus,
    faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
const block = {
    borderRadius: " 0.25rem",
    border: "0.05rem solid lightgrey",
    transition: "0.3s ease-in-out",
};

export default class EnterPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.signUp = this.signUp.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    signUp(e) {
        e.preventDefault();
        const employer = {
            password: this.state.password,
        };
        console.log(employer);
        const token = window.location.pathname.split("/")[2];
        Axios.put(`/api/employer/forgot/${token}`, employer)
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    console.log("200");
                    window.location = "/employer/update";
                }
            })
            .catch(({ response }) => {
                console.log(response);
                alert(response.data.err.message);
            });
    }
    render() {
        return (
            <div className='make-small'>
                <Form
                    className=' p-4 m-3 mx-lg-5'
                    style={block}
                    onSubmit={this.signUp}>
                    <FormGroup>
                        <h4>Forgot Password</h4>
                    </FormGroup>

                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            placeholder='Password'
                            name='password'
                            onChange={this.handleChange}
                            required
                        />
                    </FormGroup>

                    <div className=' d-flex justify-content-end'>
                        <Button type='submit' color='primary'>
                            Reset Password
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }
}
