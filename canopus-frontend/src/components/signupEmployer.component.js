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
    /* background-color: rgba(0, 0, 0, 0.15); */
    boxShadow: " 3px 3px 6px rgba(0, 0, 0, 0.3)",
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
        };
        this.handleChange = this.handleChange.bind(this);
        this.signUp = this.signUp.bind(this);
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
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            username: this.state.email,
            password: this.state.password,
            links: this.state.links,
            youtube: this.state.youtube,
            address: {
                pin: this.state.pin,
                city: this.state.city,
                state: this.state.state,
            },
            description: {
                about: this.state.about,
            },
        };
        console.log(employer);
        Axios.post(`/api/employer`, employer)
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    alert("SignUp successful");
                    window.location = "/employer";
                }
            })
            .catch(({ response }) => alert(response.err));
    }
    render() {
        return (
            <div className='m-2'>
                <div className=' p-4 m-3' style={block}>
                    <FormGroup>
                        <h4>Details</h4>
                    </FormGroup>
                    <FormGroup className='row'>
                        <div className='col-12 col-sm-6 p-0 pr-0 pr-sm-1 my-1'>
                            <Label>First Name</Label>
                            <Input
                                placeholder='First Name'
                                name='firstName'
                                onChange={this.handleChange}
                                defaultValue={this.state.firstName}
                            />
                        </div>
                        <div className='col-12 col-sm-6 p-0 pl-0 pl-sm-1 my-1'>
                            {" "}
                            <Label>Last Name</Label>
                            <Input
                                placeholder='Last Name'
                                name='lastName'
                                onChange={this.handleChange}
                                defaultValue={this.state.lastName}
                            />
                        </div>
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
                </div>
                <div className='p-4 m-3' style={block}>
                    <FormGroup>
                        <h4>Address</h4>
                    </FormGroup>
                    <FormGroup className='row'>
                        <div className='col-12 col-sm-6 pr-1'>
                            <Label>PIN</Label>
                            <Input
                                placeholder='PIN'
                                name='pin'
                                onChange={this.handleChange}
                                defaultValue={this.state.pin}
                            />
                        </div>
                        <div className='col-12 col-sm-6 pl-1'>
                            <Label>City</Label>
                            <Input
                                placeholder='city'
                                name='city'
                                onChange={this.handleChange}
                                defaultValue={this.state.city}
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label>State</Label>
                        <Input
                            placeholder='state'
                            name='state'
                            onChange={this.handleChange}
                            defaultValue={this.state.state}
                            // onChange={this.props.handleChange("email")}
                            // defaultValue={values.email}
                        />
                    </FormGroup>
                </div>
                <div className='p-4 m-3' style={block}>
                    <FormGroup>
                        <h4>About Organization</h4>
                    </FormGroup>
                    <FormGroup>
                        <Label className='row'>
                            <h5 className='col-9  col-sm-11 pl-0'>Links</h5>

                            <FontAwesomeIcon
                                icon={faPlusCircle}
                                size='lg'
                                onClick={() => {
                                    let links = this.state.links;
                                    links.push("");
                                    this.setState({
                                        links: links,
                                    });
                                }}
                                className='col-3 col-sm-1 text-info'
                                style={{ cursor: "pointer" }}
                            />
                        </Label>
                        {this.state.links.map((x, i) => (
                            <div className='my-1 row'>
                                <Input
                                    id={i}
                                    placeholder='Social Media Links'
                                    name='links'
                                    onChange={(e) => this.handleChange(e, i)}
                                    value={this.state.links[i]}
                                    className='col-9 col-sm-10 col-md-11'
                                />
                                <FontAwesomeIcon
                                    icon={faMinusCircle}
                                    className='text-danger my-auto col-3 col-sm-2 col-md-1'
                                    size='lg'
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        let links = this.state.links;
                                        links.splice(i, 1);
                                        this.setState({
                                            links: links,
                                        });
                                    }}
                                />
                            </div>
                        ))}
                        <hr />
                        <Label className='row mt-2'>
                            <h5 className='col-9 col-sm-11 pl-0'>
                                Youtube Links
                            </h5>
                            <FontAwesomeIcon
                                icon={faPlusCircle}
                                size='lg'
                                onClick={() => {
                                    let youtube = this.state.youtube;
                                    youtube.push("");
                                    this.setState({
                                        youtube: youtube,
                                    });
                                }}
                                className='col-3 col-sm-1 text-info'
                                style={{ cursor: "pointer" }}
                            />
                        </Label>
                        {this.state.youtube.map((x, i) => (
                            <div className='my-1 row'>
                                <Input
                                    id={i}
                                    placeholder='Youtube Links'
                                    name='youtube'
                                    onChange={(e) => this.handleChange(e, i)}
                                    value={this.state.youtube[i]}
                                    className='col-9 col-sm-10 col-md-11'
                                />
                                <FontAwesomeIcon
                                    icon={faMinusCircle}
                                    className='text-danger col-3 col-sm-2 col-md-1 my-auto'
                                    size='lg'
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        let youtube = this.state.youtube;
                                        youtube.splice(i, 1);
                                        this.setState({
                                            youtube: youtube,
                                        });
                                    }}
                                />
                            </div>
                        ))}
                        <hr />
                        <FormGroup>
                            <h5>About Organization</h5>
                            <textarea
                                name=''
                                className='form-control'
                                name='about'
                                defaultValue={this.state.about}
                                onChange={this.handleChange}
                                rows='4'
                                placeholder='About Organization'></textarea>
                        </FormGroup>
                    </FormGroup>
                </div>
                <div className='p-4 m-3 d-flex justify-content-end'>
                    <Button
                        onClick={this.signUp}
                        className='w-50'
                        size='lg'
                        color='primary'>
                        Sign Up
                    </Button>
                </div>
            </div>
        );
    }
}
