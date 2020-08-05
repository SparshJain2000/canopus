import React, { Component, createRef } from "react";
// import { Transition } from "react-transition-group";
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
import { Sticky, Rail } from "semantic-ui-react";

import doctor from "../images/doctor.png";
import Loader from "react-loader-spinner";
import Select from "react-select";
import data from "../data";
import { slideInRight } from "react-animations";
import styled, { keyframes } from "styled-components";
const BounceIn = styled.div`
    animation: 1s ${keyframes`${slideInRight}`} 0s;
`;
// const duration = 300;

// const defaultStyle = {
//     transition: `opacity ${duration}ms ease-in-out`,
//     opacity: 0,
// };

// const transitionStyles = {
//     entering: { opacity: 1 },
//     entered: { opacity: 1 },
//     exiting: { opacity: 0 },
//     exited: { opacity: 0 },
// };

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
        <BounceIn>
            <Media className='row block justify-content-center my-3 mx-auto py-4 px-2 px-md-4'>
                <Media
                    left
                    href='#'
                    className='col-12 col-sm-3 my-auto mx-auto'>
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
                            {job.description.incentives.map(
                                (inc) => `${inc} ,`,
                            )}
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
        </BounceIn>
    );
};
export default class JobSearch extends Component {
    contextRef = createRef();
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            activeTab: "1",
            // isSticky:false
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.getAllJobs = this.getAllJobs.bind(this);
        this.search = this.search.bind(this);
        this.location = React.createRef();
        this.profession = React.createRef();
        this.specialization = React.createRef();
        this.experience = React.createRef();
        this.type = React.createRef();
        this.incentives = React.createRef();
        this.superSpecialization = React.createRef();
        // this.filter=React.createRef();
    }
    // handleScroll(){
    //     if (this.fixed.current) {
    //         this.setState({isSticky:this.fixed.current.getBoundingClientRect().top <= 0});
    //     }
    // }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) this.setState({ activeTab: tab });
    }
    getAllJobs() {
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
    componentDidMount() {
        if (this.props.location.state) {
            this.profession.current.state.value = {
                value: this.props.location.state,
                label: this.props.location.state,
            };
            const query = {
                profession: this.props.location.state,
            };
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
        } else if (this.state.jobs.length === 0) this.getAllJobs();
    }
    search() {
        this.setState({ loaded: false });
        // console.log(this.profession.current.value);
        console.log(this.profession.current);
        const query = {
            profession:
                this.profession.current.state.value &&
                this.profession.current.state.value.value,
            specialization:
                this.specialization.current.state.value &&
                this.specialization.current.state.value.value,
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
        if (Object.keys(query).length > 0)
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
        else this.getAllJobs();
    }
    render() {
        return (
            <div className='row justify-content-center align-content-center mx-4 mx-lg-2'>
                <div className='col-12 col-lg-3 px-3 px-lg-3 pr-lg-5 p-1 p-md-3 mt-md-4 position-relative'>
                    <div className='position-sticky pt-lg-2' style={{ top: 0 }}>
                        <div className='form-group'>
                            <h5
                                style={{
                                    textAlign: "center",
                                }}>
                                Location
                            </h5>
                            <InputGroup className=''>
                                <div
                                    style={{
                                        width: `100%`,
                                    }}>
                                    <Select
                                        isClearable={true}
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
                                                        ref={this.experience}
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
                </div>

                <div
                    className='col-1 my-4 vertical'
                    style={{
                        maxWidth: "1rem",
                        borderLeft: ".1rem solid lightgray",
                    }}></div>
                <hr
                    className='horizontal'
                    style={{
                        height: ".06rem",
                        width: "120%",
                        backgroundColor: "lightgrey",
                    }}
                />
                <div className='col-12 col-lg-8 '>
                    {console.log(this.state.jobs)}
                    {this.state.loaded ? (
                        this.state.jobs.length !== 0 ? (
                            <div>
                                <h3 className='mt-2'>
                                    {this.state.jobs.length} jobs found
                                </h3>
                                {this.state.jobs.map((job) => {
                                    return <Job key={job.id} job={job} />;
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
                                width={220}
                            />
                        </div>
                    )}
                </div>
            </div>
            //    </div>
        );
    }
}
