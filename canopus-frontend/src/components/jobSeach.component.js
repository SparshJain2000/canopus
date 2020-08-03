import React, { Component } from "react";
// import NavbarComponent from "./navbar.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import {
    Media,
    Badge,
    Button,
    InputGroup,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    Row,
    Col,
} from "reactstrap";
import axios from "axios";
import doctor from "../images/doctor.png";
import ReactLoading from "react-loading";
import Select from "react-select";
import data from "../data";

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

const Job = ({ job }) => {
    const applyJob = () => {
        axios
            .post(`/api/job/apply/${job._id}`)
            .then(({ data }) => {
                console.log(data);
            })
            .catch((err) => console.log(err.response));
    };
    return (
        <Media className='row block justify-content-center my-5 mx-auto py-4 px-2 px-md-4'>
            <Media left href='#' className='col-12 col-sm-3 my-auto mx-auto'>
                <Media
                    object
                    src={doctor}
                    alt='Generic placeholder image'
                    className='img-fluid'
                    // style={{ maxWidth: "50%" }}
                />
                <Button
                    color='primary w-100 mt-3'
                    // className='float-right'
                    onClick={applyJob}>
                    Apply
                </Button>
            </Media>
            <Media body className='col-12 col-sm-9 my-4 my-md-2 p-2'>
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
                        <strong>Type:</strong>
                        {job.description.type.map((type) => `${type} , `)}
                        <br />
                        <strong>Experience: </strong>
                        {job.description.experience}
                        <br />
                        <strong>incentives: </strong>
                        {job.description.incentives.map((inc) => `${inc} ,`)}
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
                <hr />

                {job.superSpecialization &&
                    job.superSpecialization.map((tag) => (
                        <Badge color='info' className='mx-1'>
                            {tag}
                        </Badge>
                    ))}

                <Badge color='success' className='float-right mt-3'>
                    {job.author && job.author.username}
                </Badge>
            </Media>
        </Media>
    );
};
export default class JobSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            activeTab: "1",
            loaded: false,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.search = this.search.bind(this);
        this.location = React.createRef();
        this.profession = React.createRef();
        this.specialization = React.createRef();
        this.experience = React.createRef();
        this.type = React.createRef();
        this.incentives = React.createRef();
        this.superSpecialization = React.createRef();
    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }
    componentDidMount() {
        if (this.state.jobs.length === 0)
            axios
                .get(`/api/job`)
                .then(({ data: { jobs } }) => {
                    this.setState({
                        jobs: jobs,
                        loaded: true,
                    });
                    console.log(jobs);
                })
                .catch((err) => {
                    console.log(err);
                    // window.location = "/";
                });
    }
    search() {
        this.setState({ loaded: false });
        // console.log(this.profession.current.value);
        const query = {
            profession: this.profession.current.value,
            specialization: this.specialization.current.value,
            superSpecialization:
                this.superSpecialization.current.state.value &&
                this.superSpecialization.current.state.value.map(
                    (obj) => obj.value,
                ),

            experience:
                this.experience.current.state.value &&
                this.experience.current.state.value.value,
            incentives:
                this.incentives.current.state.value &&
                this.incentives.current.state.value.map((obj) => obj.value),
            type:
                this.type.current.state.value &&
                this.type.current.state.value.map((obj) => obj.value),
            location:
                this.location.current.state.value &&
                this.location.current.state.value.value,
        };
        Object.keys(query).forEach(
            (key) =>
                (query[key] === null ||
                    query[key] === "" ||
                    query[key] === []) &&
                delete query[key],
        );
        console.log(query);
        axios
            .post(`/api/job/search`, query)
            .then(({ data }) => {
                this.setState({ jobs: data, loaded: true });
                // console.log(data);
            })
            .catch((err) => {
                console.log(err.response);
                this.setState({ loaded: true });
            });
    }
    render() {
        return (
            <div>
                {/* <NavbarComponent /> */}
                <div className='row justify-content-center align-content-center mx-4'>
                    <div className='col-12 col-lg-4 p-3 p-md-5 mt-md-3'>
                        <div className='form-group'>
                            <h5 style={{ textAlign: "center" }}>Location</h5>
                            <InputGroup className=''>
                                <div style={{ width: `100%` }}>
                                    <Select
                                        autosize={true}
                                        placeholder='Location'
                                        options={locationArray}
                                        ref={this.location}
                                    />
                                </div>
                            </InputGroup>
                        </div>

                        <Nav tabs className='justify-content-center'>
                            <NavItem>
                                <NavLink
                                    onClick={() => {
                                        this.toggleTab("1");
                                    }}
                                    className={
                                        this.state.activeTab === "1" &&
                                        "active-tab"
                                    }>
                                    Profession
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    onClick={() => {
                                        this.toggleTab("2");
                                    }}
                                    className={
                                        this.state.activeTab === "2"
                                            ? "active-tab"
                                            : ""
                                    }>
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
                                            {/* <h5 style={{ textAlign: "center" }}>
                                                Select a Profession
                                            </h5> */}

                                            <div className='input-group'>
                                                <input
                                                    ref={this.profession}
                                                    className='form-control'
                                                    placeholder='Search for a profession'
                                                    list='professions'
                                                    // required
                                                />
                                                <datalist id='professions'>
                                                    {data.professions.map(
                                                        (profession) => (
                                                            <option
                                                                value={
                                                                    profession
                                                                }></option>
                                                        ),
                                                    )}
                                                </datalist>
                                            </div>
                                            <div className='input-group mt-2'>
                                                <input
                                                    placeholder='search for Specialization'
                                                    ref={this.specialization}
                                                    list='specializations'
                                                    className='form-control'
                                                />
                                                <datalist id='specializations'>
                                                    {data.specializations.map(
                                                        (data) => (
                                                            <option
                                                                value={
                                                                    data
                                                                }></option>
                                                        ),
                                                    )}
                                                </datalist>
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
                                                <div style={{ width: `100%` }}>
                                                    <Select
                                                        autosize={true}
                                                        placeholder='Experience'
                                                        options={
                                                            experienceArray
                                                        }
                                                        // className='basic-multi-select'
                                                        // classNamePrefix='select'
                                                        ref={this.experience}
                                                    />
                                                </div>
                                            </InputGroup>
                                            <InputGroup className='col-12 my-1'>
                                                <div style={{ width: `100%` }}>
                                                    <Select
                                                        autosize={true}
                                                        placeholder='Type'
                                                        isMulti
                                                        options={typeArray}
                                                        // className='basic-multi-select'
                                                        // classNamePrefix='select'
                                                        ref={this.type}
                                                    />
                                                </div>
                                            </InputGroup>
                                            <InputGroup className='col-12 my-1'>
                                                <div style={{ width: `100%` }}>
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
                                                    />
                                                </div>
                                            </InputGroup>

                                            <InputGroup className='col-12 my-1'>
                                                <div style={{ width: `100%` }}>
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
                                onClick={this.search}>
                                Apply filters
                            </Button>
                            {/* <Button
                                className='col-4'
                                onClick={() => this.componentDidCatch()}>
                                Clear filters
                            </Button> */}
                        </div>
                    </div>
                    <div className='col-12 col-lg-8 '>
                        {console.log(this.state.jobs)}
                        {this.state.loaded ? (
                            this.state.jobs.length !== 0 ? (
                                this.state.jobs.map((job) => {
                                    return <Job key={job.id} job={job} />;
                                })
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
                            <ReactLoading
                                type={"spin"}
                                color={"orange"}
                                height={"100vh"}
                                width={"40%"}
                                className='loading mt-5 mx-auto'
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
