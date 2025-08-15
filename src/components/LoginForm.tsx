import React, { useEffect, useState } from 'react';
import { Heart, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  // Initialize Embedded Catalyst Authentication on load
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).catalyst?.auth) {
      const config: any = {
        // Allow public signup and show social providers
        providers: ['zoho', 'google', 'microsoft365', 'linkedin', 'facebook'],
        is_customize_forgot_password: true,
        forgot_password_id: 'forgotPasswordDivElementId',
        // Optional redirect after successful sign-in
        service_url: '/'
      };
      (window as any).catalyst.auth.signIn('loginDivElementId', config);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await signIn(email, password);
      if (!result.success) {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
      // If successful, the useAuth hook will handle the redirect
    } catch (err) {
      console.error('Login form error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-light to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-luxury p-4 rounded-full shadow-lg">
              <Heart className="h-8 w-8 text-primary" fill="currentColor" />
            </div>
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            SNUGS & KISSES
          </h1>
          <p className="font-ui text-primary/70 text-lg">
            Compassionate Care Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-accent/20 animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-2">
              Welcome Back
            </h2>
            <p className="font-body text-primary/60">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Embedded Catalyst Authentication - Public Signup + Social Logins */
          }
          <div id="loginDivElementId" className="mb-6"></div>
          <div id="forgotPasswordDivElementId" className="hidden"></div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                if (window.catalyst?.auth) {
                  const config: any = {
                    // public signup enabled via embedded auth UI
                    // enable common social providers
                    providers: ['zoho', 'google', 'microsoft365', 'linkedin', 'facebook'],
                    is_customize_forgot_password: true,
                  };
                  window.catalyst.auth.signIn('loginDivElementId', config);
                }
              }}
              className="healthcare-button-secondary w-full"
            >
              Continue with Embedded Authentication
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-ui text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" role="form">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block font-ui font-medium text-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-primary/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="healthcare-input pl-11"
                  placeholder="Enter your email"
                  required
                  id="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block font-ui font-medium text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-primary/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="healthcare-input pl-11 pr-12"
                  placeholder="Enter your password"
                  required
                  id="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-primary/40 hover:text-primary/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="healthcare-button-primary w-full hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="font-ui text-sm text-primary/70 text-center mb-2">
              Test Credentials (Development):
            </p>
            <div className="text-xs font-ui text-primary/60 space-y-1">
              <div>👤 <strong>Client:</strong> client@example.com</div>
              <div>🔨 <strong>Contractor:</strong> contractor@example.com</div>
              <div>⚙️ <strong>Admin:</strong> admin@example.com</div>
              <div>👥 <strong>Employee:</strong> employee@example.com</div>
              <div className="pt-1">🔑 <strong>Password:</strong> password123</div>
              <div className="pt-2 text-center text-primary/50">
                <small>Production uses Zoho Catalyst authentication</small>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="font-ui text-sm text-luxury hover:text-luxury-light transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="font-ui text-sm text-primary/50">
            © 2024 SNUGS & KISSES. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};