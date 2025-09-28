import { User } from '../types';

export const getToken = (): string | null => {
  return localStorage.getItem('jobtracker_token');
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem('jobtracker_user');
  try {
    return userData ? JSON.parse(userData) : null;
  } catch {
    console.warn('Invalid user data in localStorage, clearing...');
    localStorage.removeItem('jobtracker_user');
    return null;
  }
};

export const setAuth = (token: string, user: User): void => {
  if (!token || !user) return; //to check if user is undefined. if call setItem on undefined, will throw error
  localStorage.setItem('jobtracker_token', token);
  localStorage.setItem('jobtracker_user', JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem('jobtracker_token');
  localStorage.removeItem('jobtracker_user');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};