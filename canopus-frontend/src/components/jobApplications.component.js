import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Media, Badge, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapMarkerAlt,
    faUser,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import hospital from "../images/hospital.svg";
import "../stylesheets/jobApplications.css";
import { ListGroup, ListGroupItem } from "reactstrap";
const ApplicantDetails = ({ applicant }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    useEffect(() => {
        axios
            .get(`/api/user/profile/${applicant}`)
            .then(({ data }) => {
                setData(data);
                setError(false);
            })
            .catch((err) => {
                setError(true);
                console.log(err.response);
            });
    }, []);
    return <div>{!error && data && data.username}</div>;
};
const Job = ({ job }) => {
    const [show, setShow] = useState(false);
    const showApplicants = () => {
        setShow(!show);
    };
    return (
        <div>
            <Media className='row block justify-content-center my-3 mx-3 mx-sm-4 p-2 px-md-4'>
                <Media body className='col-12 mt-4 mb-2 my-md-2 p-2'>
                    <Media heading>{job.title}</Media>
                    <Media heading>
                        <h6>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                            {job.description.location}
                        </h6>
                    </Media>
                    <hr />
                    <div className='row m-0'>
                        <div className='col-12 '>
                            <em>{job.description.line}</em>
                            <br />
                            <br />
                            {/* <strong>Type:</strong>
                            {job.description.type.map((type) => `${type} , `)}
                            <br /> */}
                            {/* <strong>Experience: </strong>
                            {job.description.experience} */}
                            {/* <br />
                            <strong>incentives: </strong>
                            {job.description.incentives.map(
                                (inc) => `${inc} ,`,
                            )} */}
                            <br />
                        </div>
                        {/* <div
                        className='col-12 col-sm-2 my-2 my-sm-auto'
                        style={{ textAlign: "center" }}>
                        <Button
                            color='primary w-100'
                            // className='float-right'
                            onClick={applyJob}>
                            Apply
                        </Button>
                    </div> */}
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
                <hr className='col-12' />
                <div className='row w-100 justify-content-between '>
                    <div className='col-12 col-md-9  pr-0 pr-sm-3 row w-100 py-2'>
                        <div className='col-12 col-sm-10 px-0'>
                            <Badge color='secondary' className='mx-1'>
                                {job.description.experience}
                            </Badge>

                            {job.superSpecialization &&
                                job.superSpecialization.map((tag) => (
                                    <Badge color='info' className='mx-1'>
                                        {tag}
                                    </Badge>
                                ))}
                            <br />
                            {job.description.type &&
                                job.description.type.map((tag) => (
                                    <Badge color='warning' className='mx-1'>
                                        {tag}
                                    </Badge>
                                ))}
                            <br />
                            {job.description.incentives &&
                                job.description.incentives.map((tag) => (
                                    <Badge color='primary' className='mx-1'>
                                        {tag}
                                    </Badge>
                                ))}
                        </div>

                        {/* <hr /> */}
                        <div className='col-12 col-sm-2 mt-auto px-0'>
                            <Badge color='success' className='float-right mt-3'>
                                {job.author && job.author.username}
                            </Badge>
                        </div>
                    </div>
                    <div className='col-12 col-md-3 my-auto p-0 p-sm-2'>
                        <Button
                            color={`info`}
                            size='lg'
                            onClick={showApplicants}
                            className={`w-100 `}>
                            Show Applicants
                        </Button>
                    </div>
                </div>
                {show &&
                    (job.applicants.length ? (
                        <ListGroup className='mt-2 mx-2 w-100'>
                            <hr />
                            {job.applicants.map((applicant) => (
                                <ListGroupItem>
                                    {/* <ApplicantDetails
                                            key={applicant.id}
                                            applicant={applicant.id}
                                        /> */}
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className='mr-2'
                                    />
                                    {applicant.username}
                                    <Link
                                        to={`/profile/${applicant.id}`}
                                        className='btn btn-primary btn-sm float-right'
                                        style={{ borderRadius: "50%" }}>
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </Link>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    ) : (
                        <h6>No applicants</h6>
                    ))}
            </Media>
        </div>
    );
};
export default class JobApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: null,
        };
    }
    componentDidMount() {
        console.log("inside component did mount");
        axios
            .get("/api/employer/jobs")
            .then(({ data }) => {
                this.setState({ jobs: data });
                console.log(this.state.jobs);
            })
            .catch((err) => console.log(err.response));
    }
    render() {
        return (
            <div>
                <h1 className='my-3' style={{ textAlign: "center" }}>
                    Posted Jobs
                </h1>
                {this.state.jobs ? (
                    this.state.jobs.length !== 0 &&
                    this.state.jobs.map(
                        (job) => job && <Job key={job._id} job={job} />,
                    )
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
