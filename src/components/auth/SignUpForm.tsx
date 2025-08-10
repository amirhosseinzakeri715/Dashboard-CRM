'use client';
import InputField from 'components/fields/InputField';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';
import Image from 'next/image';
import logo from '../../../public/logo/logo2.png';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'contexts/AuthContext';
import FormMessage from 'components/fields/FormMessage';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { register } = useAuth();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(email, password, firstName, lastName);
      setSuccess('Registration successful! Redirecting to sign in...');
      setTimeout(() => router.push('/auth/sign-in'), 1500);
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h3>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your details to create your account!
        </p>
        {/* Google sign up removed for now */}
        <div className="mb-6 flex items-center">
          <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
          <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
        </div>
        {error && (
          <FormMessage type="error">{error}</FormMessage>
        )}
        {success && (
          <FormMessage type="success">{success}</FormMessage>
        )}
        <form onSubmit={handleSignUp} className="w-full flex flex-col space-y-2">
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
            onChange={e => setEmail(e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="First Name*"
            placeholder="Your first name"
            id="first_name"
            type="text"
            onChange={e => setFirstName(e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="Last Name*"
            placeholder="Your last name"
            id="last_name"
            type="text"
            onChange={e => setLastName(e.target.value)}
          />
          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="mt-2 flex items-center">
              <Checkbox color='green' />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                I agree to the Terms
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="linear w-full rounded-xl bg-green-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
            Already have an account?
          </span>
          <a
            href="/auth/sign-in"
            className="ml-1 text-sm font-medium text-green-500 hover:text-green-600 dark:text-white"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm; 