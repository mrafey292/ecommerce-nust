import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './signup.module.css';


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/signup', { email, password, name });
      setMessage(response.data.message);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Create Account</h1>
        <form onSubmit={handleSignup}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className={styles.button}>Sign Up</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
