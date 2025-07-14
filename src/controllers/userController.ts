import { User, Role } from '../models';
import { success, error } from '../utils/response';
import bcrypt from 'bcrypt';
import { controllerHandler } from '../utils/controllerHandler';

export const getAllUsers = controllerHandler(async (_req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['password'] }, include: [Role] });
  res.status(200).json(success('User list retrieved', users));
});

export const getUserById = controllerHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] }, include: [Role] });
  if (!user) {
    res.status(404).json(error('User not found', null, 404));
    return;
  }
  res.json(success('User found', user));
});

export const createUser = controllerHandler(async (req, res) => {
  const { fullname, username, email, password, role_id } = req.body;

  const existing = await User.findOne({ where: { username } });
  if (existing) {
    res.status(409).json(error('Username already exists', null, 409));
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ fullname, username, email, password: hashed, role_id });

  const safeUser = {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email
  };

  res.status(201).json(success('User created', safeUser, 201));
});

export const updateUser = controllerHandler(async (req, res) => {
  const { fullname, username, email, role_id, password } = req.body;
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404).json(error('User not found', null, 404));
    return;
  }

  const updatedPassword = password ? await bcrypt.hash(password, 10) : user.password;

  await user.update({
    fullname: fullname ?? user.fullname,
    username: username ?? user.username,
    email: email ?? user.email,
    role_id: role_id ?? user.role_id,
    password: updatedPassword
  });

  res.json(success('User updated', {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email
  }));
});

export const deleteUser = controllerHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404).json(error('User not found', null, 404));
    return;
  }
  await user.destroy();
  res.json(success('User deleted'));
});
