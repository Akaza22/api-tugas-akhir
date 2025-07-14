import { User, Role } from '../models';
import bcrypt from 'bcrypt';

export let users: Record<string, any> = {};

export const seedUsers = async () => {
  const password = await bcrypt.hash('password123', 10);

  const [adminRole, reporterRole, supervisorRole] = await Promise.all([
    Role.findOne({ where: { name: 'admin' } }),
    Role.findOne({ where: { name: 'reporter' } }),
    Role.findOne({ where: { name: 'supervisor' } }),
  ]);

  users.admin = await User.create({ fullname: 'Admin', username: 'admin', email: 'admin@example.com', password, role_id: adminRole!.id });
  users.reporter1 = await User.create({ fullname: 'Reporter 1', username: 'reporter1', email: 'reporter1@example.com', password, role_id: reporterRole!.id });
  users.reporter2 = await User.create({ fullname: 'Reporter 2', username: 'reporter2', email: 'reporter2@example.com', password, role_id: reporterRole!.id });
  users.supervisor1 = await User.create({ fullname: 'Supervisor 1', username: 'supervisor1', email: 'sup1@example.com', password, role_id: supervisorRole!.id });
  users.supervisor2 = await User.create({ fullname: 'Supervisor 2', username: 'supervisor2', email: 'sup2@example.com', password, role_id: supervisorRole!.id });
  users.supervisor3 = await User.create({ fullname: 'Supervisor 3', username: 'supervisor3', email: 'sup3@example.com', password, role_id: supervisorRole!.id });

  console.log('✅ Users seeded');
};
