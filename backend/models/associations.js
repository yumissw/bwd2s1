   // associations.js
   const { User } = require('./User');
   const { Event } = require('./Event');

   Event.belongsTo(User, { foreignKey: 'createdBy' });
   User.hasMany(Event, { foreignKey: 'createdBy' });

   module.exports = { associate: () => {} }; // Export a dummy object for now
