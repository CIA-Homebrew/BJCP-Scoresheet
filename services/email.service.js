const nodemailer = require("nodemailer");
const debug = require("debug")("bjcp-scoresheet:email.service");

class EmailService {
  constructor() {
    if (process.env.NODE_ENV !== "development") {
      (this.host = process.env.EMAIL_HOST),
        (this.port = process.env.EMAIL_PORT);
      this.secure = process.env.EMAIL_SECURE;
      this.user = process.env.EMAIL_USER;
      this.pass = process.env.EMAIL_PASSWORD;
    } else {
      this.testEnv = true;
    }

    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    const testAccount =
      process.env.NODE_ENV === "development"
        ? await nodemailer.createTestAccount()
        : null;

    this.transporter = nodemailer.createTransport({
      host: this.host || "smtp.ethereal.email",
      port: this.port || 587,
      secure: this.secure || false,
      auth: {
        user: this.user || testAccount.user,
        pass: this.pass || testAccount.pass,
      },
    });

    await this.transporter.verify().catch((err) => {
      debug(err);
    });

    this.initialized = true;
  }

  async waitForInitialization() {
    while (!this.initialized) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return true;
  }

  async verifyUser(user) {
    await this.waitForInitialization();
  }

  async passwordResetUser(user) {
    await this.waitForInitialization();
  }

  async sendTestMail(recipient) {
    await this.waitForInitialization();

    const mailInfo = await this.transporter.sendMail({
      from: `"BJCP Scoresheets" <${this.user}>`,
      to: recipient,
      subject: "Test mail",
      text: "Hello there",
    });

    if (this.testEnv) {
      console.log(
        "Mail sent. View message here:",
        nodemailer.getTestMessageUrl(mailInfo)
      );
    }
  }
}

const Email_Service = new EmailService();

module.exports = Email_Service;
