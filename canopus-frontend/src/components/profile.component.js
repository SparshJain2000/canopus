import React, { Component } from "react";
import NavbarComponent from "./navbar.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
    faUser,
    faMapMarker,
    faEnvelope,
    faBriefcaseMedical,
} from "@fortawesome/free-solid-svg-icons";
import ReactLoading from "react-loading";
import { Media } from "reactstrap";
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
        };
        // console.log(this.props.match.params.id);
    }
    componentDidMount() {
        axios
            .get("/api/user/profile")
            .then(({ data }) => {
                data.image =
                    "https://i.pinimg.com/736x/74/73/ba/7473ba244a0ace6d9d301d5fe4478983--sarcasm-meme.jpg";
                this.setState({
                    profile: data,
                });
                console.log(this.state.profile);
            })
            .catch((err) => console.log(err.response));
        // const user = {
        //     id: 1,
        //     firstName: "Sparsh",
        //     lastName: "Jain",
        //     headline: "Neurosergeon ",
        //     image:
        //         "https://i.pinimg.com/736x/74/73/ba/7473ba244a0ace6d9d301d5fe4478983--sarcasm-meme.jpg",
        //     email: "jainsparsh@gmail.com",
        //     address: {
        //         city: "MZN",
        //         state: "UP",
        //         country: "India",
        //     },
        //     about:
        //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias dolorum vero voluptate consequuntur impedit pariatur laboriosam excepturi, iusto, nemo, iure illo voluptatum eos assumenda odit unde blanditiis aspernatur ab modi?",
        //     education: [
        //         {
        //             institute: "DD public school",
        //             startYear: 2016,
        //             endYear: 2018,
        //             degree: "High School",
        //         },
        //         {
        //             institute: "Vellore Institute of Technology",
        //             startYear: 2018,
        //             degree: "B.Tech(IT)",
        //             endYear: 2022,
        //         },
        //     ],
        //     experience: [
        //         {
        //             headline: "Intern",
        //             company: "Meds and Co.",
        //             startYear: 2018,
        //             endYear: 2020,
        //         },
        //         {
        //             headline: "Anesthesist",
        //             company: "XYZ hospital",
        //             startYear: 2019,
        //             endYear: 2022,
        //         },
        //     ],
        //     certificates: [
        //         {
        //             url: "https://vit.ac.in/",
        //             organization: "Vellore Institute of Technology",
        //             course: "Artificial Intelligence",
        //             issuedDate: "12-12-2012",
        //             credentialId: "213719238enef-423",
        //         },
        //         {
        //             url: "https://www.mit.edu/",
        //             organization: "Stanford University",
        //             course: "Business Mathematics",
        //             issuedDate: "12-12-2012",
        //             credentialId: "213719238enef-423",
        //         },
        //     ],
        // };
        // this.setState({
        //     profile: user,
        // });
    }
    render() {
        return (
            <div>
                {/* <NavbarComponent /> */}
                {this.state.profile ? (
                    <div className='row my-3 mx-3 mx-lg-0 p-2 justify-content-center '>
                        <div className='col-12 col-lg-3'>
                            <div
                                className='block row text-dark p-2 mt-3 mb-5 my-lg-0'
                                style={{
                                    // backgroundColor: "rgba(0,0,0,.15)",
                                    // borderRadius: "0.5rem",
                                    height: "fit-content",
                                }}>
                                <img
                                    src={this.state.profile.image}
                                    alt=''
                                    className='img-fluid col-12'
                                    style={{
                                        borderRadius: "0.5rem",
                                    }}
                                />
                                <div
                                    className='py-3 px-2 col-12'
                                    style={{
                                        // background: "rgba(0,0,0,.3)",
                                        borderRadius: "0.5rem",
                                    }}>
                                    <div className='m-2 mx-auto'>
                                        <h6>
                                            <FontAwesomeIcon
                                                icon={faUser}
                                                className='ml-2 mr-3'
                                            />
                                            {this.state.profile.firstName}{" "}
                                            {this.state.profile.lastName}
                                        </h6>
                                    </div>
                                    <div className='m-2 mx-auto'>
                                        <h6>
                                            <FontAwesomeIcon
                                                icon={faBriefcaseMedical}
                                                className='ml-2 mr-3'
                                            />
                                            {this.state.profile.headline &&
                                                this.state.profile.headline}
                                        </h6>
                                    </div>
                                    <div className='m-2 mx-auto'>
                                        <h6>
                                            <FontAwesomeIcon
                                                icon={faMapMarker}
                                                className='ml-2 mr-3'
                                            />
                                            {this.state.profile.address.city},{" "}
                                            {this.state.profile.address.pin},{" "}
                                            {this.state.profile.address.country}
                                        </h6>
                                    </div>
                                    <div className='m-2 mx-auto'>
                                        <h6>
                                            <FontAwesomeIcon
                                                icon={faEnvelope}
                                                className='ml-2 mr-3'
                                            />
                                            {this.state.profile.username}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                            <div className='p-4 block row mt-2 mt-lg-4'>
                                <h2>About</h2>
                                <hr />

                                <p>{this.state.profile.description}</p>
                            </div>
                        </div>

                        <div className='col-12 col-lg-7 mt-5 mt-lg-0 ml-sm-0 ml-lg-5'>
                            <div className='p-4 block'>
                                <h2>Experience</h2>
                                {this.state.profile.experience &&
                                    this.state.profile.experience.map(
                                        (data) => (
                                            <div>
                                                <hr />
                                                <Media>
                                                    <Media body>
                                                        <Media heading>
                                                            <h5>
                                                                <strong>
                                                                    {data.title}
                                                                </strong>
                                                            </h5>
                                                        </Media>
                                                        <Media heading>
                                                            <h6>{data.line}</h6>
                                                        </Media>
                                                        <div>
                                                            {/* {data.startYear} -{" "}
                                                    {data.endYear} */}
                                                            {data.time}
                                                        </div>
                                                    </Media>
                                                </Media>
                                            </div>
                                        ),
                                    )}
                            </div>
                            {this.state.profile.education && (
                                <div className='p-4 block mt-4'>
                                    <h2>Education</h2>
                                    {this.state.profile.education.map(
                                        (data) => (
                                            <div>
                                                <hr />
                                                <Media>
                                                    <Media body>
                                                        <Media heading>
                                                            <h5>
                                                                <strong>
                                                                    {
                                                                        data.institute
                                                                    }
                                                                </strong>
                                                            </h5>
                                                        </Media>
                                                        <Media heading>
                                                            <h6>
                                                                {data.degree}
                                                            </h6>
                                                        </Media>
                                                        <div>
                                                            {data.startYear} -{" "}
                                                            {data.endYear}
                                                        </div>
                                                    </Media>
                                                </Media>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                            {this.state.profile.certificates && (
                                <div className='p-4 block mt-4'>
                                    <h2>Certificates</h2>
                                    {this.state.profile.certificates.map(
                                        (certificate) => (
                                            <div>
                                                <hr />

                                                <Media>
                                                    <Media body>
                                                        <Media heading>
                                                            <h5>
                                                                <strong>
                                                                    {
                                                                        certificate.course
                                                                    }
                                                                </strong>
                                                            </h5>
                                                        </Media>
                                                        <Media heading>
                                                            <h6>
                                                                <em>
                                                                    {
                                                                        certificate.organization
                                                                    }
                                                                </em>
                                                            </h6>
                                                        </Media>
                                                        <div>
                                                            issued-date :{" "}
                                                            {
                                                                certificate.issuedDate
                                                            }
                                                            <br />
                                                            credential-id :{" "}
                                                            {
                                                                certificate.credentialId
                                                            }
                                                            <br />
                                                            <a
                                                                href={
                                                                    certificate.url
                                                                }
                                                                alt='url'>
                                                                See Credentials
                                                            </a>
                                                        </div>
                                                    </Media>
                                                </Media>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
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
