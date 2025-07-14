import { UserSupervisor } from '../models';
import { users } from './seedUsers';

export const seedSupervisors = async () => {
  await UserSupervisor.bulkCreate([
    { employee_id: users.reporter1.id, supervisor_id: users.supervisor1.id, weight: 50 },
    { employee_id: users.reporter1.id, supervisor_id: users.supervisor2.id, weight: 50 },
    { employee_id: users.reporter2.id, supervisor_id: users.supervisor1.id, weight: 40 },
    { employee_id: users.reporter2.id, supervisor_id: users.supervisor2.id, weight: 30 },
    { employee_id: users.reporter2.id, supervisor_id: users.supervisor3.id, weight: 30 },
  ]);

  console.log('✅ Supervisors assigned');
};
