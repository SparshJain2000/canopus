import React, { Component } from "react";
import { Link } from "react-router-dom";
import job from "../images/job.png";
import applicants from "../images/profile.png";
import bg1 from "../images/bg1.jpg";
import bg2 from "../images/bg4.jpg";

import { Button } from "reactstrap";

export default class Employer extends Component {
    render() {
        return (
            <div className='row align-content-center' style={{ margin: "0" }}>
                <div
                    className='col-12 col-lg-6 py-5 p-2'
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),url(${bg1})`,
                        backgroundAttachment: "contain",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}>
                    <div className='col-12 ' style={{ textAlign: "center" }}>
                        <img
                            src={job}
                            className='img-fluid'
                            alt=''
                            style={{ maxWidth: "300px" }}
                        />
                    </div>
                    <div
                        className='col-12 mt-3'
                        style={{ textAlign: "center" }}>
                        <h1>Post a job</h1>
                        <Link to='/post'>
                            <Button outline='true' color='info'>
                                Post
                            </Button>
                        </Link>
                    </div>
                </div>
                <div
                    className='col-12 col-lg-6 py-5 p-2'
                    style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),url(${bg2})`,
                        backgroundAttachment: "contain",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}>
                    <div className='col-12 ' style={{ textAlign: "center" }}>
                        <img
                            src={applicants}
                            className='img-fluid'
                            alt=''
                            style={{ maxWidth: "300px" }}
                        />
                    </div>
                    <div
                        className='col-12 mt-3'
                        style={{ textAlign: "center" }}>
                        <h1>View job applicants</h1>
                        <Link to='/post'>
                            <Button outline='true' color='primary'>
                                View
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
