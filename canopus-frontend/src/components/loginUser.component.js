import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ReCAPTCHA from "react-google-recaptcha";
import ReactGA from "react-ga";

const block = {
    borderRadius: " 0.25rem",
    border: "0.05rem solid #eeeeee",
    /* background-color: rgba(0, 0, 0, 0.15); */
    boxShadow: " 2px 2px 3px rgba(0, 0, 0, 0.1)",
    transition: "0.3s ease-in-out",
};

export default class LoginUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            recaptcha: "",
            modal: false,
            message: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitUser = this.submitUser.bind(this);
        this.handleChangeRecaptcha = this.handleChangeRecaptcha.bind(this);
        this.toggle = this.toggle.bind(this);
        this.recaptcha = React.createRef(null);
    }
    toggle() {
        this.setState({ modal: !this.state.modal });
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    handleChangeRecaptcha(e) {
        this.setState({
            recaptcha: e,
        });
    }
    async submitUser(e) {
        e.preventDefault();
        let token;
        try {
            token = await this.recaptcha.current.executeAsync();
            const user = {
                username: this.state.username,
                password: this.state.password,
                captcha: token,
            };
            console.log(user);
            axios
                .post(`/api/user/login`, user)
                .then((newuser) => {
                    console.log(newuser.data.user);
                    this.props.setUser(newuser.data.user);
                    ReactGA.event({
                        category: "User",
                        action: "loggedin",
                        id: `${newuser.data.user._id}`,
                    });
                    this.props.history.push("/search-jobs");
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.response);

                    if (
                        err.response &&
                        err.response.data &&
                        err.response.data.err
                    )
                        this.setState({
                            modal: true,
                            message:
                                err.response.data.err === ""
                                    ? "Invalid login"
                                    : err.response.data.err,
                        });
                });
        } catch (e) {
            console.log(e);
            this.setState({
                modal: true,
                message: "Captcha problem",
            });
            const user = {
                username: this.state.username,
                password: this.state.password,
                captcha: token,
            };
            console.log(user);
            axios
                .post(`/api/user/login`, user)
                .then((newuser) => {
                    console.log(newuser);
                    this.props.setUser(newuser.data.user);
                    ReactGA.event({
                        category: "User",
                        action: "loggedin",
                        id: `${newuser.data.user._id}`,
                    });
                    this.props.history.push("/search-jobs");
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.response);

                    if (
                        err.response &&
                        err.response.data &&
                        err.response.data.err
                    )
                        this.setState({
                            modal: true,
                            message:
                                err.response.data.err === ""
                                    ? "Invalid login"
                                    : err.response.data.err,
                        });
                });
        }
    }
    render() {
        return (
            <div className='row m-1 m-sm-2'>
                <div
                    className='col-11 col-sm-7 col-md-6 col-lg-4 mx-auto p-4'
                    style={block}>
                    <h4 className='mb-5'>Jobseeker Login</h4>
                    <form className='login-form' onSubmit={this.submitUser}>
                        <div className='form-group'>
                            <div className='input-group'>
                                <div className='input-group-prepend'>
                                    <span className='input-group-text'>
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                </div>
                                <input
                                    type='email'
                                    className='form-control'
                                    name='username'
                                    placeholder='Username'
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='input-group'>
                                <div className='input-group-prepend'>
                                    <span className='input-group-text'>
                                        <FontAwesomeIcon icon={faLock} />
                                    </span>
                                </div>
                                <input
                                    type='password'
                                    className='form-control'
                                    name='password'
                                    placeholder='Password'
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <ReCAPTCHA
                            sitekey={`${process.env.REACT_APP_CAPTCHA_INVISIBLE}`}
                            name='recaptcha'
                            size='invisible'
                            // onChange={this.handleChangeRecaptcha}
                            badge='bottomleft'
                            ref={this.recaptcha}
                        />
                        <div className='form-group'>
                            <button
                                type='submit'
                                className='btn btn-primary login-btn btn-block'>
                                Log in
                            </button>
                        </div>
                        <div className='clearfix'>
                            <Link
                                className='text-info float-right'
                                to='/user/forgot'>
                                Forgot Password?
                            </Link>
                        </div>
                        <div className='or-seperator'>
                            <i>or</i>
                        </div>
                        <p className='text-center'>
                            Login with your social media account
                        </p>
                        <div className='text-center social-btn'>
                            <a href='/' className='btn btn-primary mx-2'>
                                <FontAwesomeIcon icon={faFacebook} />
                                &nbsp; Facebook
                            </a>
                            <a href='/' className='btn btn-danger mx-2'>
                                <FontAwesomeIcon icon={faGoogle} />
                                &nbsp; Google
                            </a>
                        </div>

                        <p className='text-center text-muted small'>
                            Don't have an account?{" "}
                            <Link to='/user/signup' className='text-info'>
                                Sign up here!
                            </Link>
                        </p>
                    </form>
                </div>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    style={{ marginTop: "20vh" }}>
                    <ModalHeader toggle={this.toggle} className='py-1'>
                        Error !
                    </ModalHeader>

                    <ModalBody>{this.state.message}</ModalBody>
                </Modal>
            </div>
        );
    }
}
