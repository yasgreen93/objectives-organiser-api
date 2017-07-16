const schema = require('validate');

const objectiveSchema = schema({
  title: {
    type: 'string',
    required: true,
    message: '"title" is missing or needs to be a string'
  },
  type: {
    type: 'string',
    required: true,
    message: '"type" is missing or needs to be a string'
  },
  totalPagesVideos: {
    type: 'number',
    required: true,
    message: '"totalPagesVideos" is missing or needs to be a number'
  },
  timeAllocated: {
    type: 'string',
    required: true,
    message: '"timeAllocated" is missing or needs to be a string'
  },
});

function validateObjectiveData(objective) {
  let isValid = true;
  let errorMessage = null;
  const validatedData = objectiveSchema.validate(objective)[0];
  if (validatedData) {
    isValid = false;
    errorMessage = validatedData.message;
  }
  return { isValid, errorMessage };
}

module.exports.validateObjectiveData = validateObjectiveData;
