import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';

export default function Layout({children}) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/'); // Redirect to index if not signed in
    return null; // Prevent rendering the dashboard page
  }

  return (
    <div className="min-h-screen bg-cyan-900 flex">
      <Nav />
      <div className="text-2xl font-bold mb-4 bg-white text-gray-700 flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
        {children}
        {/* <button
          onClick={() => signOut({ callbackUrl: '/' })} // Redirect to index after sign-out
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
        >
          Sign Out
        </button> */}

      </div>

    </div>
  );
}