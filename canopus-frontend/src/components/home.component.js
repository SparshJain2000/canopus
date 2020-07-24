import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarComponent from "./navbar.component";
import FooterComponent from "./footer.component";
import doctor from "../images/doctor.png";
function Home() {
    return (
        <div>
            <div className='flex flex-column justify-content-between main-container'>
                <NavbarComponent />
                <div
                    className='main py-5 '
                    style={{ height: "100%", flexGrow: 1 }}>
                    <h1 className='text-white' style={{ textAlign: "center" }}>
                        New Provider Jobs Added Every Day
                    </h1>
                    <div
                        className='form-inline row justify-content-center mt-5'
                        style={{
                            marginLeft: "15vw",
                            width: "70vw",
                        }}>
                        <input
                            className='form-control mr-sm-2 col-8'
                            type='search'
                            placeholder='Search a Profession'
                            aria-label='Search'
                            style={{
                                fontSize:
                                    " calc(12px + (26 - 14) * ((100vw - 300px) / (1600 - 300)))",
                            }}
                            // ref={this.textInput}
                        />
                        <button
                            className='col-3 btn btn-warning my-2 my-sm-0'
                            type='submit'>
                            <span
                                style={{
                                    fontSize:
                                        " calc(12px + (26 - 14) * ((100vw - 300px) / (1600 - 300)))",
                                }}>
                                Search
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div
                className='p-3 p-md-5  '
                style={{ backgroundColor: "#ededed" }}>
                <h1 style={{ textAlign: "center" }}>Jobs by Category</h1>
                <div className='row justify-content-center px-3 px-md-4 m-4 '>
                    <div className='jobs text-secondary'>
                        <a href='#'>Physician / Surgeon</a>
                    </div>
                    <div className='jobs text-secondary'>
                        <a href='#'>Nurse Practitioner</a>
                    </div>
                    <div className='jobs text-secondary'>
                        <a href='#'>Physician Assistant</a>
                    </div>
                    <div className='jobs text-secondary'>
                        <a href='#'>Certified Registered Nurse</a>
                    </div>
                    <div className='jobs text-secondary'>
                        <a href='#'>Anesthetist (CRNA)</a>
                    </div>
                    <div className='jobs text-secondary'>
                        <a href='#'>Academics / Research</a>
                    </div>
                </div>
            </div>
            <div className='p-3 p-md-5 row w-100 mx-auto justify-content-center'>
                <img
                    src={doctor}
                    alt='doctor'
                    className='col-md-4 col-12 img-fluid mx-auto'
                    style={{ maxWidth: "300px" }}
                />
                <div
                    className='p-1 p-lg-5 col-md-8 col-12 my-auto flex flex-column align-content-center'
                    style={{ textAlign: "center" }}>
                    <h1>
                        Apply for Positions + Set Up Job Alerts + Get
                        Newsletters
                    </h1>
                    <button
                        className='btn btn-lg btn-outline-info mt-3'
                        // type='submit'
                        // onClick={this.search}
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
