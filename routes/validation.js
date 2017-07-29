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

function validateData(objective, schemaType) {
  let isValid = true;
  let errorMessage = null;
  const validatedData = schemaType.validate(objective)[0];
  if (validatedData) {
    isValid = false;
    errorMessage = validatedData.message;
  }
  return { isValid, errorMessage };
}

module.exports = {
  validateData,
  updateDataSchema,
  objectiveDataSchema,
};
