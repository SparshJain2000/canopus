import React, { useState } from "react";

import { NavLink } from "react-router-dom";
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
} from "reactstrap";
import logo from "../images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
const NavbarComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalEmployer, setModalEmployer] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const toggleModal = () => setModal(!modal);
    const toggleModaEmployer = () => setModalEmployer(!modalEmployer);
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
                                <strong className='mx-auto'>JobSeekers</strong>
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
                                    <a
                                        href='#'
                                        className='badge badge-lg badge-primary p-2'>
                                        Signup
                                    </a>
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
                                <strong className='mx-auto'>Employer</strong>
                            </div>
                            <ToastBody className='flex flex-column'>
                                <div>
                                    <a
                                        href='#'
                                        className='text-danger'
                                        onClick={toggleModaEmployer}>
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
                </Collapse>
            </Navbar>
            <div>
                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>
                        Jobseeker Login
                    </ModalHeader>
                    <ModalBody>
                        <div className='login-form'>
                            <form
                                action='/examples/actions/confirmation.php'
                                method='post'>
                                {/* <h2 className='text-center'>Sign in</h2> */}
                                <div className='form-group'>
                                    <div className='input-group'>
                                        <div className='input-group-prepend'>
                                            <span className='input-group-text'>
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                />
                                            </span>
                                        </div>
                                        <input
                                            type='text'
                                            className='form-control'
                                            name='username'
                                            placeholder='Username'
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <div className='input-group'>
                                        <div className='input-group-prepend'>
                                            <span className='input-group-text'>
                                                {" "}
                                                <FontAwesomeIcon
                                                    icon={faLock}
                                                />
                                            </span>
                                        </div>
                                        <input
                                            type='password'
                                            className='form-control'
                                            name='password'
                                            placeholder='Password'
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <button
                                        type='submit'
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
                                    <a
                                        href='#'
                                        className='btn btn-primary mx-2'>
                                        <FontAwesomeIcon icon={faFacebook} />
                                        &nbsp; Facebook
                                    </a>
                                    <a href='#' className='btn btn-danger mx-2'>
                                        <FontAwesomeIcon icon={faGoogle} />
                                        &nbsp; Google
                                    </a>
                                </div>
                            </form>
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
                <Modal isOpen={modalEmployer} toggle={toggleModaEmployer}>
                    <ModalHeader toggle={toggleModaEmployer}>
                        Employer Login
                    </ModalHeader>
                    <ModalBody>
                        <div className='login-form'>
                            <form
                                action='/examples/actions/confirmation.php'
                                method='post'>
                                {/* <h2 className='text-center'>Sign in</h2> */}
                                <div className='form-group'>
                                    <div className='input-group'>
                                        <div className='input-group-prepend'>
                                            <span className='input-group-text'>
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                />
                                            </span>
                                        </div>
                                        <input
                                            type='text'
                                            className='form-control'
                                            name='username'
                                            placeholder='Username'
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <div className='input-group'>
                                        <div className='input-group-prepend'>
                                            <span className='input-group-text'>
                                                {" "}
                                                <FontAwesomeIcon
                                                    icon={faLock}
                                                />
                                            </span>
                                        </div>
                                        <input
                                            type='password'
                                            className='form-control'
                                            name='password'
                                            placeholder='Password'
                                            required
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <button
                                        type='submit'
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
                                    <a
                                        href='#'
                                        className='btn btn-primary mx-2'>
                                        <FontAwesomeIcon icon={faFacebook} />
                                        &nbsp; Facebook
                                    </a>
                                    <a href='#' className='btn btn-danger mx-2'>
                                        <FontAwesomeIcon icon={faGoogle} />
                                        &nbsp; Google
                                    </a>
                                </div>
                            </form>
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
