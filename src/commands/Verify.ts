import {removeVerificationData, verificationDataStore} from "../Listener";

import {
  Discord,
  Command,
  CommandMessage,
  CommandNotFound
} from "@typeit/discord";

import * as crypto from "crypto";

import * as EmailValidator from 'email-validator';

import {Transporter} from "nodemailer";
import * as nodeMailer from "nodemailer";

@Discord("!")
abstract class Verify {

  transporter: Transporter;

  protected constructor() {
    this.transporter = nodeMailer.createTransport( {
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      }
    });
  }

  @Command("verify :email")
  private hello(message: CommandMessage) {
    let email: string = message.args.email;
    if(!EmailValidator.validate(email) || !email.toLowerCase().endsWith("@wcupa.edu")) {
      message.channel.send("Invalid WCU email, please try again!").then(_ => {});
      return;
    }

    let token: string = crypto.randomBytes(48).toString("hex");
    verificationDataStore.push({token: token, userId: message.author.id});

    // Schedule to invalidate verification data.
    setTimeout(() => {
      removeVerificationData(token);
    }, parseInt(process.env.INVALIDATE_TIME || "5")*60*1000);

    if(message.channel.type == "text")
      message.delete().then(_ => {});

    message.channel.send(`Please check ${message.args.email} for a verification link and click it within ${process.env.INVALIDATE_TIME} minutes!`).then(_ => {});

    this.transporter.sendMail({
      from: '"wcu-cs-club" <wcucompsciclub@gmail.com>',
      to: `${email}`,
      subject: "Verify WCU Status",
      text: `Open link  to verify: ${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}/verify?token=${token}`,
      html: `<a href="${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}/verify?token=${token}">Click here to verify!</a>`, // plain text body
    }).then(_ => {
    }).catch(err => {
      console.log("Failed to send verification email.")
      console.log(err);
    });
  }

  @CommandNotFound()
  private notFound(message: CommandMessage) {
  }
}