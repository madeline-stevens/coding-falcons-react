//this file is to create a global method that I can reuse (trying to minimize the number of libraries I use) for checking if fields are blank/null, object, string, etc. because we can't use the Validator isEmpty method because it only checks for empty strings. but our errors variable (in register.js file) is an object.

const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

module.exports = isEmpty; //export this method so we can use it in other files

// function isEmpty(value) {
//   return (
//     value === endefined ||
//     value === null ||
//     (typeof value === "object" && object.keys(value).length === 0) ||
//     (typeof value === "string" && value.trim().length === 0)
//   );
// }
