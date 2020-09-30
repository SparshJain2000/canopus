import React, { Component, Fragment } from "react";
import {
    Label,
    Input,
    FormGroup,
    Form,
    Nav,
    NavItem,
    Button,
    FormFeedback,
    Modal,
    ModalHeader,
    ModalBody,
} from "reactstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faMinus,
    faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import InputMap from "./map.component";
import { Redirect, withRouter, NavLink } from "react-router-dom";
import Axios from "axios";
const block = {
    borderRadius: " 0.25rem",
    border: "0.05rem solid lightgrey",
    /* background-color: rgba(0, 0, 0, 0.15); */
    boxShadow: " 3px 3px 6px rgba(0, 0, 0, 0.3)",
    transition: "0.3s ease-in-out",
};

export default class SignupUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            password: "",
            recaptcha: "",
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
            validate: {
                email: false,
                password: false,
            },
            Errormodal: false,
            ErrorModalMess: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeRecaptcha = this.handleChangeRecaptcha.bind(this);
        this.signUp = this.signUp.bind(this);
        this.setCoordinates = this.setCoordinates.bind(this);
        this.check = this.check.bind(this);
        this.toggleErrorModal = this.toggleErrorModal.bind(this);
    }
    toggleErrorModal() {
        this.setState({
            Errormodal: !this.state.Errormodal,
        });
    }
    setCoordinates(coords) {
        this.setState({
            lat: coords.lat,
            lng: coords.lng,
        });
    }
    handleChangeRecaptcha(e) {
        console.log(e);
        this.setState({
            recaptcha: e,
        });
    }
    handleChange(e, index) {
        console.log(index);
        let { validate } = this.state;
        validate = {
            ...validate,
            [e.target.name]: e.target.value === "" ? false : true,
        };
        this.setState({ validate });
        console.log(validate);
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
    check(e) {
        const validate = {
            email: this.state.email === "" ? false : true,
            password: this.state.password === "" ? false : true,
        };
        console.log(validate);
        this.setState({ validate: validate });
    }
    signUp(e) {
        e.preventDefault();
        // if ((this.state.email !== "") & (this.state.password !== ""))
        //     this.setState({ valid: true });

        const employer = {
            username: this.state.email,
            password: this.state.password,
            captcha: this.state.recaptcha,
        };
        console.log(employer);
        if (this.state.validate.email && this.state.validate.password)
            Axios.post(`/api/user`, employer)
                .then((data) => {
                    console.log(data);
                    if (data.status === 200) {
                        // alert("SignUp successful");
                        window.location = "/user/verify";
                        // this.props.history.push({
                        //     pathname: "/employer/verify",
                        //     state: { username: this.state.username },
                        // });
                        // return (
                        //     <Redirect
                        //         to={{
                        //             pathname: "/employer/verify",
                        //             state: { username: this.state.username },
                        //         }}
                        //     />
                        // );
                    }
                })
                .catch((err) => {
                    console.log(err);
                    let response = err.response;
                    console.log(response);
                    // alert(response.data.err.message);
                    if (response && response.data && response.data.err)
                        this.setState({
                            ErrorModalMess: response.data.err.message,
                            Errormodal: true,
                        });
                });
    }
    render() {
        return (
            <div>
                <Nav tabs className='justify-content-between '>
                    <div className='row justify-content-start'>
                        <NavItem className='mx-1 mx-sm-2 '>
                            <NavLink
                                to='/user/login'
                                // onClick={() => {
                                //     this.toggleTab("1");
                                // }}
                                className={` nav-link p-1 p-sm-2`}>
                                <h6>Login</h6>
                            </NavLink>
                        </NavItem>
                        <NavItem className='mx-1 mx-sm-2'>
                            <NavLink
                                to='/user/signup'
                                className={`active-tab nav-link p-1 p-sm-2`}>
                                <h6>Signup</h6>
                            </NavLink>
                        </NavItem>
                        <NavItem className='mx-1 mx-sm-2'>
                            <NavLink
                                to='/user/forgot'
                                className={`nav-link p-1 p-sm-2`}>
                                <h6>Forgot password</h6>
                            </NavLink>
                        </NavItem>
                    </div>
                </Nav>

                <div className='row m-1 m-sm-2 '>
                    <Form
                        className='col-11 col-sm-7 col-md-6 col-lg-5 mx-auto p-4 '
                        style={block}
                        noValidate>
                        <FormGroup>
                            <h4 className='mb-5'>Sign Up</h4>
                        </FormGroup>

                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type='email'
                                placeholder='Email Address'
                                name='email'
                                onChange={(e) => {
                                    this.handleChange(e);
                                    // this.check(e);
                                }}
                                defaultValue={this.state.email}
                                required
                                invalid={!this.state.validate.email}
                            />
                            <FormFeedback invalid>
                                Please input a correct email.
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type='password'
                                placeholder='Password'
                                name='password'
                                onChange={(e) => {
                                    this.handleChange(e);
                                    // this.check(e);
                                }}
                                defaultValue={this.state.password}
                                invalid={!this.state.validate.password}
                                required
                            />
                        </FormGroup>
                        <ReCAPTCHA
                            sitekey={`${process.env.REACT_APP_CAPTCHA_FRONTEND}`}
                            name='recaptcha'
                            // size='invisible'
                            onChange={this.handleChangeRecaptcha}
                        />
                        <div className=' d-flex justify-content-end'>
                            <Button
                                onClick={this.signUp}
                                // className='w-25'
                                disabled={
                                    this.state.validate.email === false ||
                                    this.state.validate.password === false
                                }
                                color='primary'>
                                Sign Up
                            </Button>
                        </div>
                    </Form>
                    <Modal
                        isOpen={this.state.Errormodal}
                        toggle={this.toggleErrorModal}
                        style={{ marginTop: "20vh" }}>
                        <ModalHeader
                            toggle={this.toggleErrorModal}
                            className='py-1'>
                            Message
                        </ModalHeader>
                        {/* <ModalHeader toggle={toggle}>
                    {mess === "promote" && "Promote"}
                </ModalHeader> */}
                        <ModalBody>{this.state.ErrorModalMess}</ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}
