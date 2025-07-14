import app from './app';
import { sequelize } from './config/database';

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Connected to DB!');
    return sequelize.sync(); // atau sync({ force: true }) saat pertama
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
