import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './login.module.css';

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
      router.push('/dashboard');
    }
  };

  if (session) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Sign In</h1>

        <button onClick={() => signIn('google')} className={styles.googleButton}>
          Sign In with Google
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
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Sign In
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
