import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route } from "react-router-dom";
import NavbarComponent from "./components/navbar.component";
import FooterComponent from "./components/footer.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import SignupUser from "./components/signupuser.component";
// import doctor from "./images/doctor.png";
import JobSearch from "./components/jobSeach.component";
import PostJob from "./components/postJob.component";
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
        console.log(this.state.user);
    }
    async getUser() {
        axios
            .get(`/api/user/current`)
            .then(({ data }) => {
                console.log(data);
                this.setUser(data.user);
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        // const user = await axios.get(`/api/user/current`);
        // console.log(user);
        // return user;
    }
    componentDidMount() {
        console.log(this.state.user);
        if (!this.state.user) {
            // this.getUser();
        }
    }
    render() {
        return (
            <BrowserRouter className='flex flex-column justify-content-between'>
                <NavbarComponent
                    user={this.state.user}
                    setUser={this.setUser}
                    getUser={this.getUser}
                />
                <Route path='/' exact component={() => <Home />} />
                <Route
                    path='/search-jobs'
                    exact
                    component={() => <JobSearch />}
                />
                <Route
                    path='/user/signup'
                    exact
                    component={() => <SignupUser />}
                />
                <Route
                    path='/profile'
                    exact
                    // render={(props) => <Profile {...props} />}
                    component={() => <Profile />}
                />
                <Route
                    path='/post'
                    exact
                    // render={(props) => <Profile {...props} />}
                    component={() => <PostJob />}
                />

                <FooterComponent />
            </BrowserRouter>
        );
    }
}

export default App;
