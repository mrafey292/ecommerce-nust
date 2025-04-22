import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center"> 
        <div className="text-center w-full"> 
          <button onClick={() => signIn('google') } className="bg-white p-2 rounded-md px-4 text-black">Login with Google</button>
        </div>
      </div>
    );
  }
  
  return (
    <div>logged in {session.user.email}</div>
  )

}
