import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route } from "react-router-dom";
// import NavbarComponent from "./components/navbar.component";
import FooterComponent from "./components/footer.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
// import doctor from "./images/doctor.png";
import JobSearch from "./components/jobSeach.component";
function App() {
    return (
        <div className='flex flex-column justify-content-between'>
            <BrowserRouter>
                <Route path='/' exact component={() => <Home />} />
                <Route path='/search-jobs' component={() => <JobSearch />} />
                <Route
                    path='/profile/:id'
                    render={(props) => <Profile {...props} />}
                />
                <FooterComponent />
            </BrowserRouter>
        </div>
    );
}

export default App;
