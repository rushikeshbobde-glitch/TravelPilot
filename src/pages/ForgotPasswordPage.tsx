import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan text-white shadow-glow mb-4">
          <Plane className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your email to receive recovery instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-card p-8 shadow-2xl border-slate-800">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-full w-fit mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">Reset Link Sent</h3>
              <p className="text-xs text-slate-400">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-secondary w-full text-xs py-2.5 inline-block text-center">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="glass-input w-full pl-10"
                    placeholder="traveler@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-xs py-3 mt-2 shadow-glow"
              >
                Send Reset Link
              </button>

              <div className="pt-4 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
