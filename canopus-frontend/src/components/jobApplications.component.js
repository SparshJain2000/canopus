import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import { Media, Badge, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import doctor from "../images/doctor.png";

let i = 0;
const ApplicantDetails = ({ applicant }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        console.log(i++);

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
            <Media className='row block justify-content-center my-5 mx-4 py-4 px-2 px-md-4'>
                <Media
                    left
                    href='#'
                    className='col-12 col-md-3 my-auto mx-auto'>
                    <Media
                        object
                        src={doctor}
                        alt='Generic placeholder image'
                        className='img-fluid'
                        // style={{ maxWidth: "50%" }}
                    />
                </Media>
                <Media body className='col-12 col-md-9 my-4 my-md-2 '>
                    <Media heading className='px-2 px-md-3'>
                        {job.title}
                    </Media>
                    <Media heading className='px-2 px-md-3'>
                        <h6>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                            {job.description.location}
                        </h6>
                    </Media>
                    <div className='row mx-auto w-100 p-2 p-md-3'>
                        <div className='col-12 col-md-8'>
                            <em>{job.description.specialization}</em>
                            <br />
                            <strong>Type:</strong>{" "}
                            {job.description.type.map((inc) => `${inc} , `)}
                            <br />
                            <strong>Experience: </strong>
                            {job.description.experience}
                            <br />
                            <strong>incentives: </strong>
                            {job.description.incentives.map(
                                (inc) => `${inc} , `,
                            )}
                            <br />
                        </div>
                        <div
                            className='col-12 col-md-4 mt-4 mt-md-0'
                            style={{ textAlign: "center" }}>
                            <Button onClick={showApplicants}>
                                Show Applicants
                            </Button>
                        </div>
                    </div>

                    <hr />
                    {job.superSpecialization &&
                        job.superSpecialization.map((tag) => (
                            <Badge color='info' className='mx-1'>
                                {tag}
                            </Badge>
                        ))}
                    <Badge color='success' className='float-right'>
                        {job.description.status}
                    </Badge>
                    {show &&
                        (job.applicants.length ? (
                            job.applicants.map((applicant) => (
                                <ApplicantDetails
                                    key={applicant.id}
                                    applicant={applicant.id}
                                />
                            ))
                        ) : (
                            <h6>No applicants</h6>
                        ))}
                </Media>
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
                {this.state.jobs ? (
                    this.state.jobs.length !== 0 &&
                    this.state.jobs.map(
                        (job) => job && <Job key={job._id} job={job} />,
                    )
                ) : (
                    <ReactLoading
                        type={"spin"}
                        color={"orange"}
                        height={"100vh"}
                        width={"40%"}
                        className='loading mx-auto'
                    />
                )}
            </div>
        );
    }
}
