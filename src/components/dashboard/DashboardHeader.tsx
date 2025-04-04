"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardHeader() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-blue-400">
          EazeMoney
        </Link>
        
        <nav>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-300 hover:text-white transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}