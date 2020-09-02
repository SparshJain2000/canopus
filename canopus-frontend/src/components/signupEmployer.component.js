import React, { Component, Fragment } from "react";
import { Label, Input, FormGroup, Form, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faMinus,
    faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import InputMap from "./map.component";
import Axios from "axios";
const block = {
    borderRadius: " 0.25rem",
    border: "0.05rem solid lightgrey",
    /* background-color: rgba(0, 0, 0, 0.15); */
    // boxShadow: " 3px 3px 6px rgba(0, 0, 0, 0.3)",
    transition: "0.3s ease-in-out",
};

export default class SignupEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            password: "",
            email: "",
            line: "",
            pin: "",
            city: "",
            state: "",
            links: [""],
            youtube: [""],
            image: [],
            about: "",
            about2: "",
            employeeCount: 0,
            noLinks: 1,
            noYoutube: 1,
            lat: null,
            lng: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.signUp = this.signUp.bind(this);
        this.setCoordinates = this.setCoordinates.bind(this);
    }
    setCoordinates(coords) {
        this.setState({
            lat: coords.lat,
            lng: coords.lng,
        });
    }
    handleChange(e, index) {
        console.log(index);
        if (index !== undefined) {
            let links = this.state[e.target.name];
            links[index] = e.target.value;
            this.setState({
                [e.target.name]: links,
            });
        } else
            this.setState({
                [e.target.name]: e.target.value,
            });
    }
    signUp() {
        const employer = {
            username: this.state.email,
            password: this.state.password,
        };
        console.log(employer);
        Axios.post(`/api/employer`, employer)
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    alert("SignUp successful");
                    window.location = "/employer/update";
                }
            })
            .catch(({ response }) => alert(response.err));
    }
    render() {
        return (
            <div className='make-small'>
                <div className=' p-4 m-3 mx-lg-5' style={block}>
                    <FormGroup>
                        <h4>Sign Up</h4>
                    </FormGroup>

                    <FormGroup>
                        <Label>Email Address</Label>
                        <Input
                            type='email'
                            placeholder='Email Address'
                            name='email'
                            onChange={this.handleChange}
                            defaultValue={this.state.email}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            placeholder='Password'
                            name='password'
                            onChange={this.handleChange}
                            defaultValue={this.state.password}
                        />
                    </FormGroup>
                    <div className=' d-flex justify-content-end'>
                        <Button
                            onClick={this.signUp}
                            // className='w-25'
                            color='primary'>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
