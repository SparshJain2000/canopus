import React, { Component, useRef } from "react";
import { Form, Label, FormGroup, Button, InputGroup } from "reactstrap";
import axios from "axios";
const professions = [
    "Physician",
    "Surgeon",
    "Dentist",
    "Nurse",
    "Therapist",
    "Technicians",
    "Pharmacist",
    "Medical Translator",
];
const specializations = [
    "Anaesthesiology",
    "Ear, Nose and Throat",
    "Biochemistry",
    "General Surgery",
    "Anatomy",
    "Community Health",
    "Ophthalmology",
    "Dermatology",
];
const PostJob = () => {
    const title = useRef(null);
    const profession = useRef(null);
    const specialization = useRef(null);
    const line = useRef(null);
    const experience = useRef(null);
    const incentives = useRef(null);
    const type = useRef(null);
    const location = useRef(null);
    const salary = useRef(null);
    const submit = () => {
        const job = {
            title: title.current.value,
            profession: [profession.current.value],
            specialization: [specialization.current.value],
            description: {
                line: line.current.value,
                experience: experience.current.value,
                incentives: incentives.current.value,
                type: type.current.value,
                location: location.current.value,
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
                <h3>Post a Job</h3>
                <FormGroup className='row p-2'>
                    <Label>Title</Label>
                    <input
                        placeholder='Title'
                        className='form-control'
                        ref={title}
                    />
                </FormGroup>
                <FormGroup className='row p-2'>
                    <div className='col-12 col-md-6 pr-2'>
                        <Label>Profession</Label>
                        <input
                            className='form-control'
                            ref={profession}
                            placeholder='Profession'
                            list='professions'
                        />
                        <datalist id='professions'>
                            {professions.map((profession) => (
                                <option value={profession}></option>
                            ))}
                        </datalist>
                    </div>
                    <div className='col-12 col-md-6 pl-2'>
                        <Label>Specialization</Label>
                        <input
                            placeholder='Specialization'
                            ref={specialization}
                            list='specializations'
                            className='form-control'
                        />
                        <datalist id='specializations'>
                            {specializations.map((data) => (
                                <option value={data}></option>
                            ))}
                        </datalist>
                    </div>
                </FormGroup>
                <FormGroup className='row p-2'>
                    <Label className='col-12'>Description</Label>
                    <InputGroup className='col-6'>
                        <input
                            placeholder='line'
                            ref={line}
                            className='form-control m-1'
                        />
                    </InputGroup>
                    <InputGroup className='col-6'>
                        <input
                            placeholder='experience'
                            className='form-control m-1'
                            ref={experience}
                        />
                    </InputGroup>
                    <InputGroup className='col-6'>
                        <input
                            placeholder='incentives'
                            className='form-control m-1'
                            ref={incentives}
                        />
                    </InputGroup>
                    <InputGroup className='col-6'>
                        <input
                            placeholder='type'
                            className='form-control m-1'
                            ref={type}
                        />
                    </InputGroup>
                    <InputGroup className='col-6'>
                        <input
                            placeholder='location'
                            className='form-control m-1'
                            ref={location}
                        />
                    </InputGroup>
                    <InputGroup className='col-6'>
                        <input
                            placeholder='salary'
                            type='number'
                            className='form-control m-1'
                            ref={salary}
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
