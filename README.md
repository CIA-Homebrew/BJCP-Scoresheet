<img src="https://github.com/CIA-Homebrew/BJCP-Scoresheet/blob/master/public/images/app-logo.png?raw=true" height="100">

#### A Digital Homebrewing Competition Scoresheet Managment System

[Play in the sandbox! Demo available here](https://bjcp-scoresheets.herokuapp.com/)

This application is a full stack competition scoresheet generation and management system designed for [BJCP sanctioned competitions](https://www.bjcp.org/compcenter.php).

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Discord](https://img.shields.io/discord/776887453264379915?color=%237289da&label=discord&logo=discord)](https://discord.com/channels/776887453264379915/)
[![GitHub last commit](https://img.shields.io/github/last-commit/CIA-Homebrew/BJCP-Scoresheet.svg)](https://github.com/CIA-Homebrew/BJCP-Scoresheet)

<!--
[![Dependencies](https://david-dm.org/CIA-Homebrew/BJCP-Scoresheet.svg)](https://david-dm.org/cia-homebrew/BJCP-scoresheet)
-->

### Purpose

This application is catered toward the flight-based judging session; two or more judges simultaneously evaluating a flight of entries sequentially while filling out scoresheets for each.

Historically, competition judging with paper scoresheets has been a chore - manual scanning and upload of hundreds of scoresheets typically postponed entrants from receiving their feedback for days, and terrible handwriting sometimes made that feedback worthless altogether! On top of that, judges are not always well-versed in all of the BJCP styles and sometimes develop "writer's block" when it comes to descriptors, leading to somewhat bland feedback. This application seeks to address all of those problems:

1. Judges fill out scoresheets electronically, so handwriting is not an issue
2. Judges have access to sliders to help more accurately provide sensory description without requiring lengthy descriptions
3. Judges can easily see BJCP style guidelines for each section, allowing accurate judgement based on style
4. Scoresheets are digitally created and collated, allowing quick redistribution to contestants immediatly after competition results are announced

### Who Uses It?

[<img src="https://github.com/CIA-Homebrew/BJCP-Scoresheet/blob/master/public/images/page-logos/club-logo.png?raw=true" width="100" height="100">](https://opferm.cialers.org)

## Basic Interface and Use

<details>
<summary>User Account Creation</summary>

- New users accounts can be created by navigating to the app home page and clicking the "Register" link in the navbar
</details>

<details>
<summary>Flight Creation</summary>

- Logged in users can create new flights by clicking the "Add Flight" button on the main screen.
  - Users judging the same flight should enter the same flight number, which should be provided by the competition coordinator
  - It is recommended that users judge flights simultaneously
- Flights cannot be deleted once they have been created
</details>

<details>
<summary>Scoresheet Creation</summary>

- Once a flight has been created, users may add scoresheets to their flight by clicking the "Add Scoresheet" button
- **Entry Number is must be populated for the scoresheet to be saved**
- Users may use the tabs to navigate between various scoresheet sections
  - Flight posision auto-increments as scoresheets are added, however this may be overwritten
  - Once the style and substyle is populated (e.g. "9" and "C"), helpful tooltips on each page will show the BJCP guidelines for the selected style
  - Total score is automatically recalculated when section scores are changed
  - For first round judging, users may select round advancing entries by clicking the "Mini BOS Advance" button at the top of the scoresheet page
  - For final round judging, users may select placed entries by selecting a place option from the dropdown at the top of the scoresheet page
  - If two or more users judging the same entry have different scores, a consensus score may be agreed upon and entered at the top of the page. This score will supercede all judges' scores.
- Once the user has completed filling out the scoresheet, they can return to the flights page by clicking "Back to My Flights"
  - Scoresheets are automatically saved after any change
  </details>

<details>
<summary>Flight Submission</summary>

- Once users have completed scoresheets for all entries in a flight and assigned placement / advancement / consensus scores, the flight may be submitted
- **Once a flight has been submitted, it cannot be undone by the user**
  - Admins may undo flight submissions through the admin panel
  </details>

<details>
<summary>Scoresheet PDF Generation</summary>

- Scoresheets can be downloaded by the user that created the scoresheet in the "Completed Flights" section
- Scoresheet pdf downloads are only available for entries in completed flights
- All scoresheets in a flight may be downloaded by clicking the "Download All" button
- It is recommended to download all completed scoresheets to the user's local device after completion for data redundancy
</details>

<details>
<summary>Admin Panel</summary>

- Coming soon!
</details>

## Instructions and Guides

<details>
<summary>Development Environment Setup Instructions</summary>

Setting up a development enviroment is relatively easy and only requires node and npm to be set up.

1. Clone the repository to your development machine and run `npm install`
2. Persistent storage management is handled through Sequelize
   - Development environent uses SQLite, which does not require additional database dependency installation
   - **(optional)** Staging environment requires PostgreSQL
     1. Ensure PostgreSQL is installed and running
     2. Create a new database with the name `bjcp-scoresheet`
     3. Create a user with username `user` and password `password` with read/write privileges enabled
   - Run all database migrations by by running `npm run migrate`
   - **(optional)** Create a development admin account by running `npm run seed`
     - Default username is `admin@scoresheets.org`, default password is `password`
     - Standard accounts can be upgraded to admin level accounts by manually writing a query to update the `user_level` db field to a value greater than 0
3. Start development server by running `npm run debug`
   - **(optional)** Start staging server by running `npm run staging`
4. App can be viewed at [http://localhost:3000](http://localhost:3000)
</details>

<details>
<summary>Deployment Instructions</summary>

The easiest way to deploy the application is via the pre-built docker container alongside a Postgres deployment. 

[This script](https://github.com/CIA-Homebrew/BJCP-Scoresheet/blob/master/droplet-setup.sh) can be used as a starting point to deploy BJCP-Scoresheets in a web VM (such as a Digital Ocean Droplet).

The following environmental variables will need to be passed into the `bjcp-scoresheets` container at runtime:

* `DOMAIN` - the domain at which the BJCP Scoresheets instance will be hosted. Example: `scoresheets.domain.com`
* `ADMIN_EMAIL` - the email of a user that will have admin access in the instance by default. Example: `some_admin_user@gmail.com`
* `EMAIL_HOST` - URL of email service provider. Used for account validation and password resets. Example: `emailserver.host.com`
* `EMAIL_PORT` - The port `EMAIL_HOST` connects on (usually `465`)
* `EMAIL_SECURE` - Boolean if SSL is enabled on `EMAIL_HOST` (usually `true`)
* `EMAIL_USER` - Email account used to send emails on `EMAIL_HOST`
* `EMAIL_PASSWORD` - The password for `EMAIL_USER`
* `DATABASE_URL` - Postgres Database connection string for scoresheets database. Example: `postgres://ADMIN_USER:ADMIN_PASSWORD@DATABSE_IP:5432/postgres`

</details>

<details>
<summary>Major Dependencies</summary>

- [archiver](https://www.npmjs.com/package/archiver) - used to zip scoresheet .pdf files together when user requests more than one download
- [express](https://www.npmjs.com/package/express) - framework used for webserver functionality on back end
- [passport](https://www.npmjs.com/package/passport) - framework used for secure authentication and session management
- [sequelize](https://www.npmjs.com/package/sequelize) - ORM used for multi-paradigm persistent storage
- [pg](https://www.npmjs.com/package/pg) - Posgres framework for NodeJS
- [sqlite3](https://www.npmjs.com/package/sqlite3) - Sqlite framework for NodeJS
- [puppeteer](https://www.npmjs.com/package/puppeteer) - utilized in headless configuration to generate .pdf scoresheets from html/css templates
- [prettier](https://www.npmjs.com/package/prettier) - automatic pre commit linting and code format
</details>

## Support

Issues and feature requests are handled through the project [issues management tab](https://github.com/CIA-Homebrew/BJCP-Scoresheet/issues)

## License

[GNU General Public License v3.0](https://github.com/CIA-Homebrew/BJCP-Scoresheet/blob/master/LICENSE)
