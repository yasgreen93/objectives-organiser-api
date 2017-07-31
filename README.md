## Objectives Organiser RESTful API

* `npm i` to install modules
* `npm start` to start the server - port is 3000.
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

*All fields are required and validated. If one or more is missing or of an incorrect format it will throw a 400 error, for example:* `ERROR 400: "..." is missing or needs to be a ...`

---

* `GET /objectives` - read all objectives

*If no objectives exists it should send a 404 error:* `ERROR 404: No objectives have been found`

---

* `GET /objectives/:id` - read single objective with:
  * `id`

*If successful it returns JSON of the data.*

*If no objectives exists it should send a 404 error:* `ERROR 404: An objective with the ID: # has not been found`

---

* `PATCH /objectives/:id` - edit objective with any of:
  * `title`
  * `type`
  * `totalPagesVideos`
  * `timeAllocated`

*If successful it returns JSON of the updated data.*

*All fields are validated. If one or more of an incorrect format it will throw a 400 error, for example:* `ERROR 400: "..." needs to be in a ... format`

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

*All fields are required and validated. If one or more is missing or of an incorrect format it will throw a 400 error message, for example:* `ERROR 400: "..." is missing or needs to be a ...`

---

* `GET /objectives/:id/progress-updates` - read progress updates for single objective:
  * `objectiveId`

*If successful it returns JSON of the data.*
*If unsuccessful it returns a 404 with the error message:* `ERROR 404: No progress updates for the objective (#) have been found.`

---
***The last two will be updated when implemented:***
* `GET /objectives/:id/progress-updates/:id` - read a single progress update for a single objective:
  * `objectiveId`,
  * `progressUpdateId`

---

* `GET /objectives/progress-updates` - read all progress updates for all objectives.
