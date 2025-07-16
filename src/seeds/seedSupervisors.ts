import { UserSupervisor } from '../models';
import { users } from './seedUsers';

export const seedSupervisors = async () => {
  await UserSupervisor.bulkCreate([
    {
      employee_id: users.reporter1.id,
      supervisor_id: users.supervisor1.id,
      weight: 60,
      priority_order: 1
    },
    {
      employee_id: users.reporter1.id,
      supervisor_id: users.supervisor2.id,
      weight: 40,
      priority_order: 2
    },
    {
      employee_id: users.reporter2.id,
      supervisor_id: users.supervisor2.id,
      weight: 50,
      priority_order: 1
    },
    {
      employee_id: users.reporter2.id,
      supervisor_id: users.supervisor3.id,
      weight: 50,
      priority_order: 2
    }
  ]);

  console.log('✅ Supervisors seeded');
};
