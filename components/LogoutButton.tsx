"use client";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  };

  return (
    <form onSubmit={handleLogout}>
      <Button variant="destructive" size="sm" type="submit" className="shadow-lg rounded-full px-4">
        Se déconnecter
      </Button>
    </form>
  );
}
