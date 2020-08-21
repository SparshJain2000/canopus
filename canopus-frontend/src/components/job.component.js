import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapMarkerAlt,
    faEnvelope,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
    Badge,
    Alert,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Media,
    ModalFooter,
} from "reactstrap";
import hospital from "../images/hospital.svg";
import error from "../images/404.svg";

import "../stylesheets/job.css";
import { slideInRight } from "react-animations";
import styled, { keyframes } from "styled-components";

const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 7,
});
const BounceIn = styled.div`
    animation: 0.3s ${keyframes`${slideInRight}`} 0s;
`;

class SimilarJobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: null,
            message: "",
        };
    }
    componentDidMount() {
        const job = this.props.job;
        const query = {
            location: job.description.location,
            // pin: job.pin,
            specialization: job.specialization,
            profession: job.profession,
            superSpecialization: job.superSpecialization,
        };
        console.log(query);
        if (job)
            axios
                .post(`/api/job/similar`, query)
                .then(({ data }) => {
                    console.log(data);
                    this.setState({ jobs: data.jobs, message: "" });
                })
                .catch(({ response }) => {
                    console.log({ response });
                    this.setState({ message: "No Jobs found" });
                });
    }
    render() {
        return (
            <div>
                {this.state.message === "" ? (
                    this.state.jobs ? (
                        <div>
                            {this.state.jobs.map((job) => (
                                <BounceIn>
                                    <Media className='row block justify-content-center my-3 mx-2 p-2 px-md-3'>
                                        <Media
                                            body
                                            className='col-12 my-2 my-md-3 my-md-2 p-2'>
                                            <Media heading>
                                                <h5>{job.title}</h5>
                                            </Media>
                                            <Media heading>
                                                <h6>
                                                    <FontAwesomeIcon
                                                        icon={faMapMarkerAlt}
                                                    />{" "}
                                                    {job.description.location}
                                                </h6>
                                            </Media>
                                            <hr className='my-2' />
                                            <div className='row m-0'>
                                                <div className='col-12 desc'>
                                                    <em
                                                        style={{
                                                            fontSize: ".9rem",
                                                        }}>
                                                        {job.description.line}
                                                    </em>
                                                </div>
                                            </div>
                                        </Media>
                                        <Media
                                            left
                                            href='#'
                                            className='d-none d-md-block col-12 col-sm-3 my-auto mx-auto '>
                                            <Media
                                                object
                                                src={hospital}
                                                alt='Generic placeholder image'
                                                className='img-fluid'
                                                // style={{ maxWidth: "50%" }}
                                            />
                                        </Media>
                                        <hr className='col-12 my-1 my-md-2 ' />
                                        <div className='row w-100 justify-content-between'>
                                            <div className='col-12 col-md-9 pr-0 pr-sm-3 row w-100 py-2'>
                                                <div className='col-12 col-sm-10 px-0 '>
                                                    <Badge
                                                        color='secondary'
                                                        className='mx-1'>
                                                        {
                                                            job.description
                                                                .experience
                                                        }
                                                    </Badge>

                                                    {job.superSpecialization &&
                                                        job.superSpecialization.map(
                                                            (tag) => (
                                                                <Badge
                                                                    color='info'
                                                                    className='mx-1'>
                                                                    {tag}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    <br />
                                                    {job.description.type &&
                                                        job.description.type.map(
                                                            (tag) => (
                                                                <Badge
                                                                    color='warning'
                                                                    className='mx-1'>
                                                                    {tag}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    <br />
                                                    {job.description
                                                        .incentives &&
                                                        job.description.incentives.map(
                                                            (tag) => (
                                                                <Badge
                                                                    color='primary'
                                                                    className='mx-1'>
                                                                    {tag}
                                                                </Badge>
                                                            ),
                                                        )}
                                                </div>

                                                <div className='col-12 col-sm-2 px-0 mt-auto'>
                                                    <Badge
                                                        color='success'
                                                        className='float-right mt-3'>
                                                        {job.author &&
                                                            job.author.username}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 my-auto mt-sm-3 row'>
                                                <div className='col-12 p-1'>
                                                    <Link
                                                        to={`/job/${job._id}`}
                                                        className='btn btn-danger w-100'>
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Media>
                                </BounceIn>
                            ))}
                        </div>
                    ) : (
                        <div
                            className='mx-auto my-auto'
                            style={{ textAlign: "center" }}>
                            <Loader
                                type='Bars'
                                color='#17a2b8'
                                height={300}
                                width={220}
                            />
                        </div>
                    )
                ) : (
                    <div
                        className='w-50 mx-auto'
                        style={{ textAlign: "center" }}>
                        <img
                            src={error}
                            classname='img-fluid'
                            style={{ maxWidth: "200px" }}
                        />
                        <h4>{this.state.message}</h4>
                    </div>
                )}
            </div>
        );
    }
}
export default class Job extends Component {
    constructor(props) {
        super(props);
        this.state = {
            job: null,
            user: null,
            modal: false,
            err: "",
            showSimilar: false,
        };
        this.applyJob = this.applyJob.bind(this);
        this.toggle = this.toggle.bind(this);
        this.showDetail = this.showDetail.bind(this);
        this.showSimilar = this.showSimilar.bind(this);
    }
    showSimilar() {
        this.setState({ showSimilar: !this.state.showSimilar });
    }
    showDetail() {
        if (!this.state.user) {
            axios
                .get(`/api/user/current`)
                .then(({ data }) => {
                    console.log(data);
                    this.setState({
                        user: data.user,
                        modal: !this.state.modal,
                    });
                    // this.toggle();
                })
                .catch(({ data }) => this.setState({ err: data.err }));
        } else this.toggle();
    }
    applyJob() {
        // this.toggle();

        axios
            .post(`/api/job/apply/${this.state.job._id}`)
            .then(({ data }) => {
                console.log(data);
                // setApplied(true);
                window.location = "/search-jobs";
            })
            .catch(({ response }) => {
                console.log(response);
                this.setState({ err: response.data.err });
            });
    }
    toggle() {
        this.setState({ modal: !this.state.modal });
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        axios
            .get(`/api/job/${id}`)
            .then(({ data }) => {
                // console.log(data);
                this.setState({
                    job: data,
                });
                console.log(this.state.job);
            })
            .catch(({ response }) => {
                console.log(response);
                this.setState({ err: "Invalid Job Id" });
            });
    }

    render() {
        const job = this.state.job;
        return (
            <div>
                <Alert
                    color='danger'
                    isOpen={this.state.err !== ""}
                    toggle={() => {
                        this.setState({ err: "" });
                    }}>
                    {this.state.err}
                </Alert>
                {this.state.job ? (
                    <div>
                        <div className='main-job mx-2 mx-md-4 my-3 p-2 p-sm-3'>
                            <div className='row'>
                                <div className='col-7 col-md-10 my-auto'>
                                    <h4>{job.title}</h4>
                                    <h6>
                                        <FontAwesomeIcon
                                            icon={faMapMarkerAlt}
                                        />{" "}
                                        {job.description.location}
                                    </h6>
                                </div>
                                <div className='col-5 col-md-2'>
                                    <img
                                        object
                                        src={hospital}
                                        alt='Generic placeholder image'
                                        className='img-fluid'
                                        // style={{ maxWidth: "50%" }}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className=' row'>
                                <div
                                    className='col-6 col-sm-4 my-1'
                                    style={{ textAlign: "center" }}>
                                    <h6>
                                        <b>Profession : </b>
                                    </h6>
                                    {job.profession}
                                </div>

                                <div
                                    className='col-6 col-sm-4 my-1'
                                    style={{ textAlign: "center" }}>
                                    <h6>
                                        <b>Specialization : </b>
                                    </h6>
                                    {job.specialization}
                                </div>
                                <div
                                    className='col-12 col-sm-4 my-1'
                                    style={{ textAlign: "center" }}>
                                    <h6>
                                        <b>Super - Specialization : </b>
                                    </h6>
                                    {job.superSpecialization.join(", ")}
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div
                                    className='col-6 col-sm-3 my-1'
                                    style={{ textAlign: "center" }}>
                                    <h6>
                                        <b>Experience level</b>
                                        {/* <FontAwesomeIcon
                                        icon={faMoneyBillWaveAlt}
                                        className='ml-1'
                                    /> */}
                                    </h6>
                                    {job.description.experience}
                                </div>
                                <div
                                    className='col-6 col-sm-3 my-1'
                                    style={{ textAlign: "center" }}>
                                    <h6>
                                        <b>Incentives</b>
                                        {/* <FontAwesomeIcon
                                        icon={faMoneyBill}
                                        className='ml-1'
                                    /> */}
                                    </h6>

                                    {job.description.incentives &&
                                        job.description.incentives.map(
                                            (tag) => (
                                                <Badge
                                                    color='secondary'
                                                    className='mx-1 p-1 incentive my-1'>
                                                    {tag}
                                                </Badge>
                                            ),
                                        )}
                                </div>
                                <div
                                    className='col-6 col-sm-3 my-1'
                                    style={{ textAlign: "center" }}>
                                    <h6>
                                        <b>Job Type</b>
                                        {/* <FontAwesomeIcon
                                        icon={faMoneyBillWaveAlt}
                                        className='ml-1'
                                    /> */}
                                    </h6>
                                    {job.description.type &&
                                        job.description.type.map((tag) => (
                                            <Badge
                                                color='info'
                                                className='mx-1 p-1 my-1'>
                                                {tag}
                                            </Badge>
                                        ))}
                                </div>
                                <div
                                    className='col-6 col-sm-3 my-1'
                                    style={{ textAlign: "center" }}>
                                    <h6>
                                        <b> Salary</b>
                                        {/* <FontAwesomeIcon
                                        icon={faMoneyBillWaveAlt}
                                        className='ml-1'
                                    /> */}
                                    </h6>
                                    {formatter.format(job.description.salary)}
                                </div>
                            </div>
                            <hr />
                            <div className='row p-1'>
                                <div className='col-12'>
                                    <h4>About the job</h4>
                                    {job.description.line}
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='col-6'>
                                    <Button
                                        size='lg'
                                        color='info'
                                        className='w-100'
                                        onClick={this.showDetail}>
                                        Apply
                                    </Button>
                                </div>
                                <div className='col-6'>
                                    <Button
                                        size='lg'
                                        color='primary'
                                        className='w-100'
                                        onClick={this.showSimilar}>
                                        Similar Jobs
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {this.state.showSimilar && (
                            <SimilarJobs job={this.state.job} />
                        )}
                        {this.state.user && (
                            <Modal
                                isOpen={this.state.modal}
                                toggle={this.toggle}
                                style={{ minWidth: "70vw" }}>
                                <ModalHeader toggle={this.toggle}>
                                    Your Info
                                </ModalHeader>
                                <ModalBody className='row'>
                                    <div className='col-12 col-md-7 px-2'>
                                        <h6>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className='ml-2 mr-3'
                                            />
                                            {`${this.state.user.username}`}
                                        </h6>
                                        <h6>
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className='ml-2 mr-3'
                                            />
                                            {`${this.state.user.firstName} ${this.state.user.lastName}`}
                                        </h6>
                                        {this.state.user.address && (
                                            <h6>
                                                <FontAwesomeIcon
                                                    icon={faMapMarkerAlt}
                                                    className='ml-2 mr-3'
                                                />
                                                {`${this.state.user.address.city}, ${this.state.user.address.state}, ${this.state.user.address.pin}`}
                                            </h6>
                                        )}
                                        <hr />
                                        <em>
                                            {this.state.user.description}
                                            Lorem ipsum dolor sit amet
                                            consectetur adipisicing elit. Saepe,
                                            repudiandae vitae, earum maerat
                                            doloribus acc
                                        </em>
                                    </div>
                                    <div className='col-12 col-md-5 px-2'>
                                        <h5>Experience</h5>
                                        <hr />
                                        {this.state.user.experience &&
                                            this.state.user.experience.map(
                                                (exp) => (
                                                    <div>
                                                        <h6>{exp.title}</h6>

                                                        <p>
                                                            {exp.line}
                                                            <br />
                                                            {exp.time}
                                                        </p>
                                                        <hr />
                                                    </div>
                                                ),
                                            )}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color='primary'
                                        onClick={this.applyJob}>
                                        Apply
                                    </Button>
                                    <Button
                                        color='secondary'
                                        onClick={this.toggle}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        )}
                    </div>
                ) : (
                    <div
                        className='mx-auto my-auto'
                        style={{ textAlign: "center" }}>
                        <Loader
                            type='Bars'
                            color='#17a2b8'
                            height={300}
                            width={220}
                        />
                    </div>
                )}
            </div>
        );
    }
}
