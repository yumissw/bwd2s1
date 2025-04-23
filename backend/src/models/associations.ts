import User from "./User";
import Event from "./Event";
import RefreshToken from "./RefreshToken";

function associationFunction() {
  Event.belongsTo(User, { foreignKey: "createdBy" });
  User.hasMany(Event, { foreignKey: "createdBy" });
  RefreshToken.belongsTo(User, { foreignKey: "userId" });
  User.hasMany(RefreshToken, { foreignKey: "userId" });
}

export { associationFunction };
