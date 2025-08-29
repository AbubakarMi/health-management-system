"use client";

import { users, type Role } from './constants';

export interface AuthUser {
  name: string;
  email: string;
  role: Role;
}

class AuthManager {
  private currentUser: AuthUser | null = null;
  private listeners: Set<(user: AuthUser | null) => void> = new Set();

  login(email: string, password: string): AuthUser | null {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = {
        name: user.name,
        email: user.email,
        role: user.role
      };
      this.notifyListeners();
      
      // Store in session storage for persistence
      sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      return this.currentUser;
    }
    return null;
  }

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('currentUser');
    this.notifyListeners();
  }

  getCurrentUser(): AuthUser | null {
    if (!this.currentUser && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  hasRole(role: Role): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  canAccess(requiredRole: Role): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Users can only access their own role's pages
    return user.role === requiredRole;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  subscribe(listener: (user: AuthUser | null) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  // Secure route access validation
  validateAccess(pathname: string): { allowed: boolean; redirectTo?: string } {
    const user = this.getCurrentUser();
    
    if (!user) {
      return { allowed: false, redirectTo: '/' };
    }

    // Extract role from pathname
    const pathSegments = pathname.split('/').filter(Boolean);
    const pathRole = pathSegments[0];

    // Check if trying to access a role-specific route
    const roleRoutes = ['admin', 'doctor', 'pharmacist', 'finance', 'labtech'];
    
    if (roleRoutes.includes(pathRole)) {
      if (user.role !== pathRole) {
        // Redirect to user's correct dashboard
        return { allowed: false, redirectTo: `/${user.role}` };
      }
    }

    return { allowed: true };
  }
}

export const authManager = new AuthManager();