require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "curoid.co";
const api = process.env.MG_API;
const mg = mailgun({ apiKey: api, domain: DOMAIN });
const mailController = {};

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
async function attachDay(req, user, job) {
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: req.body.username,
    subject: "New Day Job",
    template: "attach_day",
    "h:X-Mailgun-Variables": JSON.stringify({
      title: "test",
      first_name: "test_first_name",
      organization: "test_organization",
      title: "test_title",
      procedure_name: "test_procedure_name",
      location: "test_location",
      start_time: "test_start_time",
      end_time: "test_end_time",
      link: "test_link",
    }),
  };
  mg.messages().send(data, function (error, body) {
    if (error) return error;
    else return body;
  });
}
async function attachLocum(req, user, job) {
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: req.body.username,
    subject: "New Day Job",
    template: "attach_locum",
    "h:X-Mailgun-Variables": JSON.stringify({
      title: "test",
      first_name: "test_first_name",
      organization: "test_organization",
      title: "test_title",
      procedure_name: "test_procedure_name",
      location: "test_location",
      start_date: "test_start_date",
      end_date: "test_end_date",
      link: "test_link",
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

async function acceptApplicantDay(req, user, job) {
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: req.body.username,
    subject: "<Institute Name> has confirmed your position",
    template: "accept_day",
    "h:X-Mailgun-Variables": JSON.stringify({
      title: "test",
      name: "test",
      profile_title: "test",
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
async function acceptApplicantLocum(req, user, job) {
  console.log(new Intl.DateTimeFormat("en-US").format(date));
  const data = {
    from: "Curoid.co <no-reply@curoid.co>",
    to: req.body.username,
    subject: "<Institute Name> has confirmed your position",
    template: "accept_locum",
    "h:X-Mailgun-Variables": JSON.stringify({
      title: "test",
      name: "test",
      profile_title: "test",
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
