// associations.js
const { User } = require("./User");
const { Event } = require("./Event");
const { RefreshToken } = require("./RefreshToken");

Event.belongsTo(User, { foreignKey: "createdBy" });
User.hasMany(Event, { foreignKey: "createdBy" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });
User.hasMany(RefreshToken, { foreignKey: "userId" });

module.exports = { associate: () => {} }; // Export a dummy object for now
