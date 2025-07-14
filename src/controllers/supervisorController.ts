import { Request, Response } from 'express';
import { controllerHandler } from '../utils/controllerHandler';
import { UserSupervisor, User } from '../models';
import { success, error } from '../utils/response';

export const getSupervisorsByEmployee = controllerHandler(async (req, res) => {
  const employee_id = parseInt(req.params.employee_id);

  const relations = await UserSupervisor.findAll({
    where: { employee_id },
    include: [
      {
        model: User,
        as: 'supervisor',
        attributes: ['id', 'fullname', 'username', 'email']
      }
    ]
  });

  res.json(success('Supervisor list retrieved', relations));
});

export const createSupervisorRelation = controllerHandler(async (req, res) => {
  const { employee_id, supervisor_id, weight } = req.body;

  if (!employee_id || !supervisor_id || !weight) {
    res.status(400).json(error('Missing required fields', null, 400));
    return;
  }

  const existing = await UserSupervisor.findOne({
    where: { employee_id, supervisor_id }
  });

  if (existing) {
    res.status(409).json(error('Relation already exists', null, 409));
    return;
  }

  const relation = await UserSupervisor.create({ employee_id, supervisor_id, weight });
  res.status(201).json(success('Supervisor relation created', relation, 201));
});

export const updateSupervisorWeight = controllerHandler(async (req, res) => {
  const relation = await UserSupervisor.findByPk(req.params.id);
  if (!relation) {
    res.status(404).json(error('Relation not found', null, 404));
    return;
  }

  const { weight } = req.body;
  if (!weight || weight < 1 || weight > 100) {
    res.status(400).json(error('Weight must be between 1 and 100', null, 400));
    return;
  }

  await relation.update({ weight });
  res.json(success('Weight updated', relation));
});

export const deleteSupervisorRelation = controllerHandler(async (req, res) => {
  const relation = await UserSupervisor.findByPk(req.params.id);
  if (!relation) {
    res.status(404).json(error('Relation not found', null, 404));
    return;
  }

  await relation.destroy();
  res.json(success('Supervisor relation deleted'));
});
