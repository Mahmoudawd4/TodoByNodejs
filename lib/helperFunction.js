// const asyncWrapper = (fn) => (req, res, next) =>Promise.resolve(fn(req, res, next)).catch(next);

// module.exports = asyncWrapper;

const asycnWrapper = (promise) => promise
  .then((data) => ([undefined, data]))
  .catch((err) => ([err]));

module.exports = asycnWrapper;
