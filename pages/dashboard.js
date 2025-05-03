import Layout from "@/components/Layout";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return <Layout>
    <div className="text-2xl font-bold mb-4 bg-white text-gray-700 flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
      Hello, {session?.user?.name}
      
    </div>
    <button
          onClick={() => signOut({ callbackUrl: '/' })} // Redirect to index after sign-out
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
        >
          Sign Out
        </button>
  </Layout>
}