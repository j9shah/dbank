import { Sequelize } from 'sequelize';

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

sequelize
  .sync({ alter: true })
  .then(() => console.log('Database schema updated.'))
  .catch((err) => console.error('Schema update failed:', err));

export default sequelize;