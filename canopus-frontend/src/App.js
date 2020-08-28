import React, { Component, createRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavbarComponent from "./components/navbar.component";
import FooterComponent from "./components/footer.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import SignupUser from "./components/signupuser.component";
// import doctor from "./images/doctor.png";
import JobSearch from "./components/jobSeach.component";
import Job from "./components/job.component";
import PostJob from "./components/postJob.component";
import Employer from "./components/employer.component";
import JobApplications from "./components/jobApplications.component";
import UpdateJob from "./components/updateJob.component";
import ErrorPage from "./components/error.component";
import SignupEmployer from "./components/signupEmployer.component";
import axios from "axios";
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
        this.setUser = this.setUser.bind(this);
        this.getUser = this.getUser.bind(this);
    }
    setUser(user) {
        this.setState({ user: user });
        // console.log(this.state.user);
    }
    async getUser() {
        axios
            .get(`/api/user/current`)
            .then((data) => {
                this.setUser(data.data.user);
            })
            .catch((err) => {
                console.log(err.response);
            });
    }
    componentDidMount() {
        console.log(this.state.user);
        if (!this.state.user) {
            this.getUser();
        }
        const node = this.wrapper.current;
        console.log(node);
    }
    wrapper = createRef();
    render() {
        return (
            <BrowserRouter
                className='flex flex-column justify-content-between'
                ref={this.wrapper}>
                <NavbarComponent
                    user={this.state.user}
                    setUser={this.setUser}
                    getUser={this.getUser}
                />
                <Switch>
                    <Route
                        exact
                        path='/'
                        render={(props) => <Home {...props} />}
                    />
                    <Route
                        exact
                        path='/search-jobs'
                        render={(props) => (
                            <JobSearch {...props} user={this.state.user} />
                        )}
                    />
                    <Route
                        exact
                        path='/user/signup'
                        component={() => <SignupUser />}
                    />
                    <Route
                        exact
                        path='/employer/signup'
                        component={() => <SignupEmployer />}
                    />
                    <Route
                        exact
                        path='/profile'
                        // render={(props) => <Profile {...props} />}
                        component={() => <Profile />}
                    />
                    <Route
                        exact
                        path='/profile/:id'
                        // render={(props) => <Profile {...props} />}
                        render={(props) => <Profile {...props} />}
                    />
                    <Route
                        exact
                        path='/job/:id'
                        // render={(props) => <Profile {...props} />}
                        render={(props) => <Job {...props} />}
                    />
                    {this.state.user && this.state.user.role === "Employer" && (
                        <Route
                            path='/employer/job/update/:id'
                            render={(props) => <UpdateJob {...props} />}
                        />
                    )}
                    <Route
                        exact
                        path='/employer'
                        // render={(props) => <Profile {...props} />}
                        component={() => <Employer />}
                    />

                    <Route
                        exact
                        path='/post'
                        // render={(props) => <Profile {...props} />}
                        component={() => <PostJob />}
                    />
                    <Route
                        exact
                        path='/applications'
                        // render={(props) => <Profile {...props} />}
                        component={() => <JobApplications />}
                    />
                    <Route component={() => <ErrorPage />} />
                </Switch>
                <FooterComponent />
            </BrowserRouter>
        );
    }
}

export default App;
