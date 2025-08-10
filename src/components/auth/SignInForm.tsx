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
import { useRefresh } from 'contexts/RefreshTokenContext';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();
  const { setupTokenRefresh } = useRefresh();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setupTokenRefresh()
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h3>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        {/* <div
          className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white"
          onClick={handleGoogleSignIn}
          tabIndex={0}
          role="button"
          aria-label="Sign in with Google"
        >
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <p className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </p>
        </div> */}
        <div className="mb-6 flex items-center  ">
          <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
          
          <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
        </div>
        {error && (
          <FormMessage type="error">{error}</FormMessage>
        )}
        <form onSubmit={handleSignIn} className="w-full flex flex-col space-y-2">
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
                Keep me logged In
              </p>
            </div>
            {/* <a
              className="text-sm font-medium text-green-500 hover:text-green-600 dark:text-white"
              href="#"
            >
              Forgot Password?
            </a> */}
          </div>
          <button
            type="submit"
            className="linear w-full rounded-xl bg-green-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
            Not registered yet?
          </span>
          <a
            href="/auth/sign-up/default"
            className="ml-1 text-sm font-medium text-green-500 hover:text-green-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignInForm; 