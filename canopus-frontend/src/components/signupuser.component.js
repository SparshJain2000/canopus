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
            validate: {},
            Errormodal: false,
            ErrorModalMess: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeRecaptcha = this.handleChangeRecaptcha.bind(this);
        this.signUp = this.signUp.bind(this);
        this.setCoordinates = this.setCoordinates.bind(this);
        this.check = this.check.bind(this);
        this.toggleErrorModal = this.toggleErrorModal.bind(this);
        this.recaptcha = React.createRef(null);
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
            [e.target.name]:
                e.target.value === "" ||
                (e.target.name === "email"
                    ? !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                          e.target.value,
                      )
                    : false)
                    ? false
                    : true,
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
            email:
                this.state.email === "" &&
                !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                    this.state.email,
                )
                    ? false
                    : true,
            password: this.state.password === "" ? false : true,
        };
        console.log(validate);
        this.setState({ validate: validate });
    }
    async signUp(e) {
        e.preventDefault();
        // if ((this.state.email !== "") & (this.state.password !== ""))
        //     this.setState({ valid: true });
        let token;
        try {
            token = await this.recaptcha.current.executeAsync();

            const employer = {
                username: this.state.email,
                password: this.state.password,
                captcha: token,
            };
            console.log(employer);
            if (this.state.validate.email && this.state.validate.password)
                Axios.post(`/api/user`, employer)
                    .then((data) => {
                        console.log(data);
                        if (data.status === 200) {
                            window.location = "/user/verify";
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        let response = err.response;
                        console.log(response);
                        if (response && response.data && response.data.err)
                            this.setState({
                                ErrorModalMess: response.data.err.message,
                                Errormodal: true,
                            });
                    });
        } catch (e) {
            console.log(e);
            this.setState({
                Errormodal: true,
                ErrorModalMessage: "Captcha problem",
            });
        }
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
                                invalid={
                                    this.state.validate.email === undefined
                                        ? false
                                        : !this.state.validate.email
                                }
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
                                invalid={
                                    this.state.validate.password === undefined
                                        ? false
                                        : !this.state.validate.password
                                }
                                required
                            />
                        </FormGroup>
                        <ReCAPTCHA
                            sitekey={`${process.env.REACT_APP_CAPTCHA_INVISIBLE}`}
                            name='recaptcha'
                            size='invisible'
                            badge='bottomleft'
                            ref={this.recaptcha}
                            // onChange={this.handleChangeRecaptcha}
                        />
                        <div className=' d-flex justify-content-end'>
                            <Button
                                onClick={this.signUp}
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
