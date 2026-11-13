const { ObjectId } = require("mongodb");

// Converts an id into a MongoDB ObjectId so you can use it in queries.
// Returns an ObjectId, or null if the value isn't a valid id (so callers can 404)
const toObjectId = (id) => {
  if (id instanceof ObjectId) return id;
  return typeof id === "string" && ObjectId.isValid(id) ? new ObjectId(id) : null;
};

module.exports = { toObjectId };
