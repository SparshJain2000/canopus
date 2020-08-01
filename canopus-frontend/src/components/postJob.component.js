import React, { Component, useRef } from "react";
import {
    Form,
    Label,
    FormGroup,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from "reactstrap";
import axios from "axios";
import Select from "react-select";
import data from "../data";

const incentivesArray = data.incentive.map((opt) => ({
    label: opt,
    value: opt,
}));
const typeArray = data.type.map((opt) => ({ label: opt, value: opt }));
const superSpecializationArray = data.superSpecialization.map((opt) => ({
    label: opt,
    value: opt,
}));
const locationArray = data.location.map((opt) => ({
    label: `${opt.name}, ${opt.state}`,
    value: `${opt.name}`,
}));
const experienceArray = data.experience.map((opt) => ({
    label: opt,
    value: opt,
}));

const PostJob = () => {
    const title = useRef(null);
    const profession = useRef(null);
    const specialization = useRef(null);
    const superSpecialization = useRef(null);
    const line = useRef(null);
    const experience = useRef(null);
    const incentives = useRef(null);
    const type = useRef(null);
    const location = useRef(null);
    const salary = useRef(null);
    const submit = () => {
        const job = {
            title: title.current.value,
            profession: profession.current.value,
            specialization: specialization.current.value,
            superSpecialization: superSpecialization.current.state.value.map(
                (obj) => obj.value,
            ),
            description: {
                line: line.current.value.trim(),
                experience: experience.current.state.value.value,
                incentives: incentives.current.state.value.map(
                    (obj) => obj.value,
                ),
                type: type.current.state.value.map((obj) => obj.value),
                location: location.current.state.value.value,
                salary: salary.current.value,
            },
        };
        axios
            .post(`/api/job`, job)
            .then((data) => {
                console.log(data);
                window.location = "/search-jobs";
            })
            .catch((err) => console.log(err));
        console.log(job);
    };
    return (
        <div>
            <Form className='border-block p-3 p-md-5 p-lg-5 mx-4 m-3'>
                <h2>Post a Job</h2>
                <FormGroup className='row p-2'>
                    <div className='col-12'>
                        <Label className='m-1'>
                            <h5>Title</h5>
                        </Label>
                        <input
                            placeholder='Title'
                            className='form-control'
                            ref={title}
                        />
                    </div>
                </FormGroup>
                <hr />
                <FormGroup className='row p-2'>
                    <div className='col-12 col-md-6 pr-md-2 my-1'>
                        {/* <Label>Profession</Label> */}
                        <input
                            className='form-control'
                            ref={profession}
                            placeholder='Profession'
                            list='professions'
                        />
                        <datalist id='professions'>
                            {data.professions.map((profession) => (
                                <option value={profession}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className='col-12 col-md-6 pl-md-2 my-1'>
                        {/* <Label>Specialization</Label> */}
                        <input
                            placeholder='Specialization'
                            ref={specialization}
                            list='specializations'
                            className='form-control'
                        />
                        <datalist id='specializations'>
                            {data.specializations.map((data) => (
                                <option value={data}></option>
                            ))}
                        </datalist>
                    </div>
                    <InputGroup className='col-12 my-1'>
                        <div style={{ width: `100%` }}>
                            <Select
                                isMulti
                                autosize={true}
                                placeholder='Super specialization'
                                options={superSpecializationArray}
                                ref={superSpecialization}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
                <hr />
                <FormGroup className='row p-2'>
                    <Label className='col-12 p-1'>
                        <h5>Description</h5>
                    </Label>

                    <InputGroup className='col-12 col-sm-6'>
                        <div style={{ width: `100%` }} className='m-1'>
                            <Select
                                autosize={true}
                                placeholder='Experience'
                                options={experienceArray}
                                // className='basic-multi-select'
                                // classNamePrefix='select'
                                ref={experience}
                            />
                        </div>
                    </InputGroup>

                    <InputGroup className='col-12 col-sm-6'>
                        <div style={{ width: `100%` }} className='m-1'>
                            <Select
                                isMulti
                                autosize={true}
                                placeholder='Type'
                                options={typeArray}
                                // className='basic-multi-select'
                                // classNamePrefix='select'
                                ref={type}
                            />
                        </div>
                    </InputGroup>
                    <InputGroup className='col-12 col-sm-6'>
                        <div style={{ width: `100%` }} className='m-1'>
                            <Select
                                autosize={true}
                                placeholder='Location'
                                options={locationArray}
                                // className='basic-multi-select'
                                // classNamePrefix='select'
                                ref={location}
                            />
                        </div>
                    </InputGroup>
                    <InputGroup className='col-12 col-sm-6'>
                        <InputGroup className='m-1'>
                            <input
                                placeholder='salary'
                                type='number'
                                className='form-control '
                                ref={salary}
                            />
                            <InputGroupAddon addonType='append'>
                                <InputGroupText>per annum</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    </InputGroup>
                    <InputGroup className='col-12'>
                        <div style={{ width: `100%` }} className='m-1'>
                            <Select
                                onChange={(opt) => console.log(opt)}
                                isMulti
                                autosize={true}
                                placeholder='Incentives'
                                options={incentivesArray}
                                // className='basic-multi-select'
                                // classNamePrefix='select'
                                ref={incentives}
                            />
                        </div>
                    </InputGroup>
                    <InputGroup className='col-12'>
                        <textarea
                            placeholder='Description ..'
                            ref={line}
                            className='form-control m-1'
                        />
                    </InputGroup>
                </FormGroup>
                <FormGroup className='ml-auto mr-1'>
                    <Button onClick={submit} className='ml-1' color='primary'>
                        Post
                    </Button>
                </FormGroup>
            </Form>
        </div>
    );
};
export default PostJob;
