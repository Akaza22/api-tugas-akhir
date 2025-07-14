import { Request, Response } from 'express';
import { User, Role } from '../models';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { success, error } from '../utils/response';
import { controllerHandler } from '../utils/controllerHandler';

export const register = controllerHandler(async (req, res) => {
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

  res.status(201).json(success('User registered successfully', safeUser, 201));
});

export const login = controllerHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username }, include: [Role] });
  if (!user) {
    res.status(404).json(error('User not found', null, 404));
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json(error('Incorrect password', null, 401));
    return;
  }

  const token = generateToken({ id: user.id, role: user.role.name });

  const safeUser = {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    role: user.role.name
  };

  res.status(200).json(success('Login successful', { token, user: safeUser }));
});
