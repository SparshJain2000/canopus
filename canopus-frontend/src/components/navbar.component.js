import React, { useState, useRef } from "react";

import { NavLink, Link } from "react-router-dom";
import {
    // NavLink,
    Collapse,
    Navbar,
    NavbarToggler,
    Alert,
    NavbarBrand,
    Nav,
    NavItem,
    Toast,
    ToastBody,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    ModalFooter,
    ButtonDropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from "reactstrap";
import logo from "../images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faLock,
    faSignOutAlt,
    faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
const NavbarComponent = (props) => {
    // const [user, set] = useState(props.user);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    // const [loaded, setLoaded] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalEmployer, setModalEmployer] = useState(false);
    const [buttonDropdown, setButtonDropdown] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const toggleModal = () => setModal(!modal);
    const toggleModalEmployer = () => setModalEmployer(!modalEmployer);
    const toggleButtonDropdown = () => setButtonDropdown(!buttonDropdown);

    const username = useRef(null);
    const password = useRef(null);
    // if (props.user) setLoaded(true);
    if (!props.user) {
        // props.getUser();
        axios
            .get(`/api/user/current`)
            .then(({ data }) => {
                if (data.user) {
                    // set(data.user);
                    props.setUser(data.user);
                    // setLoaded(true);
                }
            })
            .catch((err) => {
                // console.log(err.response);
                console.log(err.response.data.name);
                setError(err.response.data.name);
                setShowError(true);
                // setLoaded(true);
            });
    }
    // else set(props.user);
    const submit = () => {
        const user = {
            username: username.current.value,
            password: password.current.value,
        };
        toggleModal();

        // console.log(user);
        axios
            .post(`/api/user/login`, user)
            .then((newuser) => {
                console.log(newuser.data.user);
                props.setUser(newuser.data.user);
                // set(newuser.data.user);
                // setLoaded(true);

                window.location = "/search-jobs";
            })
            .catch((err) => {
                setShowError(true);

                // console.log(err.response);
                if (err.response.data.err.name === "IncorrectPasswordError")
                    setError("Invalid Credentials");
                // setLoaded(true);
            });
    };
    const submitEmployer = () => {
        const user = {
            username: username.current.value,
            password: password.current.value,
        };
        toggleModalEmployer();

        // console.log(user);
        axios
            .post(`/api/employer/login`, user)
            .then((newuser) => {
                console.log(newuser.data.employer);
                props.setUser(newuser.data.employer);
                // set(newuser.data.employer);
                // setLoaded(true);
                window.location = "/employer";
            })
            .catch((err) => {
                console.log(err.response);
                // setLoaded(true);
                setShowError(true);
                console.log(err.response.data.name);
                if (err.response.data.err.name === "IncorrectPasswordError")
                    setError("Invalid Credentials");
            });
    };
    return (
        <div>
            <Alert
                color='danger'
                isOpen={showError}
                toggle={() => {
                    setShowError(false);
                }}>
                {error}
            </Alert>
            <Navbar color='light' light expand='lg'>
                <img src={logo} alt='logo' width='30px' />
                <NavbarBrand href='/' className='ml-2 text-align-center'>
                    Canopus
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav
                        className='row mx-auto justify-content-center px-5'
                        // style={{ maxWidth: "7    0%" }}
                        navbar>
                        <NavItem className='m-1'>
                            <NavLink to='/search-jobs'>Job Search</NavLink>
                        </NavItem>
                        <NavItem className='m-1'>
                            <NavLink to='/employer'>FInd Employees</NavLink>
                        </NavItem>
                        <NavItem className='m-1'>
                            <NavLink to='/'>Career Resources</NavLink>
                        </NavItem>
                        <NavItem className='m-1'>
                            <NavLink to='/'>About US</NavLink>
                        </NavItem>

                        {/* <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Options
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>Option 1</DropdownItem>
                                <DropdownItem>Option 2</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>Reset</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}
                    </Nav>
                    {!props.user ? (
                        <Nav
                            className='row ml-auto align-content-center justify-content-center mt-3 mt-lg-0'
                            style={{ minWidth: "35%" }}>
                            <Toast
                                className='my-auto mx-1'
                                style={{
                                    border: "1px solid #4180cb",
                                    width: "45%",
                                }}>
                                <div className='toast-header '>
                                    <strong className='mx-auto'>
                                        JobSeekers
                                    </strong>
                                </div>
                                <ToastBody className='flex flex-column'>
                                    <div>
                                        <a
                                            href='#'
                                            className='text-primary'
                                            onClick={toggleModal}>
                                            Login
                                        </a>
                                    </div>
                                    <div className='mt-2'>
                                        <Link
                                            to='/user/signup'
                                            className='badge badge-lg badge-primary p-2'>
                                            Signup
                                        </Link>
                                    </div>
                                </ToastBody>
                            </Toast>
                            <Toast
                                className=' my-auto mx-1'
                                style={{
                                    border: "1px solid rgb(255, 136, 0)",
                                    width: "45%",
                                }}>
                                <div className='toast-header px-auto'>
                                    <strong className='mx-auto'>
                                        Employer
                                    </strong>
                                </div>
                                <ToastBody className='flex flex-column'>
                                    <div>
                                        <a
                                            href='#'
                                            className='text-danger'
                                            onClick={toggleModalEmployer}>
                                            Login
                                        </a>
                                    </div>
                                    <div className='mt-2'>
                                        <a
                                            href='#'
                                            className='badge badge-lg badge-danger p-2'>
                                            Signup
                                        </a>
                                    </div>
                                </ToastBody>
                            </Toast>
                        </Nav>
                    ) : (
                        <Nav className='mt-3 mt-lg-0 ml-auto mx-0 row justify-content-center'>
                            <ButtonDropdown
                                isOpen={buttonDropdown}
                                toggle={toggleButtonDropdown}>
                                <Button
                                    id='caret'
                                    color={
                                        props.user.role === "Employer"
                                            ? "info"
                                            : "primary"
                                    }
                                    style={{ width: "max-content" }}>
                                    <FontAwesomeIcon
                                        icon={
                                            props.user.role === "Employer"
                                                ? faUserPlus
                                                : faUser
                                        }
                                        className='mr-2'
                                    />
                                    {props.user.firstName}
                                </Button>
                                <DropdownToggle
                                    caret
                                    color={
                                        props.user.role === "Employer"
                                            ? "info"
                                            : "primary"
                                    }
                                />
                                <DropdownMenu right>
                                    {props.user.role === "Employer" ? (
                                        <Link
                                            to='/employer'
                                            className='dropdown-item'>
                                            Post/View Jobs
                                        </Link>
                                    ) : (
                                        <Link
                                            to='/profile/'
                                            className='dropdown-item'>
                                            View Profile
                                        </Link>
                                    )}
                                    <DropdownItem divider />
                                    <DropdownItem
                                        onClick={() => {
                                            axios
                                                .get(`/api/user/logout`)
                                                .then((user) => {
                                                    console.log(
                                                        `logout${user}`,
                                                    );
                                                    props.setUser(null);
                                                    // set(null);
                                                    // setLoaded(true);

                                                    window.location = "/";
                                                })
                                                .catch((err) => {
                                                    console.log(err.response);
                                                    // setLoaded(true);
                                                });
                                        }}>
                                        logout
                                        <FontAwesomeIcon
                                            icon={faSignOutAlt}
                                            className='ml-3'
                                        />
                                    </DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                        </Nav>
                    )}
                </Collapse>
            </Navbar>
            <div>
                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>
                        Jobseeker Login
                    </ModalHeader>
                    <ModalBody>
                        <div className='login-form'>
                            {/* <form> */}
                            {/* <h2 className='text-center'>Sign in</h2> */}
                            <div className='form-group'>
                                <div className='input-group'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'>
                                            <FontAwesomeIcon icon={faUser} />
                                        </span>
                                    </div>
                                    <input
                                        type='text'
                                        className='form-control'
                                        name='username'
                                        placeholder='Username'
                                        ref={username}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='input-group'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'>
                                            {" "}
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                    </div>
                                    <input
                                        type='password'
                                        className='form-control'
                                        name='password'
                                        placeholder='Password'
                                        ref={password}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <button
                                    type='submit'
                                    onClick={submit}
                                    className='btn btn-primary login-btn btn-block'>
                                    Log in
                                </button>
                            </div>
                            <div className='clearfix'>
                                <a href='#' className='float-right'>
                                    Forgot Password?
                                </a>
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
                            {/* </form> */}
                            <p className='text-center text-muted small'>
                                Don't have an account?{" "}
                                <a href='/'>Sign up here!</a>
                            </p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={toggle}>
                            Login
                        </Button>{" "}
                        <Button color='secondary' onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
            <div>
                <Modal isOpen={modalEmployer} toggle={toggleModalEmployer}>
                    <ModalHeader toggle={toggleModalEmployer}>
                        Employer Login
                    </ModalHeader>
                    <ModalBody>
                        <div className='login-form'>
                            {/* <h2 className='text-center'>Sign in</h2> */}
                            <div className='form-group'>
                                <div className='input-group'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'>
                                            <FontAwesomeIcon icon={faUser} />
                                        </span>
                                    </div>
                                    <input
                                        type='text'
                                        className='form-control'
                                        name='username'
                                        placeholder='Username'
                                        ref={username}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <div className='input-group'>
                                    <div className='input-group-prepend'>
                                        <span className='input-group-text'>
                                            {" "}
                                            <FontAwesomeIcon icon={faLock} />
                                        </span>
                                    </div>
                                    <input
                                        type='password'
                                        className='form-control'
                                        name='password'
                                        placeholder='Password'
                                        ref={password}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='form-group'>
                                <button
                                    type='submit'
                                    onClick={submitEmployer}
                                    className='btn btn-primary login-btn btn-block'>
                                    Log in
                                </button>
                            </div>
                            <div className='clearfix'>
                                <a href='/' className='float-right'>
                                    Forgot Password?
                                </a>
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
                                <a href='/'>Sign up here!</a>
                            </p>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={toggle}>
                            Login
                        </Button>{" "}
                        <Button color='secondary' onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
};
export default NavbarComponent;
