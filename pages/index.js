import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './login.module.css';
import Spinner from '@/components/Spinner';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      setError('An error occurred during Google sign in');
      setGoogleLoading(false);
    }
  };

  if (session) {
    router.push('/dashboard');
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Sign In</h1>

        <button 
          onClick={handleGoogleSignIn} 
          className={styles.googleButton}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner />
              <span>Signing in with Google...</span>
            </div>
          ) : (
            'Sign In with Google'
          )}
        </button>

        <div className={styles.divider}>OR</div>

        <form onSubmit={handleEmailSignIn}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || googleLoading}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || googleLoading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.signup}>
          Don&apos;t have an account?{' '}
          <Link href="/signup">
            <span>Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
