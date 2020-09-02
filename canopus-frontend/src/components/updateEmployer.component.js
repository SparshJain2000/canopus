import React, { Component, Fragment } from "react";
import { Label, Input, FormGroup, Form, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faMinus,
    faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import InputMap from "./map.component";
import Axios from "axios";
import { BlobServiceClient } from "@azure/storage-blob";
import imageCompression from "browser-image-compression";

const block = {
    borderRadius: " 0.25rem",
    border: "0.05rem solid lightgrey",
    /* background-color: rgba(0, 0, 0, 0.15); */
    // boxShadow: " 3px 3px 6px rgba(0, 0, 0, 0.3)",
    transition: "0.3s ease-in-out",
};

export default class UpdateEmployer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            logo: "",
            lastName: "",
            password: "",
            email: "",
            line: "",
            pin: "",
            city: "",
            state: "",
            links: [""],
            youtube: [""],
            image: [],
            about: "",

            about2: "",
            employeeCount: 0,
            noLinks: 1,
            noYoutube: 1,
            lat: null,
            lng: null,
            imageLoading: false,
            _id: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.setCoordinates = this.setCoordinates.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.uploadLogo = this.uploadLogo.bind(this);
    }
    setCoordinates(coords) {
        this.setState({
            lat: coords.lat,
            lng: coords.lng,
        });
    }
    handleChange(e, index) {
        console.log(index);
        if (index !== undefined) {
            let links = this.state[e.target.name];
            links[index] = e.target.value;
            this.setState({
                [e.target.name]: links,
            });
        } else
            this.setState({
                [e.target.name]: e.target.value,
            });
    }
    update() {
        const employer = {
            logo: this.state.logo,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            image: this.state.image,
            links: this.state.links,
            youtube: this.state.youtube,
            address: {
                line: this.state.line,
                pin: this.state.pin,
                city: this.state.city,
                state: this.state.state,
                coordinates: { lat: this.state.lat, lng: this.state.lng },
            },
            description: {
                about: this.state.about,
            },
        };

        console.log(employer);
        Axios.put(`/api/employer/profile/update`, employer)
            .then((data) => {
                console.log(data);
                if (data.status === 200) {
                    alert("Update successful");
                    this.props.setUser(data.data);
                    // window.location = "/employer";
                }
            })
            .catch(({ response }) => alert(response.err));
    }
    componentDidMount() {
        Axios.get("/api/employer/profile")
            .then(({ data }) => {
                const user = data;
                console.log(user);
                if (user)
                    this.setState({
                        firstName: user.firstName,
                        logo: user.logo,
                        lastName: user.lastName,
                        links: user.links,
                        youtube: user.youtube,
                        image: user.image,
                        line: user.address.line,
                        pin: user.address.pin,
                        city: user.address.city,
                        state: user.address.state,
                        _id: user._id,
                        lat: user.address.coordinates.lat,
                        lng: user.address.coordinates.lng,

                        about: user.description.about,
                        about2: user.description.about2,
                    });
            })
            .catch((err) => console.log(err));
    }
    async uploadToStorage(storageAccountName, sas, file) {
        // console.log(file);
        try {
            const account = storageAccountName;
            // const sharedKeyCredential = new Credential(account, accountKey);
            const blobServiceClient = new BlobServiceClient(
                `https://${account}.blob.core.windows.net?${sas}`,
            );
            const containerClient = blobServiceClient.getContainerClient(
                "employer-image",
            );
            const blobClient = containerClient.getBlobClient(file.name);
            const blockBlobClient = blobClient.getBlockBlobClient();
            const uploadBlobResponse = await blockBlobClient.uploadBrowserData(
                file.data,

                {
                    onProgress: (state) => {
                        this.setState({
                            progress:
                                parseInt(state.loadedBytes) /
                                parseInt(file.size),
                        });
                        // console.log(this.state.progress);
                        // console.log(state);
                        // console.log(parseInt(file.size));
                    },
                },

                {
                    maxSingleShotSize: 4 * 1024 * 1024,
                },
                {
                    blobHTTPHeaders: {
                        contentSettings: {
                            contentType: file.mimeType,
                            //contentEncoding: 'base64'
                            blobContentType: file.mimeType,
                        },
                        // blobContentType: file.mimeType,
                    },
                },
            );
            console.log(uploadBlobResponse);
            return `https://canopus.blob.core.windows.net/employer-image/profile`;
        } catch (error) {
            console.error(error);
        }
    }

    uploadImage(e) {
        // console.log(this.image.current.value);
        const files = Array.from(e.target.files);
        if (files.length !== 0) {
            this.setState({ imageLoading: true });
            let profile = this.state.profile;
            const options = {
                maxSizeMB: 0.256, // (default: Number.POSITIVE_INFINITY)
                maxWidthOrHeight: 1920,
            };
            imageCompression(files[0], options).then((file) => {
                // console.log("compressedFile instanceof Blob", file instanceof Blob); // true
                console.log(`file size ${file.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                // await uploadToServer(file); // write your own logic
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    var matches = reader.result.match(
                        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
                    );
                    var buffer = new Buffer(matches[2], "base64");
                    const image = {
                        name: `${this.state._id}_${file.name}`,
                        data: buffer,
                        mimeType: file.type,
                    };
                    console.log(image);
                    Axios.post(`/api/upload/employer`, {
                        context: `${this.state._id}_${file.name}`,
                    })
                        .then(({ data }) => {
                            const sas = data.token;
                            this.uploadToStorage("canopus", sas, image).then(
                                (res) => {
                                    // console.log(res);
                                    // profile.image =
                                    const url = `https://canopus.blob.core.windows.net/employer-image/${this.state._id}_${file.name}`;

                                    let imgs = this.state.image;
                                    this.setState({
                                        image: [...imgs, url],
                                    });
                                    // console.log(profile);
                                    console.log(res);
                                    this.setState({
                                        profile: profile,
                                        // imageLoading: false,
                                    });
                                    // this.update();
                                },
                            );
                        })
                        .catch((e) => console.log(e));
                };
            });
        }
    }
    uploadLogo(e) {
        // console.log(this.image.current.value);
        const files = Array.from(e.target.files);
        if (files.length !== 0) {
            this.setState({ imageLoading: true });
            let profile = this.state.profile;
            const options = {
                maxSizeMB: 0.256, // (default: Number.POSITIVE_INFINITY)
                maxWidthOrHeight: 1920,
            };
            imageCompression(files[0], options).then((file) => {
                // console.log("compressedFile instanceof Blob", file instanceof Blob); // true
                console.log(`file size ${file.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                // await uploadToServer(file); // write your own logic
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    var matches = reader.result.match(
                        /^data:([A-Za-z-+\/]+);base64,(.+)$/,
                    );
                    var buffer = new Buffer(matches[2], "base64");
                    const image = {
                        name: `${this.state._id}_${file.name}`,
                        data: buffer,
                        mimeType: file.type,
                    };
                    console.log(image);
                    Axios.post(`/api/upload/employer`, {
                        context: `${this.state._id}_${file.name}`,
                    })
                        .then(({ data }) => {
                            const sas = data.token;
                            this.uploadToStorage("canopus", sas, image).then(
                                (res) => {
                                    const url = `https://canopus.blob.core.windows.net/employer-image/${this.state._id}_${file.name}`;
                                    this.setState({
                                        logo: url,
                                    });

                                    console.log(res);
                                    this.setState({
                                        profile: profile,
                                        // imageLoading: false,
                                    });
                                    // this.update();
                                },
                            );
                        })
                        .catch((e) => console.log(e));
                };
            });
        }
    }
    render() {
        return (
            <div className='my-2 mx-1 mx-lg-5 py-2 px-1 px-lg-5'>
                <div className=' p-4 my-3 mx-2 mx-lg-5' style={block}>
                    <FormGroup>
                        <h4>Details</h4>
                    </FormGroup>
                    <FormGroup className='row'>
                        <div className='col-12 col-sm-6 p-0 pr-0 pr-sm-1 my-1'>
                            <Label>First Name</Label>
                            <Input
                                placeholder='First Name'
                                name='firstName'
                                onChange={this.handleChange}
                                defaultValue={this.state.firstName}
                            />
                        </div>
                        <div className='col-12 col-sm-6 p-0 pl-0 pl-sm-1 my-1'>
                            {" "}
                            <Label>Last Name</Label>
                            <Input
                                placeholder='Last Name'
                                name='lastName'
                                onChange={this.handleChange}
                                defaultValue={this.state.lastName}
                            />
                        </div>
                        <div className='col-12 col-sm-6 p-0 pl-0 pl-sm-1 my-1'>
                            <Label>Logo</Label>
                            <input
                                type='file'
                                class='file'
                                // ref={this.image}
                                // accept='.pdf,.doc'
                                onChange={this.uploadLogo}
                            />
                        </div>
                    </FormGroup>
                </div>
                <div className='p-4 my-3 mx-2 mx-lg-5' style={block}>
                    {/* AIzaSyANIOnj2SfsuhCNZ9iqb4FMagPb7K_vdH0 */}
                    <FormGroup>
                        <h4>Address</h4>
                    </FormGroup>
                    <div className='row '>
                        <div className='col-12 col-lg-6 pr-2 d-flex flex-column '>
                            <FormGroup>
                                <Label>Line</Label>
                                <textarea
                                    placeholder='Address Line'
                                    name='line'
                                    className='form-control'
                                    rows='2'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.line}
                                />
                            </FormGroup>
                            <FormGroup className='row '>
                                <div className='col-12 col-sm-6 pr-0 pr-sm-1 mb-2 mb-sm-0'>
                                    <Label>PIN</Label>
                                    <Input
                                        placeholder='PIN'
                                        name='pin'
                                        onChange={this.handleChange}
                                        defaultValue={this.state.pin}
                                    />
                                </div>
                                <div className='col-12 col-sm-6 pl-0 pl-sm-1 mb-2 mb-sm-0'>
                                    <Label>City</Label>
                                    <Input
                                        placeholder='city'
                                        name='city'
                                        onChange={this.handleChange}
                                        defaultValue={this.state.city}
                                    />
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label>State</Label>
                                <Input
                                    placeholder='state'
                                    name='state'
                                    onChange={this.handleChange}
                                    defaultValue={this.state.state}
                                    // onChange={this.props.handleChange("email")}
                                    // defaultValue={values.email}
                                />
                            </FormGroup>
                            <FormGroup className='row '>
                                {/* <div className='col-12 col-sm-6 pr-1'>
                                    <Label>Latitude</Label>
                                    <Input
                                        placeholder='Latitude'
                                        name='lat'
                                        // onChange={this.handleChange}
                                        value={this.state.lat}
                                        disabled
                                    />
                                </div>
                                <div className='col-12 col-sm-6 pl-1'>
                                    <Label>Longitude</Label>
                                    <Input
                                        placeholder='longitude'
                                        name='lng'
                                        // onChange={this.handleChange}
                                        value={this.state.lng}
                                        disabled
                                    />
                                </div> */}
                            </FormGroup>
                        </div>

                        <div className='col-12 col-lg-6'>
                            <FormGroup className='img-thumbnail'>
                                {this.state.lat && (
                                    <InputMap
                                        setCoordinates={this.setCoordinates}
                                        coordinates={{
                                            lat: this.state.lat,
                                            lng: this.state.lng,
                                        }}
                                    />
                                )}
                                {!this.state.lat && (
                                    <InputMap
                                        setCoordinates={this.setCoordinates}
                                        coordinates={null}
                                    />
                                )}
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <div className='p-4 my-3 mx-2 mx-lg-5' style={block}>
                    <FormGroup>
                        <h4>About Organization</h4>
                    </FormGroup>
                    <FormGroup>
                        <Label className='row'>
                            <h5 className='col-9  col-sm-11 pl-0'>Links</h5>

                            <FontAwesomeIcon
                                icon={faPlusCircle}
                                size='lg'
                                onClick={() => {
                                    let links = this.state.links;
                                    links.push("");
                                    this.setState({
                                        links: links,
                                    });
                                }}
                                className='col-3 col-sm-1 text-info'
                                style={{ cursor: "pointer" }}
                            />
                        </Label>
                        {this.state.links.map((x, i) => (
                            <div className='my-1 row'>
                                <Input
                                    id={i}
                                    placeholder='Social Media Links'
                                    name='links'
                                    onChange={(e) => this.handleChange(e, i)}
                                    value={this.state.links[i]}
                                    className='col-9 col-sm-10 col-md-11'
                                />
                                <FontAwesomeIcon
                                    icon={faMinusCircle}
                                    className='text-danger my-auto col-3 col-sm-2 col-md-1'
                                    size='lg'
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        let links = this.state.links;
                                        links.splice(i, 1);
                                        this.setState({
                                            links: links,
                                        });
                                    }}
                                />
                            </div>
                        ))}
                        <hr />
                        <Label className='row mt-2'>
                            <h5 className='col-9 col-sm-11 pl-0'>
                                Youtube Links
                            </h5>
                            <FontAwesomeIcon
                                icon={faPlusCircle}
                                size='lg'
                                onClick={() => {
                                    let youtube = this.state.youtube;
                                    youtube.push("");
                                    this.setState({
                                        youtube: youtube,
                                    });
                                }}
                                className='col-3 col-sm-1 text-info'
                                style={{ cursor: "pointer" }}
                            />
                        </Label>
                        {this.state.youtube.map((x, i) => (
                            <div className='my-1 row'>
                                <Input
                                    id={i}
                                    placeholder='Youtube Links'
                                    name='youtube'
                                    onChange={(e) => this.handleChange(e, i)}
                                    value={this.state.youtube[i]}
                                    className='col-9 col-sm-10 col-md-11'
                                />
                                <FontAwesomeIcon
                                    icon={faMinusCircle}
                                    className='text-danger col-3 col-sm-2 col-md-1 my-auto'
                                    size='lg'
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        let youtube = this.state.youtube;
                                        youtube.splice(i, 1);
                                        this.setState({
                                            youtube: youtube,
                                        });
                                    }}
                                />
                            </div>
                        ))}
                        <hr />
                        <FormGroup>
                            <h5>About Organization</h5>
                            <textarea
                                name=''
                                className='form-control'
                                name='about'
                                defaultValue={this.state.about}
                                onChange={this.handleChange}
                                rows='4'
                                placeholder='About Organization'></textarea>
                        </FormGroup>
                    </FormGroup>
                </div>
                <div className='p-4 m-3 mx-lg-4 d-flex justify-content-end'>
                    <Button
                        onClick={this.update}
                        // className='w-25'
                        size='lg'
                        color='primary'>
                        Update
                    </Button>
                </div>
            </div>
        );
    }
}
