const ContactUs = require("../models/contactModel");
var { ObjectID } = require("mongodb");
const multiparty = require("multiparty");
const nodemailer = require("nodemailer")
const smtpTransport = require("nodemailer-smtp-transport");

exports.create = (req, res) => {
  var contact_us = new ContactUs({
    email: req.body.email,
    message: req.body.message,
    name: req.body.name,
    phone: req.body.phone,
    website: req.body.website
  });
  contact_us.save().then((docs) => {
      var transporter = nodemailer.createTransport(smtpTransport({
      host: process.env.MAIL_HOST,
      secureConnection: false,
      tls: {
        rejectUnauthorized: false
      },
      port: process.env.MAIL_PORT,
      auth: {
          user: process.env.AUTH_USER_INFO,
          pass: process.env.AUTH_PASS_INFO,
    }
  }));

    var mailOptions = {
      from: docs.email,
      to: process.env.AUTH_USER_INFO,
      subject: "Inquery",
      text:
        "Name:-" +
        docs.name +
        "\n Email:- " +
        docs.email +
        "\n Message:-" +
        docs.message +
        "\n Phone No:-" +
        docs.phone +
        "\n Website" +
        docs.website,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).json({message: "Email not sent"});
      } else {
        res.status(200).json({message: "Email sent successfully"});
      }
    });
  });
  var nodemailer = require("nodemailer");
};

exports.findAll = (req, res) => {
  ContactUs.find().then(
    (contactUs) => {
      res.status(200).send(contactUs);
    },
    (e) => {
      res.status(400).send({
        message: "No Contact record Found.......",
      });
    }
  );
};

exports.findOne = (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      
    });
  }
  ContactUs.findById(id)
    .then((contactUs) => {
      if (!contactUs) {
        return res.status(404).send({
          message: "No Contact record Found.",
        });
      }
      res.status(200).send(contactUs);
    })
    .catch((e) => {
      res.status(400).send({
        message: "No Contact record Found.......",
      });
    });
};

exports.update = (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).json({message : "Requested Contact not Found"});
  }
  ContactUs.findByIdAndUpdate(
    id,
    {
      message: req.body.message,
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
       website: req.body.website
    },
    { new: true }
  )
    .then((contactUs) => {
        if (!contactUs) {
        return res.status(404).send('Error :' +e);
      }
      res.status(200).send({
        message: "your data successfully updated....",
        data: contactUs,
      });
    })
    .catch((e) => {
      res.status(400).send('Error :' +e);
    });
};

exports.delete = (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "No Contact record Found For Delete",
    });
  }
  ContactUs.findByIdAndRemove(id)
    .then((contactUs) => {
      if (!contactUs) {
        return res.status(404).send({
          message: "No Contact record Found For Delete",
        });
      }
      res.status(200).send({ message: "data deleted successfully..." });
    })
    .catch((e) => {
      res.status(400).send("Error :" +e);
    });
};
