"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");

    if (!raw) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(raw);
      if (!user?.role || user.role !== "admin") {
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }
      setAuthorized(true);
    } catch {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Sidebar />
      <main className="ml-72 px-8 py-6 w-full overflow-auto">
        {children}
      </main>
    </div>
  );
}
