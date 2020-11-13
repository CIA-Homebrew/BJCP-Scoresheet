module.exports = {
  development: {
    smtp: {
      user: "",
      password: "",
      host: "",
      tls: true, // we use TLS to be compatible, can be changed to SSL if able
      ssl: false,
      port: 587,
      from: "no-reply@bjcp-scroresheet",
    },
  },
  production: {
    smtp: {
      user: "",
      password: "",
      host: "",
      tls: true, // we use TLS to be compatible, can be changed to SSL if able
      ssl: false,
      port: 587,
      from: "no-reply@bjcp-scroresheet",
    },
  },
};
