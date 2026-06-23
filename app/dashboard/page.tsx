import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-slate-100">
        <span className="text-xl font-bold tracking-tight">tethrd</span>
        <UserButton />
      </nav>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-500 text-sm">User ID: {userId}</p>
        <p className="text-slate-400 mt-8 text-sm">Tethrd flow coming soon.</p>
      </section>
    </main>
  );
}
