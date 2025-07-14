import { Role } from '../models';

export const seedRoles = async () => {
  const roles = ['admin', 'reporter', 'supervisor'];
  for (const name of roles) {
    await Role.findOrCreate({ where: { name } });
  }
  console.log('✅ Roles seeded');
};
