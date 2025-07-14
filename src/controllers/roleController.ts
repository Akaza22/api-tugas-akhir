import { Role } from '../models';
import { success, error } from '../utils/response';
import { controllerHandler } from '../utils/controllerHandler';

export const getRoles = controllerHandler(async (_req, res) => {
  const roles = await Role.findAll();
  res.status(200).json(success('List of roles', roles));
});

export const getRoleById = controllerHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    res.status(404).json(error('Role not found', null, 404));
    return;
  }
  res.json(success('Role found', role));
});

export const createRole = controllerHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json(error('Role name is required', null, 400));
    return;
  }

  const existing = await Role.findOne({ where: { name } });
  if (existing) {
    res.status(409).json(error('Role already exists', null, 409));
    return;
  }

  const role = await Role.create({ name });
  res.status(201).json(success('Role created successfully', role, 201));
});

export const updateRole = controllerHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    res.status(404).json(error('Role not found', null, 404));
    return;
  }
  await role.update({ name: req.body.name });
  res.json(success('Role updated', role));
});

export const deleteRole = controllerHandler(async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    res.status(404).json(error('Role not found', null, 404));
    return;
  }
  await role.destroy();
  res.json(success('Role deleted'));
});
