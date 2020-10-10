require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "curoid.co";
const api = process.env.MG_API;
const mg = mailgun({ apiKey: api, domain: DOMAIN });
const mailController = {};

//date time format
var date_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',timeZone:"Asia/Kolkata" };
var time_options = { hour: 'numeric', minute: 'numeric',timeZone: 'Asia/Kolkata' };

async function forgotMail(req, user, token, context) {
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: req.body.username,
    subject: "Reset Password",
    template: "forgot_password",
    "h:X-Mailgun-Variables": JSON.stringify({
      link: `http://${req.headers.host}/${context}/forgot/${token}`,
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}

async function validateMail(req, user, token, context) {
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: req.user.username,
    subject: "Confirm Your Email",
    template: "validate_name",
    "h:X-Mailgun-Variables": JSON.stringify({
      link: `http://${req.headers.host}/${context}/validate/${token}`,
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}
async function welcomeMail(req, employer) {
    const data = {
      from: "Curoid.co <no-reply@curoid.co>",
      to: employer.username,
      subject: "Welcome to Curoid!",
      template: "welcome_employer",
      "h:X-Mailgun-Variables": JSON.stringify({
        first_name: employer.firstName,
      }),
    };
    mg.messages().send(data, function (error, body) {
      if (error) return error;
      else return body;
    });
  }
async function attachDay(applicant,employer,job) {

  let start_hour = new Intl.DateTimeFormat('en-US', time_options).format(new Date(job.startDate));
  let end_hour = new Intl.DateTimeFormat('en-US', time_options).format(new Date(job.endDate));
  let date = new Intl.DateTimeFormat('en-US',date_options).format(new Date(job.endDate));
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: applicant.username,
    subject: "New Day Job",
    template: "attach_day",
    "h:X-Mailgun-Variables": JSON.stringify({
      first_name: applicant.name,
      organization: employer.description.organization,
      title: job.title,
      procedure_name: job.description.procedure,
      location: job.description.location,
      start_time: `${start_hour}`,
      end_time: `${end_hour} ${date}`,
      link: `www.curoid.co/job/${job._id}?freelance&employer`
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}
async function attachLocum(applicant,employer,job) {
    let start_date = new Intl.DateTimeFormat('en-US', date_options).format(new Date(job.startDate));
  let end_date = new Intl.DateTimeFormat('en-US',date_options).format(new Date(job.endDate));
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: applicant.username,
    subject: "New Locum Position",
    template: "attach_locum",
    "h:X-Mailgun-Variables": JSON.stringify({
        first_name: applicant.name,
        organization: employer.description.organization,
        title: job.title,
        procedure_name: job.description.procedure,
        location: job.description.location,
      start_date: `${start_date}`,
      end_date: `${end_date}`,
      link: `www.curoid.co/job/${job._id}?freelance&employer`,
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}


//TODO
async function newApplicantMail(req, user, job) {
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: job.author.username,
    subject: "New Job Application",
    template: "new_applicant",
    "h:X-Mailgun-Variables": JSON.stringify({
      title: job.title,
      name:`${user.salutation} ${user.firstName} ${user.lastName}`,
      profile_title: user.title,
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}

async function jobPost(req, user, job) {
    let category = "freelance";
    if(job.category==="Full-time"|| job.category==="Part-time")
    category="job";
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: user.username,
    subject: "Job Posted Successfully",
    template: "job_post",
    "h:X-Mailgun-Variables": JSON.stringify({
      title: job.title,
      link: `https://www.curoid.co/job/${job._id}?${category}&employer`,
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}

async function acceptApplicantDay(applicant,employer,job) {
    let start_hour = new Intl.DateTimeFormat('en-US', time_options).format(new Date(job.startDate));
    let end_hour = new Intl.DateTimeFormat('en-US', time_options).format(new Date(job.endDate));
    let date = new Intl.DateTimeFormat('en-US',date_options).format(new Date(job.endDate));
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: applicant.username,
    subject: `${employer.description.organization} has confirmed your position`,
    template: "accept_day",
    "h:X-Mailgun-Variables": JSON.stringify({
        first_name: applicant.name,
        organization: employer.description.organization,
        title: job.title,
        procedure_name: job.description.procedure,
        location: job.description.location,
        start_time: `${start_hour}`,
        end_time: `${end_hour} ${date}`,
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}
let json = {
  first_name: "test_first_name",
  organization: "test_organization",
  title: "test_title",
  procedure_name: "test_procedure_name",
  location: "test_location",
  start_time: "test_start_time",
  end_time: "test_end_time",
};
async function acceptApplicantLocum(applicant,employer,job) {
  
    let start_date = new Intl.DateTimeFormat('en-US', date_options).format(new Date(job.startDate));
  let end_date = new Intl.DateTimeFormat('en-US',date_options).format(new Date(job.endDate));
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: applicant.username,
    subject:  `${employer.description.organization} has confirmed your position`,
    template: "accept_locum",
    "h:X-Mailgun-Variables": JSON.stringify({
        first_name: applicant.name,
        organization: employer.description.organization,
        title: job.title,
        procedure_name: job.description.procedure,
        location: job.description.location,
      start_date: `${start_date}`,
      end_date: `${end_date}`,
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}

exports.mailController = {
  forgotMail,
  validateMail,
  welcomeMail,
  attachLocum,
  attachDay,
  acceptApplicantDay,
  acceptApplicantLocum,
  jobPost,
  newApplicantMail,
};
