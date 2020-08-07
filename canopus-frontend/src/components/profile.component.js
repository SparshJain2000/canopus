import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
    faUser,
    faMapMarker,
    faEnvelope,
    faBriefcaseMedical,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "react-loader-spinner";
import { Media } from "reactstrap";
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
        };
    }
    componentDidMount() {
        axios
            .get("/api/user/profile")
            .then(({ data }) => {
                if (!data.image)
                    data.image =
                        "https://i.pinimg.com/736x/74/73/ba/7473ba244a0ace6d9d301d5fe4478983--sarcasm-meme.jpg";
                this.setState({
                    profile: data,
                });
                console.log(this.state.profile);
            })
            .catch((err) => console.log(err.response));
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
                                    {this.state.profile.address && (
                                        <div className='m-2 mx-auto'>
                                            <h6>
                                                <FontAwesomeIcon
                                                    icon={faMapMarker}
                                                    className='ml-2 mr-3'
                                                />
                                                {
                                                    this.state.profile.address
                                                        .city
                                                }
                                                ,{" "}
                                                {this.state.profile.address.pin}
                                                ,{" "}
                                                {
                                                    this.state.profile.address
                                                        .country
                                                }
                                            </h6>
                                        </div>
                                    )}
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
                                                        <div>{data.time}</div>
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
