import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/'); // Redirect to index if not signed in
    return null; // Prevent rendering the dashboard page
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user.email}</h1>
      <button
        onClick={() => signOut({ callbackUrl: '/' })} // Redirect to index after sign-out
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}