import React, { useState, useRef } from "react";

import { NavLink, Link } from "react-router-dom";
import {
    // NavLink,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Toast,
    ToastHeader,
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
    const [user, set] = useState(props.user);
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalEmployer, setModalEmployer] = useState(false);
    const [buttonDropdown, setButtonDropdown] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const toggleModal = () => setModal(!modal);
    const toggleModalEmployer = () => setModalEmployer(!modalEmployer);
    const toggleButtonDropdown = () => setButtonDropdown(!buttonDropdown);

    const username = useRef(null);
    const password = useRef(null);
    if (!props.user) {
        axios
            .get(`/api/user/current`)
            .then(({ data }) => {
                if (data.user) {
                    set(data.user);
                    props.setUser(data.user);
                }
            })
            .catch((err) => {
                console.log(err.response);
            });
    }
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
                console.log(newuser);
                props.setUser(newuser);
                set(newuser);

                window.location = "/search-jobs";
            })
            .catch((err) => console.log(err.response));
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
                console.log(newuser);
                props.setUser(newuser);
                set(newuser);
                window.location = "/post";
            })
            .catch((err) => console.log(err.response));
    };
    return (
        <div>
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
                            <NavLink to='#'>Job Alerts</NavLink>
                        </NavItem>
                        <NavItem className='m-1'>
                            <NavLink to='#'>Career Resources</NavLink>
                        </NavItem>
                        <NavItem className='m-1'>
                            <NavLink to='#'>FInd Employees</NavLink>
                        </NavItem>
                        <NavItem className='m-1'>
                            <NavLink to='#'>Career Resources</NavLink>
                        </NavItem>
                        <NavItem className='m-1'>
                            <NavLink to='#'>About US</NavLink>
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
                    {!user ? (
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
                                            className='text-danger'
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
                                            className='badge badge-lg badge-primary p-2'>
                                            Signup
                                        </a>
                                    </div>
                                </ToastBody>
                            </Toast>
                        </Nav>
                    ) : (
                        <Nav className='mt-3 mt-lg-0 ml-auto mx-0 row justify-content-center'>
                            {/* <Button
                                color='primary'
                                style={{ width: "fit-content" }}
                                onClick={() => {
                                    axios
                                        .get("/api/user/logout")
                                        .then((user) => {
                                            console.log(`logout${user}`);
                                            props.setUser(null);
                                            set(null);
                                        })
                                        .catch((err) =>
                                            console.log(err.response),
                                        );
                                }}>
                                {user.firstName}
                            </Button> */}
                            <ButtonDropdown
                                isOpen={buttonDropdown}
                                toggle={toggleButtonDropdown}>
                                <Button
                                    id='caret'
                                    color={
                                        user.role === "Employer"
                                            ? "danger"
                                            : "primary"
                                    }
                                    style={{ width: "max-content" }}>
                                    <FontAwesomeIcon
                                        icon={
                                            user.role === "Employer"
                                                ? faUserPlus
                                                : faUser
                                        }
                                        className='mr-2'
                                    />
                                    {user.firstName}
                                </Button>
                                <DropdownToggle caret color='primary' />
                                <DropdownMenu right>
                                    <Link
                                        to='/profile/'
                                        className='dropdown-item'>
                                        View Profile
                                    </Link>

                                    <DropdownItem divider />
                                    <DropdownItem
                                        onClick={() => {
                                            axios
                                                .get("/api/user/logout")
                                                .then((user) => {
                                                    console.log(
                                                        `logout${user}`,
                                                    );
                                                    props.setUser(null);
                                                    set(null);
                                                    window.location = "/";
                                                })
                                                .catch((err) =>
                                                    console.log(err.response),
                                                );
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
                                <a href='#' className='btn btn-primary mx-2'>
                                    <FontAwesomeIcon icon={faFacebook} />
                                    &nbsp; Facebook
                                </a>
                                <a href='#' className='btn btn-danger mx-2'>
                                    <FontAwesomeIcon icon={faGoogle} />
                                    &nbsp; Google
                                </a>
                            </div>
                            {/* </form> */}
                            <p className='text-center text-muted small'>
                                Don't have an account?{" "}
                                <a href='#'>Sign up here!</a>
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
                                <a href='#' className='btn btn-primary mx-2'>
                                    <FontAwesomeIcon icon={faFacebook} />
                                    &nbsp; Facebook
                                </a>
                                <a href='#' className='btn btn-danger mx-2'>
                                    <FontAwesomeIcon icon={faGoogle} />
                                    &nbsp; Google
                                </a>
                            </div>

                            <p className='text-center text-muted small'>
                                Don't have an account?{" "}
                                <a href='#'>Sign up here!</a>
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
