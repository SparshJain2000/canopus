import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { Media, Badge, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapMarkerAlt,
    faUser,
    faPen,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import hospital from "../images/hospital.svg";
import "../stylesheets/jobApplications.css";
import {
    ListGroup,
    ListGroupItem,
    Nav,
    NavItem,
    DropdownToggle,
    NavLink,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    TabContent,
    TabPane,
    Row,
    Col,
} from "reactstrap";

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
const Badges = ({ desc, superSpecialization }) => {
    const superSp = superSpecialization ? superSpecialization : [];
    let badges = [];
    if (desc && desc.type)
        badges = [
            desc.experience,
            ...desc.type,
            ...desc.incentives,
            ...superSp,
        ];
    const number = badges.length - 5;
    badges = badges.slice(0, 3);
    // console.log(badges);

    return (
        <div>
            {badges.map((badge, i) => {
                return (
                    <Badge className='mx-1' color='info' key={i}>
                        {badge}
                    </Badge>
                );
            })}
            {number > 0 && `+ ${number} more`}
        </div>
    );
};
const Job = ({ job, jobType, type2 }) => {
    const freelance = job.startDate ? true : false;
    const [show, setShow] = useState(false);
    const showApplicants = () => {
        setShow(!show);
    };
    const post = () => {
        console.log("posted");
        if (type2 === "freelance")
            axios
                .put(`/api/job/saveFreelance/activate/${job._id}`)
                .then((data) => {
                    console.log(data);
                    if (data.status === 200) alert("posted");
                })
                .catch((err) => console.log(err.response));
        else
            axios
                .put(`/api/job/saveJob/activate/${job._id}`)
                .then((data) => {
                    if (data.status === 200) alert("posted");
                })
                .catch((err) => console.log(err.response));
    };
    return (
        <div className='col-12 col-md-6'>
            <Media
                className={`row  justify-content-center m-2 m-md-3 p-2 px-md-3  ${
                    job.sponsored ? "block-info" : "block"
                }`}>
                <Media body className='col-12 py-1 px-2'>
                    <Media heading>
                        <h5>{job.title}</h5>
                    </Media>

                    {/* <Media heading>
                        <h6 className='text-info'>
                            
                            {job.description.company
                                ? job.description.company
                                : "Company"}
                        </h6>
                    </Media> */}
                    <Media heading>
                        <h6>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                            {job.description && job.description.location}
                        </h6>
                    </Media>
                    <hr />
                    <div className='row m-0'>
                        <div className='col-12 desc'>
                            <em>{job.description && job.description.line}</em>

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
                        <hr />
                        <div className='col-12'>
                            {job.startDate && (
                                <div className='row'>
                                    {new Date(
                                        job.startDate,
                                    ).toLocaleDateString()}
                                </div>
                            )}
                            <div className='row'>
                                {job.startDate && (
                                    <div className=''>
                                        {new Date(
                                            job.startDate,
                                        ).toLocaleTimeString()}
                                        {" - "}
                                    </div>
                                )}

                                {job.endDate && (
                                    <div className=''>
                                        {new Date(
                                            job.endDate,
                                        ).toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='col-12  px-0 '>
                            <Badges
                                desc={job.description}
                                superSpecialization={job.superSpecialization}
                            />
                        </div>
                    </div>
                    {jobType === "Open" && (
                        <div className='row w-100 justify-content-start mt-3'>
                            <div className='col-6  my-auto p-0 p-md-2 pr-1'>
                                <Button
                                    color={`info`}
                                    onClick={showApplicants}
                                    className={`w-100 `}>
                                    Applicants
                                </Button>
                            </div>
                            <div className='col-6  my-auto p-0 p-md-2 pl-1'>
                                <Link
                                    to={{
                                        pathname: `/employer/job/update/${job._id}`,
                                        search: freelance
                                            ? "freelance"
                                            : "normal",
                                    }}
                                    params={{ freelance: freelance }}>
                                    <Button className='btn btn-primary w-100'>
                                        Edit JOB
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                    {jobType === "Saved" && (
                        <div className='row w-100 justify-content-start mt-3'>
                            <div className='col-6  my-auto p-0 p-md-2 pr-1'>
                                <Button
                                    color={`info`}
                                    onClick={post}
                                    className={`w-100 `}>
                                    Post
                                </Button>
                            </div>
                            <div className='col-6  my-auto p-0 p-md-2 pl-1'>
                                <Link
                                    to={{
                                        pathname: `/employer/job/update/${job._id}`,
                                        search: freelance
                                            ? "freelance"
                                            : "normal",
                                    }}
                                    params={{ freelance: freelance }}>
                                    <Button className='btn btn-primary w-100'>
                                        Edit JOB
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </Media>

                <Media
                    left
                    href='#'
                    className='d-none  col-12 col-sm-3 my-auto mx-auto '>
                    <Media
                        object
                        src={hospital}
                        style={{ maxHeight: "200px" }}
                        alt='Generic placeholder image'
                        className='img-fluid float-right pr-2 pr-lg-3'
                    />
                </Media>
                {show &&
                    (job.applicants.length ? (
                        <ListGroup className='mt-2 mx-2 w-100'>
                            {job.applicants.map((applicant) => (
                                <ListGroupItem key={applicant.id}>
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
                        <h6 className='w-100' style={{ textAlign: "center" }}>
                            No applicants
                        </h6>
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
            freelanceJobs: null,
            activeTab: "1",
            jobType: "Open",
            dropdownOpen: false,
            closedJobs: null,
            savedJobs: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.getSavedJobs = this.getSavedJobs.bind(this);
        this.getOpenJobs = this.getOpenJobs.bind(this);
        this.getClosedJobs = this.getClosedJobs.bind(this);
    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }
    getClosedJobs() {
        axios
            .get("/api/job/all/expiredJobs")
            .then(({ data }) => {
                console.log(data);
                this.setState({ jobs: data.jobs });
            })
            .catch((err) => console.log(err.response));
        axios
            .get("/api/job/all/expiredFreelance")
            .then(({ data }) => {
                // console.log(data);
                this.setState({ freelanceJobs: data.jobs });
                console.log(this.state.freelanceJobs);
            })
            .catch((err) => console.log(err.response));
    }
    getOpenJobs() {
        axios
            .get("/api/job/all/jobs")
            .then(({ data }) => {
                console.log(data.jobs);
                this.setState({ jobs: data.jobs });
            })
            .catch((err) => console.log(err.response));
        axios
            .get("/api/job/all/freelance")
            .then(({ data }) => {
                console.log(data.jobs);
                this.setState({ freelanceJobs: data.jobs });
            })
            .catch((err) => console.log(err.response));
    }
    getSavedJobs() {
        axios
            .get("/api/job/all/savedJobs")
            .then(({ data }) => {
                console.log(data.jobs);
                this.setState({ jobs: data.jobs });
            })
            .catch((err) => console.log(err.response));
        axios
            .get("/api/job/all/savedFreelance")
            .then(({ data }) => {
                console.log(data.jobs);
                this.setState({ freelanceJobs: data.jobs });
            })
            .catch((err) => console.log(err.response));
    }
    componentDidMount() {
        console.log("inside component did mount");
        this[`get${this.state.jobType}Jobs`]();
    }
    render() {
        return (
            <div className='w-100'>
                <div
                    className='mt-2 mr-2 mr-md-3'
                    style={{ textAlign: "right" }}>
                    <Dropdown
                        isOpen={this.state.dropdownOpen}
                        toggle={() => {
                            this.setState({
                                dropdownOpen: !this.state.dropdownOpen,
                            });
                        }}>
                        <DropdownToggle
                            style={{ textTransform: "capitalize" }}
                            caret>{`${this.state.jobType} jobs`}</DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem
                                onClick={() => {
                                    this.setState({ jobType: "Open" });
                                    this.getOpenJobs();
                                }}>
                                Open Jobs
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => {
                                    this.setState({ jobType: "Closed" });
                                    this.getClosedJobs();
                                }}>
                                Closed Jobs
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => {
                                    this.setState({ jobType: "Saved" });
                                    this.getSavedJobs();
                                }}>
                                Saved Jobs
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <h3 className='text-align-center w-100'>Jobs</h3>
                <div className='row'>
                    {this.state.jobs !== null &&
                    this.state.jobs !== undefined ? (
                        this.state.jobs.length !== 0 &&
                        this.state.jobs.map(
                            (job) =>
                                job && (
                                    <Job
                                        key={job._id}
                                        job={job}
                                        jobType={this.state.jobType}
                                        type2='normal'
                                    />
                                ),
                        )
                    ) : (
                        <div
                            className='mx-auto my-auto col-12'
                            style={{ textAlign: "center" }}>
                            <Loader
                                type='Bars'
                                color='#17a2b8'
                                height={300}
                                width={220}
                            />
                        </div>
                    )}

                    <hr className='w-100' />
                    <h3 className='text-align-center w-100'>Locum Jobs</h3>

                    <div className='row w-100'>
                        {this.state.freelanceJobs ? (
                            this.state.freelanceJobs.length !== 0 &&
                            this.state.freelanceJobs.map(
                                (job) =>
                                    job && (
                                        <Job
                                            key={job._id}
                                            job={job}
                                            jobType={this.state.jobType}
                                            type2='freelance'
                                        />
                                    ),
                            )
                        ) : (
                            <div
                                className='mx-auto my-auto col-12 '
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
                </div>
            </div>
        );
    }
}
