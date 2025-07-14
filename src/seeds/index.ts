import { sequelize } from '../config/database';
import { seedRoles } from './seedRoles';
import { seedUsers } from './seedUsers';
import { seedSupervisors } from './seedSupervisors';
import { seedNews } from './seedNews';
import { seedComments } from './seedComments';
import { seedApprovals } from './seedApproval';

(async () => {
  try {
    await sequelize.sync({ force: true }); // HATI-HATI: hapus semua data
    await seedRoles();
    await seedUsers();
    await seedSupervisors();
    await seedNews();
    await seedComments();
    await seedApprovals();
    console.log('🎉 All data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
})();
