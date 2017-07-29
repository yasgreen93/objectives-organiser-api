## Objectives Organiser RESTful API

* `npm i` to install modules
* `npm start` to start the server - port is 3000.
* `npm test` to run mocha unit tests. The server needs to be running in another terminal tab.

Runs two `postgres` databases:
* `objectives-organiser_development`
* `objectives-organiser_test`  
With the tables:
* `Objective`
* `ProgressUpdate`

Tests use `objectives-organiser_test` database and clears and creates a new table each time.

----

### Endpoints:


#### Objectives:
* `POST /objectives` - create objective with the data:
  * `title`
  * `type`
  * `totalPagesVideos`
  * `timeAllocated`


* `GET /objectives` - read all objectives


* `GET /objectives/{id}` - read single objective with:
  * `id`

**These endpoints will be edited to be RESTful:**
* `POST /edit-objective` - edit objective with any of:
  * `title`
  * `type`
  * `totalPagesVideos`
  * `timeAllocated`


* `POST /delete-objective` - delete objective with:
  * `id`


#### Progress updates:
* `POST /create-progress-update` - create progress update for single objective:
  * `objectiveId`
  * `pageVideoNumReached`
  * `learningSummary`


* `GET /read-progress-updates` - read progress updates for single objective:
  * `objectiveId`


* `GET /read-all-progress-updates` - read all progress updates
