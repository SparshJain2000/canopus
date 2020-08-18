import React, { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
    faUser,
    faMapMarkerAlt,
    faEnvelope,
    faBriefcaseMedical,
    faPen,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "../stylesheets/profile.css";
import Loader from "react-loader-spinner";
import {
    Media,
    Button,
    Modal,
    Input,
    ModalHeader,
    ModalFooter,
    ModalBody,
} from "reactstrap";
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: null,
            editable: true,
            modalAbout: false,
            modalDetail: false,
            modalExperience: false,
        };
        this.image = React.createRef();
        this.firstName = React.createRef();
        this.lastName = React.createRef();
        this.pin = React.createRef();
        this.city = React.createRef();
        this.addState = React.createRef();
        this.about = React.createRef();

        this.toggleAbout = this.toggleAbout.bind(this);
        this.toggleDetail = this.toggleDetail.bind(this);
        this.toggleExperience = this.toggleExperience.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.update = this.update.bind(this);
    }
    update() {
        console.log(this.state.profile);
        axios
            .put(`/api/user/profile/update`, this.state.profile)
            .then((res) => {
                console.log(res);
                this.setState({
                    modalDetail: false,
                    modalAbout: false,
                    modalExperience: false,
                });
            })
            .catch((err) => console.log(err));
    }

    toggleAbout() {
        this.setState({ modalAbout: !this.state.modalAbout });
    }
    toggleDetail() {
        // this.lastName.current.value = this.state.profile.lastName;
        this.setState({ modalDetail: !this.state.modalDetail });
    }
    toggleExperience() {
        this.setState({ modalExperience: !this.state.modalExperience });
    }
    uploadImage(e) {
        console.log(this.image.current.value);
        // const files = Array.from(e.target.files);
        // console.log(files);
        // const formData = new FormData();
        const file = e.target.files[0];
        // formData.append("myfile", file, file.name);
        // console.log(formData);

        // console.log(image);
        let pro = this.state.profile;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const image = {
                name: file.name,
                file: reader.result,
            };
            console.log(image);
            axios
                .post(`/api/upload`, image)
                .then((res) => {
                    console.log(res);
                    console.log(this.state);
                    // let pro = this.state.profile;
                    if (pro) pro.image = res.data;
                    this.setState({ profile: pro });
                    this.update();
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.status);
                    console.log(err.code);
                });
        };
    }
    componentDidMount() {
        if (this.props.match) {
            if (!this.props.user) {
                this.setState({ editable: false });
                console.log("not editable");
            } else if (this.props.match.params.id !== this.props.user._id) {
                this.setState({ editable: false });
                console.log("not editable");
            }
            axios
                .get(`/api/user/profile/${this.props.match.params.id}`)
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
        } else
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
                                <div className='img-container '>
                                    <img
                                        src={this.state.profile.image}
                                        alt=''
                                        className='img-fluid col-12 '
                                        style={{
                                            borderRadius: "0.5rem",
                                        }}
                                    />
                                    {this.state.editable && (
                                        <div className='position-relative'>
                                            <button
                                                className='btn btn-info btn-sm m-2 btn-float'
                                                style={{
                                                    borderRadius: "50%",
                                                }}>
                                                <label
                                                    htmlFor='image'
                                                    style={{
                                                        display: "inline-block",
                                                        margin: 0,
                                                        cursor: "pointer",
                                                        width: "100%",
                                                    }}>
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                    />
                                                </label>
                                            </button>

                                            <input
                                                type='file'
                                                style={{
                                                    position: "absolute",
                                                    zIndex: "-1",
                                                    overflow: "hidden",
                                                    opacity: 0,
                                                }}
                                                id='image'
                                                ref={this.image}
                                                onChange={this.uploadImage}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div
                                    className='py-3 px-2 col-12 position-relative'
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
                                                    icon={faMapMarkerAlt}
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
                                    {this.state.editable && (
                                        <button
                                            className='btn btn-info btn-sm m-2 btn-float'
                                            style={{ borderRadius: "50%" }}
                                            onClick={this.toggleDetail}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className='p-4 block row mt-2 mt-lg-4 position-relative'>
                                {this.state.editable && (
                                    <button
                                        className='btn btn-info btn-sm m-2 btn-float'
                                        style={{ borderRadius: "50%" }}
                                        onClick={this.toggleAbout}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                )}
                                <h2>About</h2>
                                <hr />

                                <p>{this.state.profile.description}</p>
                            </div>
                        </div>

                        <div className='col-12 col-lg-7 mt-5 mt-lg-0 ml-sm-0 ml-lg-5 '>
                            <div className='p-4 block position-relative'>
                                {this.state.editable && (
                                    <button
                                        className='btn btn-info btn-sm m-2 btn-float'
                                        style={{ borderRadius: "50%" }}
                                        onClick={this.toggleExperience}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                )}
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
                        <Modal
                            isOpen={this.state.modalAbout}
                            toggle={this.toggleAbout}>
                            <ModalHeader toggle={this.toggleAbout}>
                                Edit Info
                            </ModalHeader>
                            <ModalBody>
                                <h3>About</h3>
                                <div className='form-group'>
                                    <textarea
                                        className='form-control'
                                        rows='4'
                                        ref={this.about}
                                        value={this.state.profile.description}
                                        onChange={(e) => {
                                            let profile = this.state.profile;
                                            profile.description =
                                                e.target.value;
                                            this.setState({
                                                profile: profile,
                                            });
                                        }}></textarea>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='primary' onClick={this.update}>
                                    Update
                                </Button>{" "}
                                <Button
                                    color='secondary'
                                    onClick={this.toggleAbout}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Modal>
                        <Modal
                            isOpen={this.state.modalDetail}
                            toggle={this.toggleDetail}>
                            <ModalHeader toggle={this.toggleDetail}>
                                Modal title
                            </ModalHeader>
                            <ModalBody>
                                <div className='form-group'>
                                    <div className='input-group my-1 row'>
                                        <h6 className='col-12'>Name</h6>
                                        <div className='col-6 px-0 pr-1'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='First Name'
                                                value={
                                                    this.state.profile.firstName
                                                }
                                                onChange={(e) => {
                                                    let profile = this.state
                                                        .profile;
                                                    profile.firstName =
                                                        e.target.value;
                                                    this.setState({
                                                        profile: profile,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className='col-6 px-0 pl-1'>
                                            <Input
                                                type='text'
                                                className='form-control '
                                                placeholder='Last Name'
                                                ref={this.lastName}
                                                value={
                                                    this.state.profile.lastName
                                                }
                                                onChange={(e) => {
                                                    let profile = this.state
                                                        .profile;
                                                    profile.lastName =
                                                        e.target.value;
                                                    this.setState({
                                                        profile: profile,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <h6 className='px-1'>Address</h6>
                                    <div className='form-group my-1 row'>
                                        <div className='col-2 col-form-label'>
                                            PIN
                                        </div>
                                        <input
                                            type='text'
                                            className='form-control col-10'
                                            value={`${
                                                this.state.profile.address &&
                                                this.state.profile.address.pin
                                            }`}
                                            onChange={(e) => {
                                                let profile = this.state
                                                    .profile;
                                                profile.address = {
                                                    ...profile.address,
                                                    pin: e.target.value,
                                                };
                                                this.setState({
                                                    profile: profile,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className='form-group my-1 row'>
                                        <div className='col-2 col-form-label'>
                                            City
                                        </div>
                                        <input
                                            type='text'
                                            className='form-control col-10'
                                            value={`${
                                                this.state.profile.address &&
                                                this.state.profile.address.city
                                            }`}
                                            onChange={(e) => {
                                                let profile = this.state
                                                    .profile;
                                                profile.address = {
                                                    ...profile.address,
                                                    city: e.target.value,
                                                };
                                                this.setState({
                                                    profile: profile,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className='form-group my-1 row'>
                                        <div className='col-2 col-form-label'>
                                            State
                                        </div>
                                        <input
                                            type='text'
                                            className='form-control col-10'
                                            value={`${
                                                this.state.profile.address &&
                                                this.state.profile.address.state
                                            }`}
                                            onChange={(e) => {
                                                let profile = this.state
                                                    .profile;
                                                profile.address = {
                                                    ...profile.address,
                                                    state: e.target.value,
                                                };
                                                this.setState({
                                                    profile: profile,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='primary' onClick={this.update}>
                                    Update
                                </Button>{" "}
                                <Button
                                    color='secondary'
                                    onClick={this.toggleDetail}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Modal>
                        <Modal
                            isOpen={this.state.modalExperience}
                            toggle={this.toggleExperience}>
                            <ModalHeader toggle={this.toggleExperience}>
                                <h5>Edit Experiences</h5>
                            </ModalHeader>
                            <ModalBody>
                                <div className='experience'>
                                    {this.state.profile.experience &&
                                        this.state.profile.experience.map(
                                            (data, i) => {
                                                return (
                                                    <div className='form-group'>
                                                        <h6>{data.title}</h6>
                                                        <div className='form-group my-1 row'>
                                                            <div className='col-2 col-form-label'>
                                                                Title
                                                            </div>
                                                            <input
                                                                type='text'
                                                                className='form-control col-10'
                                                                value={
                                                                    this.state
                                                                        .profile
                                                                        .experience[
                                                                        i
                                                                    ].title
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    let profile = this
                                                                        .state
                                                                        .profile;
                                                                    profile.experience[
                                                                        i
                                                                    ] = {
                                                                        ...profile
                                                                            .experience[
                                                                            i
                                                                        ],
                                                                        title:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    };
                                                                    this.setState(
                                                                        {
                                                                            profile: profile,
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                        </div>

                                                        <div className='form-group my-1 row'>
                                                            <div className='col-2 col-form-label'>
                                                                Line
                                                            </div>
                                                            <input
                                                                type='text'
                                                                className='form-control col-10'
                                                                value={
                                                                    this.state
                                                                        .profile
                                                                        .experience[
                                                                        i
                                                                    ].line
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    let profile = this
                                                                        .state
                                                                        .profile;
                                                                    profile.experience[
                                                                        i
                                                                    ] = {
                                                                        ...profile
                                                                            .experience[
                                                                            i
                                                                        ],
                                                                        line:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    };
                                                                    this.setState(
                                                                        {
                                                                            profile: profile,
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                        </div>

                                                        <div className='form-group my-1 row'>
                                                            <div className='col-2 col-form-label'>
                                                                Time
                                                            </div>
                                                            <input
                                                                type='text'
                                                                className='form-control col-10'
                                                                value={
                                                                    this.state
                                                                        .profile
                                                                        .experience[
                                                                        i
                                                                    ].time
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    let profile = this
                                                                        .state
                                                                        .profile;
                                                                    profile.experience[
                                                                        i
                                                                    ] = {
                                                                        ...profile
                                                                            .experience[
                                                                            i
                                                                        ],
                                                                        time:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    };
                                                                    this.setState(
                                                                        {
                                                                            profile: profile,
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                        <hr />
                                                    </div>
                                                );
                                            },
                                        )}
                                </div>

                                <div className='form-group'>
                                    <button
                                        className='btn btn-danger btn-sm m-2 float-right'
                                        style={{ borderRadius: "50%" }}
                                        onClick={() => {
                                            let pro = this.state.profile;
                                            pro.experience = [
                                                ...pro.experience,
                                                {
                                                    title: "",
                                                    time: "",
                                                    line: "",
                                                },
                                            ];
                                            this.setState({ profile: pro });
                                        }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='primary' onClick={this.update}>
                                    Update
                                </Button>{" "}
                                <Button
                                    color='secondary'
                                    onClick={this.toggleExperience}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </Modal>
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
