import { Request, Response } from 'express';
import { User } from '../models';
import { controllerHandler } from '../utils/controllerHandler';
import { success, error } from '../utils/response';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export const getProfile = controllerHandler(async (req, res) => {
  const user = await User.findByPk(req.user!.id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    res.status(404).json(error('User not found', null, 404));
    return;
  }

  res.json(success('Profile retrieved', user));
});

export const updateProfile = controllerHandler(async (req, res) => {
  const { fullname, email } = req.body;

  const user = await User.findByPk(req.user!.id);
  if (!user) {
    res.status(404).json(error('User not found', null, 404));
    return;
  }

  await user.update({
    fullname: fullname ?? user.fullname,
    email: email ?? user.email
  });

  res.json(success('Profile updated', {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email
  }));
});

export const changePassword = controllerHandler(async (req, res) => {
  const { old_password, new_password } = req.body;
  const user = await User.findByPk(req.user!.id);

  if (!user) {
    res.status(404).json(error('User not found', null, 404));
    return;
  }

  const match = await bcrypt.compare(old_password, user.password);
  if (!match) {
    res.status(401).json(error('Old password is incorrect', null, 401));
    return;
  }

  const hashed = await bcrypt.hash(new_password, 10);
  await user.update({ password: hashed });

  res.json(success('Password changed'));
});

export const updateUsername = controllerHandler(async (req, res) => {
    const { username } = req.body;
    const user = await User.findByPk(req.user!.id);
  
    if (!user) {
      res.status(404).json(error('User not found', null, 404));
      return;
    }
  
    const existing = await User.findOne({ where: { username } });
    if (existing && existing.id !== user.id) {
      res.status(409).json(error('Username already taken', null, 409));
      return;
    }
  
    await user.update({ username });
    res.json(success('Username updated', { username }));
});
  
  export const updateAvatar = controllerHandler(async (req, res) => {
    const user = await User.findByPk(req.user!.id);
  
    if (!user) {
      res.status(404).json(error('User not found', null, 404));
      return;
    }
  
    const file = req.file;
    if (!file) {
      res.status(400).json(error('No file uploaded', null, 400));
      return;
    }
  
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      fs.unlinkSync(file.path); // delete invalid file
      res.status(400).json(error('Invalid file type (only JPG/PNG)', null, 400));
      return;
    }
  
    // Hapus file lama jika ada
    if (user.avatar_url && fs.existsSync(user.avatar_url)) {
      fs.unlinkSync(user.avatar_url);
    }
  
    await user.update({ avatar_url: file.path });
    res.json(success('Avatar updated', { avatar_url: file.path }));
});