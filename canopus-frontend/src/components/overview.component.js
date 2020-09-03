import React, { Component } from "react";
import Axios from "axios";
import hospital from "../images/hospital.svg";
import { Table } from "reactstrap";
import ReactPlayer from "react-player";
import ShowMap from "./showMap.component";
import ImageCarousel from "./imageCarousel.component";
import VideoCarousel from "./videoCarousel.component";

const block = {
    borderRadius: " 0.25rem",
    border: "0.05rem solid #eeeeee",
    /* background-color: rgba(0, 0, 0, 0.15); */
    boxShadow: " 2px 2px 3px rgba(0, 0, 0, 0.1)",
    transition: "0.3s ease-in-out",
};
export default class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employer: null,
        };
    }
    componentDidMount() {
        Axios.get("/api/employer/profile")
            .then(({ data }) => {
                console.log(data);
                this.setState({ employer: data });
            })
            .catch(({ response }) => console.log(response));
    }
    render() {
        return (
            <div>
                {this.state.employer && (
                    <div className='d-flex flex-column-reverse flex-sm-row'>
                        <div className='col-12  col-sm-7 col-md-8  py-3'>
                            <div className='row m-2'>
                                <div className='col-12 col-md-3 col-lg-2 px-5 px-sm-0 text-align-center'>
                                    <img
                                        src={
                                            this.state.employer.logo
                                                ? this.state.employer.logo
                                                : hospital
                                        }
                                        alt=''
                                        className='img-fluid img-thumbnail'
                                    />
                                </div>
                                <div
                                    className='col-12 col-md-9 col-lg-10 px-3 px-md-5 my-3 my-md-auto'
                                    style={{ maxHeight: "max-content" }}>
                                    <h3>
                                        {this.state.employer.description &&
                                        this.state.employer.description
                                            .organization
                                            ? this.state.employer.description
                                                  .organization
                                            : this.state.employer.firstName}
                                    </h3>
                                    <h6>
                                        {`${
                                            this.state.employer.description.type
                                                ? this.state.employer
                                                      .description.type
                                                : "type"
                                        } - ${
                                            this.state.employer.description &&
                                            this.state.employer.description
                                                .employeeCount
                                                ? this.state.employer
                                                      .description.employeeCount
                                                : 0
                                        } employees`}
                                    </h6>
                                    <h6>
                                        {this.state.employer.speciality
                                            ? this.state.employer.speciality
                                            : "Speciality"}
                                    </h6>
                                </div>
                            </div>
                            <div className='row p-3 m-2' style={block}>
                                <h4>About</h4>
                                <p>
                                    {this.state.employer.description &&
                                        this.state.employer.description.about}
                                </p>
                            </div>
                            <div className='row p-3 m-2' style={block}>
                                <div className='col-4 text-align-center'>
                                    <h5>Beds</h5>
                                    {this.state.employer.description &&
                                    this.state.employer.description.beds
                                        ? this.state.employer.description.beds
                                        : "-"}
                                </div>
                                <div className='col-4 text-align-center'>
                                    <h5>ICUs</h5>
                                    {this.state.employer.description &&
                                    this.state.employer.description.ICUs
                                        ? this.state.employer.description.ICUs
                                        : "-"}
                                </div>
                                <div className='col-4 text-align-center'>
                                    <h5>OTs</h5>
                                    {this.state.employer.description &&
                                    this.state.employer.description.OTs
                                        ? this.state.employer.description.OTs
                                        : "-"}
                                </div>
                            </div>
                            <div className='row p-3 m-2' style={block}>
                                <h4 className='col-12'>Location</h4>
                                <p className='col-12'>
                                    {this.state.employer.address.line}
                                </p>
                                <p className='col-12'>{`${this.state.employer.address.city}, ${this.state.employer.address.state}, ${this.state.employer.address.pin}`}</p>
                                <div className='col-12'>
                                    {this.state.employer.address
                                        .coordinates && (
                                        <ShowMap
                                            coordinates={
                                                this.state.employer.address
                                                    .coordinates
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {this.state.employer.image.length !== 0 && (
                                <div className='row p-3 m-2' style={block}>
                                    <h4>Images</h4>
                                    <ImageCarousel
                                        style={{ minHeight: "360px" }}
                                        items={this.state.employer.image}
                                    />
                                </div>
                            )}
                            {this.state.employer.youtube && (
                                <div className='row p-3 m-2' style={block}>
                                    <h4>Videos</h4>

                                    <VideoCarousel
                                        className='w-100'
                                        items={this.state.employer.youtube}
                                    />
                                    {/* <ReactPlayer
                                        className='w-100'
                                        url='https://www.youtube.com/watch?v=b_lHyhTRb-8&list=RDv2-9rIL_f4w&index=34'
                                    /> */}
                                </div>
                            )}
                        </div>
                        <div
                            className='col-12 col-sm-5 col-md-4  row p-3 pt-4'
                            style={{ borderLeft: "1px solid #dddddd" }}>
                            <div
                                className='col-12'
                                style={{ height: "max-content" }}>
                                <Table size='sm' hover className='col-12'>
                                    <thead>
                                        <tr>
                                            <th>Jobs</th>
                                            <th>Open</th>
                                            <th>Closed</th>
                                            <th>Available</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope='row'>Normal</th>
                                            <td>
                                                {this.state.employer.jobtier &&
                                                    this.state.employer.jobtier
                                                        .posted}
                                            </td>
                                            <td>
                                                {this.state.employer.jobtier &&
                                                    this.state.employer.jobtier
                                                        .closed}
                                            </td>
                                            <td>
                                                {this.state.employer.jobtier &&
                                                    this.state.employer.jobtier
                                                        .allowed -
                                                        this.state.employer
                                                            .jobtier.posted}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='row'>Day Jobs</th>
                                            <td>
                                                {this.state.employer
                                                    .freelancetier &&
                                                    this.state.employer
                                                        .freelancetier.posted}
                                            </td>
                                            <td>
                                                {this.state.employer
                                                    .freelancetier &&
                                                    this.state.employer
                                                        .freelancetier.closed}
                                            </td>
                                            <td>
                                                {this.state.employer
                                                    .freelancetier &&
                                                    this.state.employer
                                                        .freelancetier.allowed -
                                                        this.state.employer
                                                            .freelancetier
                                                            .posted}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='row'>Locum Position</th>
                                            <td>
                                                {this.state.employer.locumtier
                                                    ? this.state.employer
                                                          .locumtier.posted
                                                    : 0}
                                            </td>
                                            <td>
                                                {this.state.employer.locumtier
                                                    ? this.state.employer
                                                          .locumtier.closed
                                                    : 0}
                                            </td>
                                            <td>
                                                {this.state.employer.locumtier
                                                    ? this.state.employer
                                                          .locumtier.allowed -
                                                      this.state.employer
                                                          .locumtier.posted
                                                    : "-"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope='row'>Sponsored</th>
                                            <td>
                                                {this.state.employer.sponsors
                                                    ? this.state.employer
                                                          .sponsors
                                                    : "-"}
                                            </td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <hr />
                                <div className='text-align-center col-12'>
                                    <h6>
                                        Please contact +91-xxxxxxxxx for pricing
                                        information or purchasing more job slots
                                    </h6>
                                </div>
                            </div>
                            {/* <hr /> */}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
