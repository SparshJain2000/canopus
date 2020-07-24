import React, { Component } from "react";
import NavbarComponent from "./navbar.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faMapMarker } from "@fortawesome/free-solid-svg-icons";
import { Media, Badge } from "reactstrap";
import doctor from "../images/doctor.png";
const Job = ({ job }) => {
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
            </Media>
            <Media body className='col-12 col-sm-9 my-4 my-md-2'>
                <Media heading>{job.company}</Media>
                <Media heading>
                    <h6>{job.location}</h6>
                </Media>
                {job.description}
                <hr />
                {job.tags.map((tag) => (
                    <Badge color='info' className='mx-1'>
                        {tag}
                    </Badge>
                ))}
            </Media>
        </Media>
    );
};
export default class JobSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
        };
    }
    componentDidMount() {
        let job = {
            id: "",
            company: "Med & Co.",
            location: "Delhi, India",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, dolor sit amet, consectetur adipisicing elit. Distinctiodolor sit amet, consectetur adipisicing elit. Distinctio ",
            tags: ["Full Time", "Intern", "MBBS", "MD"],
        };
        let jobs = [];
        for (let i = 0; i < 4; i++) {
            job.id = i;
            jobs = [...jobs, job];
        }
        this.setState({
            jobs: jobs,
        });
        // console.log(this.state.jobs);
    }
    render() {
        return (
            <div>
                <NavbarComponent />
                <div className='row justify-content-center align-content-center mx-4'>
                    <div className='col-12 col-lg-4 p-3 p-md-5 mt-md-3'>
                        <div className='form-group'>
                            <h5 style={{ textAlign: "center" }}>Location</h5>
                            <div className='input-group'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Location'
                                    required
                                />
                                <div className='input-group-append'>
                                    <button className='input-group-text'>
                                        <FontAwesomeIcon icon={faMapMarker} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='form-group'>
                            <h5 style={{ textAlign: "center" }}>
                                Select a Profession
                            </h5>

                            <div className='input-group'>
                                <input
                                    // type='password'
                                    className='form-control'
                                    // name='password'
                                    placeholder='Search for a profession'
                                    list='professions'
                                    // required
                                />
                                <datalist id='professions'>
                                    <option value='Academics / Research'></option>
                                    <option value='Physician / Surgeon'></option>
                                    <option value='Nurse Practitioner'></option>
                                    <option value='Physician Assistant'></option>
                                    <option value='Certified Registered Nurse'></option>
                                    <option value='Anesthetist (CRNA)'></option>
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-lg-8 '>
                        {console.log(this.state.jobs)}
                        {this.state.jobs.length &&
                            this.state.jobs.map((job) => {
                                return <Job key={job.id} job={job} />;
                            })}
                    </div>
                </div>
            </div>
        );
    }
}
