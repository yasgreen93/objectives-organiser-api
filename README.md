## Objectives Organiser RESTful API

[Waffle Board!](https://waffle.io/yasgreen93/objectives-organiser-api/join)

* `npm i` to install modules
* `npm start` to start the server - port is 8080.
* `npm test` to run mocha unit tests.
* `npm run test:watch` to run `--watch` on the tests.
* To run test coverage locally: `npm run test:coverage`.
  * Latest test coverage can be found at `./coverage/lcov-report/index.html`.

Runs two `postgres` databases:
* `objectives-organiser_development`
* `objectives-organiser_test`  
With the tables:
* `Objective`
* `ProgressUpdate`

Tests use `objectives-organiser_test` database and clears and creates a new table each time.

### Endpoints:


#### Objectives:
* `POST /objectives` - create objective with the data:
  * `title`
  * `type`
  * `totalPagesVideos`
  * `timeAllocated`

*If successful it returns JSON of the data added into the DB.*

*All fields are required and validated. If one or more is missing or of an incorrect format it will throw a 400 and return an array of errors.*

---

* `GET /objectives` - read all objectives

---

* `GET /objectives/:id` - read single objective with:
  * `id`

---

* `PATCH /objectives/:id` - edit objective with any of:
  * `title`
  * `type`
  * `totalPagesVideos`
  * `timeAllocated`

*If successful it returns JSON of the updated data.*

*If the objective being updated does not exist it returns a 404 with:* `ERROR 404: An objective with the ID of # does not exist`

*All fields are required and validated. If one or more is missing or of an incorrect format it will throw a 400 and return an array of errors.*

---

* `DELETE /objectives/:id` - delete objective with:
  * `id`

*If successful it returns a confirmation message.*

*If unsuccessful it returns a 404 error, for example:* `ERROR 404: An objective with the ID: # has not been found`

---

#### Progress updates:
* `POST /objectives/:id/progress-updates` - create progress update for single objective:
  * `objectiveId`
  * `pageVideoNumReached`
  * `learningSummary`

*If successful it returns JSON of the data added into the DB.*

*All fields are required and validated. If one or more is missing or of an incorrect format it will throw a 400 and return an array of errors.*

---

* `GET /objectives/:id/progress-updates` - read progress updates for single objective:
  * `objectiveId`

---
* `GET /progress-updates/:id` - read a single progress update for a single objective:
  * `progressUpdateId`

---

* `GET /progress-updates` - read all progress updates for all objectives.

---

* `PATCH /progress-updates/:id` - edit progress update with any of:
  * `pageVideoNumReached`
  * `learningSummary`

*N.B. the objectiveID of a progress update can not be edited once created.*

*If successful it returns JSON of the updated data.*

*If the progress update being updated does not exist it returns a 404 with:* `ERROR 404: A progress update with the ID of # does not exist`

*All fields are required and validated. If one or more is missing or of an incorrect format it will throw a 400 and return an array of errors.*

---

* `DELETE /progress-updates/:id` - delete progress update with:
  * `id`

*If successful it returns a confirmation message.*

*If unsuccessful it returns a 404 error, for example:* `ERROR 404: A progress update with the ID: # has not been found`

---

#### Users:
* `POST /users/register` - create a new user:
  * `firstName`
  * `lastName`
  * `emailAddress`
  * `emailAddressConfirmation`
  * `password`
  * `passwordConfirmation`

*If successful it returns JSON of the data added into the DB.*

*All fields are required and validated.*

*If one or more is missing it will throw a 400 error message, for example:* `"..." is required`

*If the emailAddress and emailAddressConfirmation or password and passwordConfirmation it will throw a 400 error message, for example:* `"..." do not match`

*If the emailAddress is not a valid email it will throw a 400 error message:* `Email is not valid`.
