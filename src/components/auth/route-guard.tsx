"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authManager, type AuthUser } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentUser = authManager.getCurrentUser();
    setUser(currentUser);

    // Subscribe to auth changes
    const unsubscribe = authManager.subscribe(setUser);
    setLoading(false);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading && user) {
      // Validate access to current route
      const access = authManager.validateAccess(pathname);
      
      if (!access.allowed && access.redirectTo) {
        console.warn(`Access denied to ${pathname}. Redirecting to ${access.redirectTo}`);
        router.replace(access.redirectTo);
        return;
      }

      // Additional role-specific validation
      if (requiredRole && !authManager.hasRole(requiredRole as any)) {
        console.warn(`Role ${user.role} cannot access ${requiredRole} routes`);
        router.replace(`/${user.role}`);
        return;
      }
    }
  }, [user, pathname, router, loading, requiredRole]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold nubenta-gradient-text">
              Careflux Security Check
            </h3>
            <p className="text-sm text-muted-foreground">
              Verifying access permissions...
            </p>
            <div className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-white rounded-full animate-pulse-slow inline-block">
              Powered by Nubenta
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.replace('/');
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for specific role protection
export function withRoleProtection(requiredRole: string) {
  return function ProtectedComponent({ children }: { children: React.ReactNode }) {
    return (
      <RouteGuard requiredRole={requiredRole}>
        {children}
      </RouteGuard>
    );
  };
}