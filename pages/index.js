import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/dashboard'); // Redirect to a new page on successful sign-in
    }
  };

  if (session) {
    router.push('/dashboard'); // Redirect if already signed in
    return null; // Prevent rendering the login page
  }

  return (
    <div className="bg-blue-900 w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>

        {/* Google Sign-In */}
        <button
          onClick={() => signIn('google')}
          className="bg-blue-500 text-white w-full py-2 rounded mb-4 hover:bg-blue-600"
        >
          Sign In with Google
        </button>

        {/* Divider */}
        <div className="text-center text-gray-500 my-4">OR</div>

        {/* Email/Password Sign-In Form */}
        <form onSubmit={handleEmailSignIn}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Sign In
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

        {/* Signup Link */}
        <p className="mt-4 text-center text-gray-700">
          Don't have an account?{' '}
          <Link href="/signup">
            <span className="text-blue-500 underline cursor-pointer">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}