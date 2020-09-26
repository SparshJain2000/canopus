import React, { Component, Fragment } from "react";
import {
    Label,
    Input,
    FormGroup,
    Form,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
} from "reactstrap";
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

export default class EnterUsername extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            disabled: false,
            message: "",
            modal: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.signUp = this.signUp.bind(this);
    }
    toggleModal() {
        this.setState({
            modal: !this.state.modal,
        });
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    signUp(e) {
        e.preventDefault();
        const employer = {
            username: this.state.email,
        };
        console.log(employer);
        Axios.post(`/api/employer/forgot`, employer)
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    console.log("200");
                    this.setState({
                        disabled: true,
                        modal: true,
                        message: "Check your mailbox !",
                    });
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
                        <Label>Email</Label>
                        <Input
                            type='email'
                            placeholder='Email Address'
                            name='email'
                            onChange={this.handleChange}
                            required
                        />
                    </FormGroup>

                    <div className=' d-flex justify-content-end'>
                        <Button
                            type='submit'
                            color='primary'
                            disabled={this.state.disabled}>
                            Send Mail
                        </Button>
                    </div>
                </Form>
                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggleModal}
                    style={{ marginTop: "20vh" }}>
                    <ModalHeader toggle={this.toggleModal} className='py-1'>
                        Message
                    </ModalHeader>
                    {/* <ModalHeader toggle={toggle}>
                    {mess === "promote" && "Promote"}
                </ModalHeader> */}
                    <ModalBody>{this.state.message}</ModalBody>
                </Modal>
            </div>
        );
    }
}
