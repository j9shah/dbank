const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dbank', 'dbank_user', 'secure_password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
  define: {
    schema: 'public',
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.error('Database connection failed:', err));

module.exports = sequelize;