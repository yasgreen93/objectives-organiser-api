/* eslint-disable newline-per-chained-call */
const objectiveSchemaErrors = {
  titleRequired: 'title is required',
  titleFormat: 'title needs to be a string',
  typeRequired: 'type is required',
  typeFormat: 'type needs to be a string',
  totalPagesVideosRequired: 'totalPagesVideos is required',
  totalPagesVideosFormat: 'totalPagesVideos needs to be a number',
  timeAllocatedRequired: 'timeAllocated is required',
  timeAllocatedFormat: 'timeAllocated needs to be a string',
};

const progressUpdateSchemaErrors = {
  objectiveIdRequired: 'objectiveId is required',
  objectiveIdFormat: 'objectiveId needs to be a number',
  pageVideoNumReachedRequired: 'pageVideoNumReached is required',
  pageVideoNumReachedFormat: 'pageVideoNumReached needs to be a number',
  learningSummaryRequired: 'learningSummary is required',
  learningSummaryFormat: 'learningSummary needs to be a string',
};

const userSchemaErrors = {
  firstNameRequired: 'First name is required',
  lastNameRequired: 'Last name is required',
  emailDefault: 'Invalid email',
  emailRequired: 'An email address is required',
  emailInvalid: 'Email is not valid',
  emailConfirmationDefault: 'Invalid email confirmation',
  emailConfirmationRequired: 'Email confirmation is required',
  emailsMisMatch: 'Emails do not match',
  passwordRequired: 'Password is required',
  passwordConfirmationDefault: 'Invalid password confirmation',
  passwordConfirmationRequired: 'Password confirmation is required',
  passwordsMisMatch: 'Passwords do not match',
};

function validateNewObjectiveData(req) {
  req.checkBody('title', objectiveSchemaErrors.titleRequired).notEmpty();
  req.checkBody('title', objectiveSchemaErrors.titleFormat).isString();
  req.checkBody('type', objectiveSchemaErrors.typeRequired).notEmpty();
  req.checkBody('type', objectiveSchemaErrors.typeFormat).isString();
  req.checkBody('totalPagesVideos', objectiveSchemaErrors.totalPagesVideosRequired).notEmpty();
  req.checkBody('totalPagesVideos', objectiveSchemaErrors.totalPagesVideosFormat).isInt();
  req.checkBody('timeAllocated', objectiveSchemaErrors.timeAllocatedRequired).notEmpty();
  req.checkBody('timeAllocated', objectiveSchemaErrors.timeAllocatedFormat).isString();
  return req.getValidationResult();
}

function validateUpdateObjectiveData(req) {
  req.checkBody('title', objectiveSchemaErrors.titleFormat).optional().isString();
  req.checkBody('type', objectiveSchemaErrors.typeFormat).optional().isString();
  req.checkBody('totalPagesVideos', objectiveSchemaErrors.totalPagesVideosFormat).optional().isInt();
  req.checkBody('timeAllocated', objectiveSchemaErrors.timeAllocatedFormat).optional().isString();
  return req.getValidationResult();
}

function validateNewProgressUpdateData(req) {
  req.checkBody('objectiveId', progressUpdateSchemaErrors.objectiveIdRequired).notEmpty();
  req.checkBody('objectiveId', progressUpdateSchemaErrors.objectiveIdFormat).isInt();
  req.checkBody('pageVideoNumReached', progressUpdateSchemaErrors.pageVideoNumReachedRequired).notEmpty();
  req.checkBody('pageVideoNumReached', progressUpdateSchemaErrors.pageVideoNumReachedFormat).isInt();
  req.checkBody('learningSummary', progressUpdateSchemaErrors.learningSummaryRequired).notEmpty();
  req.checkBody('learningSummary', progressUpdateSchemaErrors.learningSummaryFormat).isString();
  return req.getValidationResult();
}

function validateUpdateProgressUpdateData(req) {
  req.checkBody('pageVideoNumReached', progressUpdateSchemaErrors.pageVideoNumReachedFormat).optional().isInt();
  req.checkBody('learningSummary', progressUpdateSchemaErrors.learningSummaryFormat).optional().isString();
  return req.getValidationResult();
}

function validateUserRegistrationData(req, { emailAddress, password }) {
  req.checkBody('firstName', userSchemaErrors.firstNameRequired).notEmpty();
  req.checkBody('lastName', userSchemaErrors.lastNameRequired).notEmpty();
  req.checkBody('emailAddress', userSchemaErrors.emailDefault)
    .notEmpty().withMessage(userSchemaErrors.emailRequired)
    .isEmail().withMessage(userSchemaErrors.emailInvalid);
  req.checkBody('emailAddressConfirmation', userSchemaErrors.emailConfirmationDefault)
    .notEmpty().withMessage(userSchemaErrors.emailConfirmationRequired)
    .equals(emailAddress).withMessage(userSchemaErrors.emailsMisMatch);
  req.checkBody('password', userSchemaErrors.passwordRequired).notEmpty();
  req.checkBody('passwordConfirmation', userSchemaErrors.passwordConfirmationDefault)
    .notEmpty().withMessage(userSchemaErrors.passwordConfirmationRequired)
    .equals(password).withMessage(userSchemaErrors.passwordsMisMatch);
  return req.getValidationResult();
}

module.exports = {
  validateUserRegistrationData,
  validateNewObjectiveData,
  validateUpdateObjectiveData,
  validateNewProgressUpdateData,
  validateUpdateProgressUpdateData,
};
