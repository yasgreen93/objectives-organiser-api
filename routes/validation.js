const schema = require('validate');

const objectiveDataSchema = schema({
  title: {
    type: 'string',
    required: true,
    message: '"title" is missing or needs to be a string',
  },
  type: {
    type: 'string',
    required: true,
    message: '"type" is missing or needs to be a string',
  },
  totalPagesVideos: {
    type: 'number',
    required: true,
    message: '"totalPagesVideos" is missing or needs to be a number',
  },
  timeAllocated: {
    type: 'string',
    required: true,
    message: '"timeAllocated" is missing or needs to be a string',
  },
});

const updateDataSchema = schema({
  title: {
    type: 'string',
    required: false,
    message: '"title" needs to be in a string format',
  },
  type: {
    type: 'string',
    required: false,
    message: '"type" needs to be in a string format',
  },
  totalPagesVideos: {
    type: 'number',
    required: false,
    message: '"totalPagesVideos" needs to be in a number format',
  },
  timeAllocated: {
    type: 'string',
    required: false,
    message: '"timeAllocated" needs to be in a string format',
  },
});

const progressUpdateSchema = schema({
  objectiveId: {
    type: 'number',
    required: true,
    message: '"objectiveId" is missing or needs to be a number',
  },
  pageVideoNumReached: {
    type: 'number',
    required: true,
    message: '"pageVideoNumReached" is missing or needs to be a number',
  },
  learningSummary: {
    type: 'string',
    required: true,
    message: '"learningSummary" is missing or needs to be a string',
  },
});

const updateProgressUpdateSchema = schema({
  pageVideoNumReached: {
    type: 'number',
    required: false,
    message: '"pageVideoNumReached" needs to be in a number format',
  },
  learningSummary: {
    type: 'string',
    required: false,
    message: '"learningSummary" needs to be in a string format',
  },
});

function validateData(dataValues, schemaType) {
  let isValid = true;
  let errorMessage = null;
  const validatedData = schemaType.validate(dataValues)[0];
  if (validatedData) {
    isValid = false;
    errorMessage = validatedData.message;
  }
  return { isValid, errorMessage };
}

module.exports = {
  validateData,
  updateDataSchema,
  updateProgressUpdateSchema,
  objectiveDataSchema,
  progressUpdateSchema,
};
