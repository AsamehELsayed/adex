import sequelize from '../lib/db.js';
import Contact from './Contact';
import Service from './Service';
import Content from './Content';
import User from './User';

// Initialize all models
const models = {
  Contact,
  Service,
  Content,
  User,
  sequelize,
};

// Export models
export default models;
export { Contact, Service, Content, User };

