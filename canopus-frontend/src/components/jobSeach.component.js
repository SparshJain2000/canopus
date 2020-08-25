import React, { Component, createRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../stylesheets/jobSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapMarkerAlt,
    faUser,
    faEnvelope,
    // faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    Media,
    Badge,
    Button,
    InputGroup,
    Pagination,
    PaginationItem,
    FormGroup,
    Input,
    Label,
    PaginationLink,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Row,
    Col,
    Modal,
    // Tooltip,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap";
import axios from "axios";
import doctor from "../images/doctor.png";
import hospital from "../images/hospital.svg";
import Loader from "react-loader-spinner";
import Select from "react-select";
import data from "../data";
import { slideInRight } from "react-animations";
import styled, { keyframes } from "styled-components";
const BounceIn = styled.div`
    animation: 0.3s ${keyframes`${slideInRight}`} 0s;
`;

const incentivesArray = data.incentive.map((opt) => ({
    label: opt,
    value: opt,
}));
const typeArray = data.type.map((opt) => ({ label: opt, value: opt }));
const superSpecializationArray = data.superSpecialization.map((opt) => ({
    label: opt,
    value: opt,
}));
const locationArray = data.location.map((opt) => ({
    label: `${opt.name}, ${opt.state}`,
    value: `${opt.name}`,
}));
const experienceArray = data.experience.map((opt) => ({
    label: opt,
    value: opt,
}));
const professionArray = data.professions.map((opt) => ({
    label: opt,
    value: opt,
}));
const specializationArray = data.specializations.map((opt) => ({
    label: opt,
    value: opt,
}));
const Badges = ({ desc, superSpecialization }) => {
    const superSp = superSpecialization ? superSpecialization : [];
    let badges = [];
    if (desc.type)
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
                    <Badge className='mx-1' color='info' id={i}>
                        {badge}
                    </Badge>
                );
            })}
            {number > 0 && `+ ${number} more`}
        </div>
    );
};
const Job = ({ job, userId, user }) => {
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const [applied, setApplied] = useState(false);
    // if (user.applied.map((job) => job.id).includes(job._id)) setApplied(true);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
    const toggle = () => {
        if (!user) alert("Not Logged In");
        else {
            if (job.applicants.map((us) => us.id).includes(user._id))
                alert("already applied");
            else setModal(!modal);
        }
    };
    const closeBtn = (
        <button className='close' onClick={toggle}>
            &times;
        </button>
    );

    const applyJob = () => {
        axios
            .post(`/api/job/apply/${job._id}`)
            .then(({ data }) => {
                console.log(data);
                // setApplied(true);
                window.location = "/search-jobs";
            })
            .catch((err) => console.log(err.response));
    };
    return (
        <div>
            <BounceIn>
                <Media
                    className={`row  justify-content-center my-3 mx-auto p-2 px-md-3 ${
                        job.sponsored ? "block-info" : "block"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => history.push(`/job/${job._id}`)}>
                    <Media body className='col-12 my-1 p-1'>
                        <Media heading>
                            <h5>{job.title}</h5>
                        </Media>

                        <Media heading>
                            <h6 className='text-info'>
                                {/* <FontAwesomeIcon icon={faMapMarkerAlt} />{" "} */}
                                {job.description.company
                                    ? job.description.company
                                    : "Company"}
                            </h6>
                        </Media>
                        <Media heading>
                            <h6>
                                <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                                {job.description.location}
                            </h6>
                        </Media>

                        {/* ?     <hr className='my-2' /> */}
                        <div className='row m-0'>
                            <div className='col-12 desc'>
                                <em style={{ fontSize: ".9rem" }}>
                                    {job.description.line}
                                </em>
                            </div>
                        </div>
                        <hr />
                        {job.startDate && (
                            <div className='row'>
                                {new Date(job.startDate).toDateString()}
                            </div>
                        )}
                        {job.endDate && (
                            <div className='row'>
                                {new Date(job.endDate).toDateString()}
                            </div>
                        )}

                        <div className='col-12  px-0 '>
                            <Badges
                                desc={job.description}
                                superSpecialization={job.superSpecialization}
                            />
                        </div>
                    </Media>
                    <Media
                        left
                        href='#'
                        className='d-none d-md-block col-12 col-sm-3 my-auto mx-auto '>
                        <Media
                            object
                            src={hospital}
                            style={{ maxHeight: "200px" }}
                            alt='Generic placeholder image'
                            className='img-fluid float-right pr-2 pr-lg-3'
                        />
                    </Media>
                </Media>
            </BounceIn>
            {user && (
                <Modal
                    isOpen={modal}
                    toggle={toggle}
                    style={{ minWidth: "70vw" }}>
                    <ModalHeader toggle={toggle} close={closeBtn}>
                        Your Info
                    </ModalHeader>
                    <ModalBody className='row'>
                        <div className='col-12 col-md-7 px-2'>
                            <h6>
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className='ml-2 mr-3'
                                />
                                {`${user.username}`}
                            </h6>
                            <h6>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className='ml-2 mr-3'
                                />
                                {`${user.firstName} ${user.lastName}`}
                            </h6>
                            {user.address && (
                                <h6>
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className='ml-2 mr-3'
                                    />
                                    {`${user.address.city}, ${user.address.state}, ${user.address.pin}`}
                                </h6>
                            )}
                            <hr />
                            <em>
                                {user.description}
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Saepe, repudiandae vitae,
                                earum maerat doloribus acc
                            </em>
                        </div>
                        <div className='col-12 col-md-5 px-2'>
                            <h5>Experience</h5>
                            <hr />
                            {user.experience &&
                                user.experience.map((exp) => (
                                    <div>
                                        <h6>{exp.title}</h6>

                                        <p>
                                            {exp.line}
                                            <br />
                                            {exp.time}
                                        </p>
                                        <hr />
                                    </div>
                                ))}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={applyJob}>
                            Apply
                        </Button>
                        <Button color='secondary' onClick={toggle}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </div>
    );
};
export default class JobSearch extends Component {
    contextRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            pageCount: 0,
            pageSize: 2,
            freelance: true,
            isZero: false,
            currentPage: 0,
            activeTab: "1",
            modalFilter: false,
            coordinates: null,
            jobsFound: "",
            location: "",
            profession: "",
            specialization: "",
            experience: "",
            type: [],
            incentives: [],
            superSpecialization: [],
            startDate: "",
            endDate: "",
            // isSticky:false
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.getAllJobs = this.getAllJobs.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.toggleModalFilter = this.toggleModalFilter.bind(this);
        this.search = this.search.bind(this);
        this.location = React.createRef();
        this.profession = React.createRef();
        this.specialization = React.createRef();
        this.experience = React.createRef();
        this.type = React.createRef();
        this.incentives = React.createRef();
        this.superSpecialization = React.createRef();
        this.freelance = React.createRef();
        // this.filter=React.createRef();
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    console.log("Latitude: " + lat + "\nLongitude: " + long);
                    if (this.location.current)
                        this.location.current.state.value = {
                            label: "Your Location",
                            value: "Your Location",
                        };
                    this.setState({
                        coordinates: [lat, long],
                        location: "Your Location",
                    });
                    // console.log(this.state);
                    console.log("----------------");
                    console.log(this.state.isZero);
                },
                (err) => {
                    console.log(err);
                },
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            this.setState({ open: true });
        }
    }
    toggleModalFilter() {
        this.setState({ modalFilter: !this.state.modalFilter });
    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }
    getAllJobs(skipNo) {
        console.log(this.state.freelance);
        if (this.state.freelance == false) {
            const query = {
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                limit: this.state.pageSize,
                skip: skipNo ? skipNo : 0,
            };
            axios
                .post(`/api/job/allfreelance`, query)
                .then(({ data }) => {
                    console.log(data);
                    this.setState({
                        isZero: data.jobs.length === 0,
                        jobs: data.jobs,
                        pageCount: Math.ceil(
                            data.count.jobCount / this.state.pageSize,
                        ),
                        loaded: true,
                        jobsFound: `${data.count.jobCount} ${
                            this.state.profession
                        }${
                            this.state.profession !== "" &&
                            this.state.specialization != ""
                                ? " / "
                                : ""
                        }${this.state.specialization} jobs found`,
                    });
                })
                .catch((ERR) => console.log(ERR));
        } else {
            const query = {
                limit: this.state.pageSize,
                skip: skipNo ? skipNo : 0,
            };
            console.log(query);
            axios
                .post(`/api/job/alljobs`, query)
                .then(({ data: { jobs, count } }) => {
                    console.log(data);
                    this.setState({
                        isZero: jobs.length === 0,
                        jobs: jobs,
                        pageCount: Math.ceil(
                            count.jobCount / this.state.pageSize,
                        ),
                        loaded: true,
                        jobsFound: `${count.jobCount} ${this.state.profession}${
                            this.state.profession !== "" &&
                            this.state.specialization != ""
                                ? " / "
                                : ""
                        }${this.state.specialization} jobs found`,
                    });
                    console.log("----------------");
                    console.log(this.state.isZero);

                    console.log(jobs);
                })
                .catch((err) => {
                    console.log(err.response);
                    // window.location = "/";
                });
        }
    }
    componentDidMount() {
        console.log(this.props.location);
        if (this.props.location.state) {
            if (this.props.location.state.feild === "specialization") {
                this.specialization.current.state.value = {
                    value: this.props.location.state.query,
                    label: this.props.location.state.query,
                };
                this.setState({
                    specialization: this.props.location.state.query,
                });
                const query = {
                    specialization: this.props.location.state.query,
                    limit: this.state.pageSize,
                    skip: 0,
                };
                axios
                    .post(`/api/job/search`, query)
                    .then(({ data }) => {
                        this.setState({
                            isZero: data.jobs.length === 0,
                            jobs: data.jobs,
                            loaded: true,
                            pageCount: Math.ceil(
                                data.count.jobCount / this.state.pageSize,
                            ),
                            jobsFound: `${data.jobs.length} ${
                                this.state.profession
                            }${
                                this.state.profession !== "" &&
                                this.state.specialization != ""
                                    ? " / "
                                    : ""
                            }${this.state.specialization} jobs found`,
                        });
                        console.log("----------------");
                        console.log(this.state.isZero);
                        // console.log(data);
                    })
                    .catch((err) => {
                        console.log(err.response);
                        this.setState({ loaded: true });
                    });
            }
            if (this.props.location.state.feild === "profession") {
                console.log(this.props.location);
                this.profession.current.state.value = {
                    value: this.props.location.state.query,
                    label: this.props.location.state.query,
                };
                this.setState({
                    profession: this.props.location.state.query,
                });

                const query = {
                    profession: this.props.location.state.query,
                    limit: this.state.pageSize,
                    skip: 0,
                };
                console.log(query);
                axios
                    .post(`/api/job/search`, query)
                    .then(({ data }) => {
                        console.log(data);
                        this.setState({
                            jobs: data.jobs,
                            isZero: data.jobs.length === 0,
                            loaded: true,
                            pageCount: Math.ceil(
                                data.count.jobCount / this.state.pageSize,
                            ),

                            jobsFound: `${data.count.jobCount} ${
                                this.state.profession
                            }${
                                this.state.profession !== "" &&
                                this.state.specialization != ""
                                    ? " / "
                                    : ""
                            }${this.state.specialization} jobs found`,
                        });
                        console.log("----------------");
                        console.log(this.state.isZero);
                        // console.log(data);
                    })
                    .catch((err) => {
                        console.log(err.response);
                        this.setState({ loaded: true });
                    });
            }
        } else if (this.state.jobs.length === 0) this.getAllJobs();
    }
    search(skipNo) {
        this.setState({ loaded: false, modalFilter: false });
        console.log(this.profession.current);
        let query = {
            profession: this.state.profession,
            // this.profession.current.state.value &&
            // this.profession.current.state.value.value,
            specialization: this.state.specialization,
            // this.specialization.current.state.value &&
            // this.specialization.current.state.value.value,
            superSpecialization: this.state.superSpecialization,
            // this.superSpecialization.current.state.value &&
            // this.superSpecialization.current.state.value.map(
            //     (obj) => obj.value,
            // ),
            experience: this.state.experience,
            // this.experience.current.state.value &&
            // this.experience.current.state.value.value,
            incentives: this.state.incentives,
            // this.incentives.current.state.value &&
            // this.incentives.current.state.value.map((obj) => obj.value),
            type: this.state.type,
            // this.type.current.state.value &&
            // this.type.current.state.value.map((obj) => obj.value),
            location:
                this.state.location !== "" &&
                this.state.location !== "Your Location"
                    ? [this.state.location]
                    : [],
            coordinates:
                this.state.location === "Your Location"
                    ? this.state.coordinates
                    : null,

            // limit: 2,
            // skip: 2,
            // this.location.current.state.value && [
            //     this.location.current.state.value.value,
            // ],
        };

        Object.keys(query).forEach(
            (key) =>
                (query[key] === null ||
                    query[key] === "" ||
                    query[key].length === 0) &&
                delete query[key],
        );
        console.log("#################");
        console.log(query);
        console.log(this.state.freelance);
        if (Object.keys(query).length > 0) {
            if (!this.state.freelance) {
                query = {
                    ...query,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    limit: this.state.pageSize,
                    skip: skipNo ? skipNo : 0,
                };
                axios
                    .post(`/api/job/freelance`, query)
                    .then(({ data }) => {
                        console.log(data);
                        this.setState({
                            jobs: data.jobs,
                            isZero: data.jobs.length === 0,
                            loaded: true,
                            pageCount:
                                data.jobs.length === 0
                                    ? 0
                                    : Math.ceil(
                                          data.count.jobCount /
                                              this.state.pageSize,
                                      ),

                            jobsFound: `${
                                data.jobs.length === 0 ? 0 : data.count.jobCount
                            } ${this.state.profession}${
                                this.state.profession !== "" &&
                                this.state.specialization != ""
                                    ? " / "
                                    : ""
                            }${this.state.specialization} jobs found`,
                        });
                    })
                    .catch((err) => {
                        console.log(err.response);
                        this.setState({ loaded: true });
                    });
            } else if (this.state.freelance) {
                query = {
                    ...query,
                    limit: this.state.pageSize,
                    skip: skipNo ? skipNo : 0,
                };
                axios
                    .post(`/api/job/search`, query)
                    .then(({ data }) => {
                        console.log(data);
                        this.setState({
                            jobs: data.jobs,
                            isZero: data.jobs.length === 0,
                            loaded: true,
                            pageCount:
                                data.jobs.length === 0
                                    ? 0
                                    : Math.ceil(
                                          data.count
                                              ? data.count.jobCount
                                              : 0 / this.state.pageSize,
                                      ),

                            jobsFound: `${
                                data.jobs.length === 0 ? 0 : data.count.jobCount
                            } ${this.state.profession}${
                                this.state.profession !== "" &&
                                this.state.specialization != ""
                                    ? " / "
                                    : ""
                            }${this.state.specialization} jobs found`,
                        });
                        console.log("----------------");
                        console.log(this.state.isZero);
                        // console.log(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        console.log(err.response);
                        this.setState({ loaded: true });
                    });
            }
        } else this.getAllJobs(skipNo);
    }
    render() {
        return (
            <div className='row justify-content-center align-content-center mx-4 mx-lg-2 position-relative'>
                <div
                    className='col-12 col-lg-3  mt-md-4 position-sticky'
                    style={{ top: 0, background: "white" }}>
                    <div className='sticky-filter pt-lg-2 d-none d-lg-block'>
                        {/* <div className='form-group'> */}
                        <div className='form-group'>
                            <div
                                className='pb-2'
                                style={{
                                    height: "max-content",
                                    textAlign: "center",
                                }}>
                                <span style={{ fontSize: "1.2rem" }}>
                                    Freelance
                                </span>
                                <input
                                    className='react-switch-checkbox'
                                    id={`react-switch-new`}
                                    type='checkbox'
                                    ref={this.freelance}
                                    //   checked={this.state.freelance}
                                />

                                <label
                                    className='react-switch-label float-right'
                                    htmlFor={`react-switch-new`}
                                    onClick={() => {
                                        this.setState({
                                            freelance: this.state.current
                                                ? this.freelance.current.checked
                                                : !this.state.freelance,
                                        });

                                        // this.search(0);
                                    }}>
                                    <span className={`react-switch-button`} />
                                </label>
                            </div>
                            <h5
                                style={{
                                    textAlign: "center",
                                }}>
                                Location
                            </h5>
                            <InputGroup className=''>
                                <div className='row w-100'>
                                    <div className='col-10'>
                                        <Select
                                            isClearable={true}
                                            autosize={true}
                                            placeholder='Location'
                                            options={locationArray}
                                            ref={this.location}
                                            onChange={(e) => {
                                                console.log(e);
                                                this.setState({
                                                    location: e ? e.value : "",
                                                });
                                            }}
                                        />
                                    </div>
                                    <button
                                        className='btn btn-secondary btn-hover col-2 px-2 '
                                        onClick={this.getLocation}>
                                        <FontAwesomeIcon
                                            icon={faMapMarkerAlt}
                                        />
                                    </button>
                                </div>
                            </InputGroup>
                        </div>

                        <Nav tabs className='justify-content-center'>
                            <NavItem className='mr-1'>
                                <NavLink
                                    onClick={() => {
                                        this.toggleTab("1");
                                    }}
                                    className={`${
                                        this.state.activeTab === "1" &&
                                        "active-tab"
                                    } p-2 tab`}>
                                    Profession
                                </NavLink>
                            </NavItem>
                            <NavItem className='ml-1'>
                                <NavLink
                                    onClick={() => {
                                        this.toggleTab("2");
                                    }}
                                    className={`${
                                        this.state.activeTab === "2" &&
                                        "active-tab"
                                    } p-2 tab`}>
                                    Other filters
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent
                            activeTab={this.state.activeTab}
                            className='mt-4'>
                            <TabPane tabId='1'>
                                <Row>
                                    <Col sm='12'>
                                        <div className='form-group'>
                                            <div className='input-group'>
                                                <div
                                                    style={{
                                                        width: `100%`,
                                                    }}>
                                                    <Select
                                                        styles={{
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 100,
                                                            }),
                                                        }}
                                                        autosize={true}
                                                        isClearable={true}
                                                        placeholder='Profession'
                                                        options={
                                                            professionArray
                                                        }
                                                        ref={this.profession}
                                                        onChange={(e) => {
                                                            console.log(e);
                                                            this.setState({
                                                                profession: e
                                                                    ? e.value
                                                                    : "",
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='input-group mt-2'>
                                                <div
                                                    style={{
                                                        width: `100%`,
                                                    }}>
                                                    <Select
                                                        autosize={true}
                                                        isClearable={true}
                                                        placeholder='Specialization'
                                                        options={
                                                            specializationArray
                                                        }
                                                        ref={
                                                            this.specialization
                                                        }
                                                        onChange={(e) => {
                                                            console.log(e);
                                                            this.setState({
                                                                specialization: e
                                                                    ? e.value
                                                                    : "",
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {!this.state.freelance && (
                                                <div className='mt-3'>
                                                    <div className='col-12'>
                                                        <FormGroup>
                                                            <Label
                                                                className='pl-2'
                                                                for='exampleDate'>
                                                                Start -Date
                                                            </Label>
                                                            <Input
                                                                type='date'
                                                                name='date'
                                                                id='exampleDate'
                                                                placeholder='date placeholder'
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    console.log(
                                                                        e
                                                                            ? new Date(
                                                                                  e.target.value,
                                                                              ).toISOString()
                                                                            : "",
                                                                    );
                                                                    this.setState(
                                                                        {
                                                                            startDate: e
                                                                                ? new Date(
                                                                                      e.target.value,
                                                                                  ).toISOString()
                                                                                : "",
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                        </FormGroup>
                                                    </div>
                                                    <div className='col-12'>
                                                        <FormGroup>
                                                            <Label
                                                                className='pl-2'
                                                                for='exampleDate'>
                                                                End - Date
                                                            </Label>
                                                            <Input
                                                                type='date'
                                                                name='date'
                                                                id='exampleDate'
                                                                placeholder='date placeholder'
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    console.log(
                                                                        e
                                                                            ? new Date(
                                                                                  e.target.value,
                                                                              ).toISOString()
                                                                            : "",
                                                                    );
                                                                    this.setState(
                                                                        {
                                                                            startDate: e
                                                                                ? new Date(
                                                                                      e.target.value,
                                                                                  ).toISOString()
                                                                                : "",
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId='2'>
                                <Row>
                                    <Col sm='12'>
                                        <div className='form-group'>
                                            {/* <h5 style={{ textAlign: "center" }}>
                                                Other Filters
                                            </h5> */}

                                            <InputGroup className='col-12 my-1'>
                                                <div
                                                    style={{
                                                        width: `100%`,
                                                    }}>
                                                    <Select
                                                        isClearable={true}
                                                        autosize={true}
                                                        placeholder='Experience'
                                                        options={
                                                            experienceArray
                                                        }
                                                        style={{
                                                            backgroundColor:
                                                                "red",
                                                        }}
                                                        // className='basic-multi-select'
                                                        // classNamePrefix='select'
                                                        ref={this.experience}
                                                        onChange={(e) => {
                                                            console.log(e);
                                                            this.setState({
                                                                experience: e
                                                                    ? e.value
                                                                    : "",
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </InputGroup>
                                            <InputGroup className='col-12 my-1'>
                                                <div
                                                    style={{
                                                        width: `100%`,
                                                    }}>
                                                    <Select
                                                        autosize={true}
                                                        placeholder='Type'
                                                        isMulti
                                                        options={typeArray}
                                                        // className='basic-multi-select'
                                                        // classNamePrefix='select'
                                                        ref={this.type}
                                                        onChange={(e) => {
                                                            console.log(e);
                                                            this.setState({
                                                                type: e
                                                                    ? e.map(
                                                                          (
                                                                              type,
                                                                          ) =>
                                                                              type.value,
                                                                      )
                                                                    : [],
                                                            });
                                                            console.log(
                                                                this.state.type,
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </InputGroup>
                                            <InputGroup className='col-12 my-1'>
                                                <div
                                                    style={{
                                                        width: `100%`,
                                                    }}>
                                                    <Select
                                                        autosize={true}
                                                        isMulti
                                                        placeholder='Incentives'
                                                        options={
                                                            incentivesArray
                                                        }
                                                        // className='basic-multi-select'
                                                        // classNamePrefix='select'
                                                        ref={this.incentives}
                                                        onChange={(e) => {
                                                            console.log(e);
                                                            this.setState({
                                                                incentives: e
                                                                    ? e.map(
                                                                          (
                                                                              type,
                                                                          ) =>
                                                                              type.value,
                                                                      )
                                                                    : [],
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </InputGroup>

                                            <InputGroup className='col-12 my-1'>
                                                <div
                                                    style={{
                                                        width: `100%`,
                                                    }}>
                                                    <Select
                                                        isMulti
                                                        autosize={true}
                                                        placeholder='Super specialization'
                                                        options={
                                                            superSpecializationArray
                                                        }
                                                        ref={
                                                            this
                                                                .superSpecialization
                                                        }
                                                        onChange={(e) => {
                                                            console.log(e);
                                                            this.setState({
                                                                incentives: e
                                                                    ? e.map(
                                                                          (
                                                                              type,
                                                                          ) =>
                                                                              type.value,
                                                                      )
                                                                    : [],
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </InputGroup>
                                        </div>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                        <div className='form-group row justify-content-center'>
                            <Button
                                className='w-100'
                                color='info'
                                onClick={(e) => {
                                    this.search(0);
                                    this.setState({ currentPage: 0 });
                                }}>
                                Apply filters
                            </Button>
                            {/* <Button
                                className='col-4'
                                onClick={() => this.componentDidCatch()}>
                                Clear filters
                            </Button> */}
                        </div>
                    </div>
                    <div
                        className=' pt-lg-2 d-block d-lg-none position-sticky my-4 pt-2 '
                        style={{ top: 0, textAlign: "center" }}>
                        <h3>
                            Change{" "}
                            <span
                                className='text-info'
                                onClick={this.toggleModalFilter}
                                style={{ cursor: "pointer" }}>
                                Filters
                            </span>
                        </h3>
                    </div>
                    <Modal
                        isOpen={this.state.modalFilter}
                        toggle={this.toggleModalFilter}>
                        <ModalHeader toggle={this.toggleModalFilter}>
                            Filters
                        </ModalHeader>
                        <ModalBody>
                            <div className='form-group'>
                                <div
                                    className='pb-2 d-flex flex-row justify-content-center'
                                    style={{
                                        height: "max-content",
                                        textAlign: "center",
                                    }}>
                                    <span
                                        className='mr-3'
                                        style={{ fontSize: "1.3rem" }}>
                                        Freelance
                                    </span>
                                    <input
                                        className='react-switch-checkbox'
                                        id={`react-switch-new`}
                                        type='checkbox'
                                        ref={this.freelance}
                                        checked={!this.state.freelance}
                                    />

                                    <label
                                        className='react-switch-label float-right'
                                        htmlFor={`react-switch-new`}
                                        onClick={() => {
                                            console.log(
                                                this.freelance.current.checked,
                                            );
                                            this.setState({
                                                freelance: !this.state
                                                    .freelance,
                                            });
                                            this.freelance.current.checked = !this
                                                .state.freelance;
                                            // this.search(0);
                                        }}>
                                        <span
                                            className={`react-switch-button`}
                                        />
                                    </label>
                                </div>
                                <h5
                                    style={{
                                        textAlign: "center",
                                    }}>
                                    Location
                                </h5>
                                <InputGroup className=''>
                                    <div className='row w-100'>
                                        <div className='col-10'>
                                            <Select
                                                isClearable={true}
                                                autosize={true}
                                                placeholder='Location'
                                                options={locationArray}
                                                ref={this.location}
                                                defaultValue={{
                                                    label: this.state.location,
                                                    value: this.state.location,
                                                }}
                                                onChange={(e) => {
                                                    console.log(e);

                                                    this.setState({
                                                        location: e
                                                            ? e.value
                                                            : "",
                                                    });
                                                    this.location.current.state.value = {
                                                        label: this.state
                                                            .location,
                                                        value: this.state
                                                            .location,
                                                    };
                                                }}
                                            />
                                        </div>
                                        <button
                                            className='btn btn-secondary btn-hover col-2 px-2 '
                                            onClick={this.getLocation}>
                                            <FontAwesomeIcon
                                                icon={faMapMarkerAlt}
                                            />
                                        </button>
                                    </div>
                                </InputGroup>
                            </div>

                            <Nav tabs className='justify-content-center'>
                                <NavItem className='mr-1'>
                                    <NavLink
                                        onClick={() => {
                                            this.toggleTab("1");
                                        }}
                                        className={`${
                                            this.state.activeTab === "1" &&
                                            "active-tab"
                                        } p-2 tab`}>
                                        Profession
                                    </NavLink>
                                </NavItem>
                                <NavItem className='ml-1'>
                                    <NavLink
                                        onClick={() => {
                                            this.toggleTab("2");
                                        }}
                                        className={`${
                                            this.state.activeTab === "2" &&
                                            "active-tab"
                                        } p-2 tab`}>
                                        Other filters
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent
                                activeTab={this.state.activeTab}
                                className='mt-4'>
                                <TabPane tabId='1'>
                                    <Row>
                                        <Col sm='12'>
                                            <div className='form-group'>
                                                <div className='input-group'>
                                                    <div
                                                        style={{
                                                            width: `100%`,
                                                        }}>
                                                        <h6>Profession</h6>
                                                        <Select
                                                            styles={{
                                                                menu: (
                                                                    base,
                                                                ) => ({
                                                                    ...base,
                                                                    zIndex: 100,
                                                                }),
                                                            }}
                                                            autosize={true}
                                                            isClearable={true}
                                                            placeholder='Profession'
                                                            defaultValue={{
                                                                value: this
                                                                    .state
                                                                    .profession,
                                                                label: this
                                                                    .state
                                                                    .profession,
                                                            }}
                                                            // value={
                                                            //     this.state
                                                            //         .profession
                                                            // }
                                                            options={
                                                                professionArray
                                                            }
                                                            ref={
                                                                this.profession
                                                            }
                                                            onChange={(e) => {
                                                                console.log(e);
                                                                this.setState({
                                                                    profession: e
                                                                        ? e.value
                                                                        : "",
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='input-group mt-2'>
                                                    <div
                                                        style={{
                                                            width: `100%`,
                                                        }}>
                                                        <h6>Specialization</h6>
                                                        <Select
                                                            autosize={true}
                                                            isClearable={true}
                                                            placeholder='Specialization'
                                                            options={
                                                                specializationArray
                                                            }
                                                            ref={
                                                                this
                                                                    .specialization
                                                            }
                                                            defaultValue={{
                                                                value: this
                                                                    .state
                                                                    .specialization,
                                                                label: this
                                                                    .state
                                                                    .specialization,
                                                            }}
                                                            onChange={(e) => {
                                                                console.log(e);
                                                                this.setState({
                                                                    specialization: e
                                                                        ? e.value
                                                                        : "",
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tabId='2'>
                                    <Row>
                                        <Col sm='12'>
                                            <div className='form-group'>
                                                {/* <h5 style={{ textAlign: "center" }}>
                                                Other Filters
                                            </h5> */}

                                                <InputGroup className='col-12 my-1'>
                                                    <div
                                                        style={{
                                                            width: `100%`,
                                                        }}>
                                                        <Select
                                                            isClearable={true}
                                                            autosize={true}
                                                            placeholder='Experience'
                                                            options={
                                                                experienceArray
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "red",
                                                            }}
                                                            // className='basic-multi-select'
                                                            // classNamePrefix='select'
                                                            ref={
                                                                this.experience
                                                            }
                                                            defaultValue={
                                                                this.state
                                                                    .experience ===
                                                                ""
                                                                    ? {
                                                                          label:
                                                                              "Experience",
                                                                          value:
                                                                              "",
                                                                      }
                                                                    : {
                                                                          value: this
                                                                              .state
                                                                              .experience,
                                                                          label: this
                                                                              .state
                                                                              .experience,
                                                                      }
                                                            }
                                                            onChange={(e) => {
                                                                console.log(e);
                                                                this.setState({
                                                                    experience: e
                                                                        ? e.value
                                                                        : "",
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </InputGroup>
                                                <InputGroup className='col-12 my-1'>
                                                    <div
                                                        style={{
                                                            width: `100%`,
                                                        }}>
                                                        <Select
                                                            autosize={true}
                                                            placeholder='Type'
                                                            isMulti
                                                            options={typeArray}
                                                            // className='basic-multi-select'
                                                            // classNamePrefix='select'
                                                            defaultValue={this.state.type.map(
                                                                (inc) => {
                                                                    return {
                                                                        value: inc,
                                                                        label: inc,
                                                                    };
                                                                },
                                                            )}
                                                            ref={this.type}
                                                            onChange={(e) => {
                                                                console.log(e);
                                                                this.setState({
                                                                    type: e
                                                                        ? e.map(
                                                                              (
                                                                                  type,
                                                                              ) =>
                                                                                  type.value,
                                                                          )
                                                                        : [],
                                                                });
                                                                console.log(
                                                                    this.state
                                                                        .type,
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </InputGroup>
                                                <InputGroup className='col-12 my-1'>
                                                    <div
                                                        style={{
                                                            width: `100%`,
                                                        }}>
                                                        <Select
                                                            autosize={true}
                                                            isMulti
                                                            placeholder='Incentives'
                                                            options={
                                                                incentivesArray
                                                            }
                                                            // className='basic-multi-select'
                                                            // classNamePrefix='select'
                                                            ref={
                                                                this.incentives
                                                            }
                                                            defaultValue={this.state.incentives.map(
                                                                (inc) => {
                                                                    return {
                                                                        value: inc,
                                                                        label: inc,
                                                                    };
                                                                },
                                                            )}
                                                            onChange={(e) => {
                                                                console.log(e);
                                                                this.setState({
                                                                    incentives: e
                                                                        ? e.map(
                                                                              (
                                                                                  type,
                                                                              ) =>
                                                                                  type.value,
                                                                          )
                                                                        : [],
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </InputGroup>

                                                <InputGroup className='col-12 my-1'>
                                                    <div
                                                        style={{
                                                            width: `100%`,
                                                        }}>
                                                        <Select
                                                            isMulti
                                                            autosize={true}
                                                            placeholder='Super specialization'
                                                            options={
                                                                superSpecializationArray
                                                            }
                                                            ref={
                                                                this
                                                                    .superSpecialization
                                                            }
                                                            defaultValue={this.state.superSpecialization.map(
                                                                (inc) => {
                                                                    return {
                                                                        value: inc,
                                                                        label: inc,
                                                                    };
                                                                },
                                                            )}
                                                            onChange={(e) => {
                                                                console.log(e);
                                                                this.setState({
                                                                    incentives: e
                                                                        ? e.map(
                                                                              (
                                                                                  type,
                                                                              ) =>
                                                                                  type.value,
                                                                          )
                                                                        : [],
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </InputGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </TabContent>
                            <div className='form-group row justify-content-center'>
                                <Button
                                    className='w-100'
                                    color='info'
                                    onClick={(e) => {
                                        this.search(0);
                                        this.setState({ currentPage: 0 });
                                    }}>
                                    Apply filters
                                </Button>
                                {/* <Button
                                className='col-4'
                                onClick={() => this.componentDidCatch()}>
                                Clear filters
                            </Button> */}
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
                <div
                    className=' my-4 mx-4 vertical'
                    style={{
                        width: ".02rem",
                        // borderLeft: ".1rem solid lightgray",
                        backgroundColor: "#a9a9a9",
                    }}></div>
                <hr
                    className='horizontal'
                    style={{
                        height: ".06rem",
                        width: "120%",
                        backgroundColor: "lightgrey",
                    }}
                />
                {/* {!this.state.freelance && (
                    <div className='col-12 col-lg-8 '></div>
                )} */}
                {
                    <div className='col-12 col-lg-8 '>
                        {this.state.loaded ? (
                            this.state.jobs.length !== 0 &&
                            !this.state.isZero ? (
                                <div className='position-relative '>
                                    <div
                                        className='sticky-filter p-1 d-flex justify-content-between align-content-center'
                                        style={{
                                            top: 0,
                                            backgroundColor: "white",
                                            zIndex: 500,
                                        }}>
                                        <h3 className='mt-2'>
                                            {this.state.jobsFound}
                                        </h3>
                                    </div>

                                    {this.state.jobs.map((job) => {
                                        return (
                                            <Job
                                                key={job._id}
                                                job={job}
                                                userId={
                                                    this.props.user
                                                        ? this.props.user._id
                                                        : null
                                                }
                                                user={this.props.user}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <h2
                                    className='my-5'
                                    style={{
                                        textAlign: "center",
                                        // marginTop: "10rem",
                                    }}>
                                    No results found
                                </h2>
                            )
                        ) : (
                            <div
                                className='mx-auto my-auto'
                                style={{ textAlign: "center" }}>
                                <Loader
                                    type='Bars'
                                    color='#17a2b8'
                                    height={300}
                                    width={120}
                                />
                            </div>
                        )}
                    </div>
                }
                <div className='pagination-wrapper'>
                    <Pagination aria-label='Page navigation example'>
                        <PaginationItem disabled={this.state.currentPage <= 0}>
                            <PaginationLink
                                onClick={(e) => {
                                    this.setState({
                                        currentPage: this.state.currentPage - 1,
                                    });
                                    this.search(
                                        (this.state.currentPage - 1) *
                                            this.state.pageSize,
                                    );
                                }}
                                previous
                                href='#'
                            />
                        </PaginationItem>

                        {[...Array(this.state.pageCount)].map((page, i) => (
                            <PaginationItem
                                active={i === this.state.currentPage}
                                key={i}>
                                <PaginationLink
                                    onClick={(e) => {
                                        this.setState({
                                            currentPage: i,
                                        });
                                        this.search(i * this.state.pageSize);
                                    }}
                                    href='#'>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem
                            disabled={
                                this.state.currentPage >=
                                this.state.pageCount - 1
                                // true
                            }>
                            <PaginationLink
                                onClick={(e) => {
                                    this.setState({
                                        currentPage: this.state.currentPage + 1,
                                    });
                                    this.search(
                                        (this.state.currentPage + 1) *
                                            this.state.pageSize,
                                    );
                                }}
                                next
                                href='#'
                            />
                        </PaginationItem>
                    </Pagination>
                </div>
                {/* </div> */}
            </div>
        );
    }
}

// {`${this.state.jobs.length} `}
//                                         {this.specialization.current.state
//                                             .value &&
//                                         this.profession.current.state.value ? (
//                                             <span className='text-info'>{`${this.profession.current.state.value.value} / ${this.specialization.current.state.value.value}`}</span>
//                                         ) : this.specialization.current.state
//                                               .value ? (
//                                             <span className='text-info'>
//                                                 {
//                                                     this.specialization.current
//                                                         .state.value.value
//                                                 }
//                                             </span>
//                                         ) : this.profession.current.state
//                                               .value ? (
//                                             <span className='text-info'>{`${this.profession.current.state.value.value}`}</span>
//                                         ) : (
//                                             ""
//                                         )}
//                                         {` jobs found`}
