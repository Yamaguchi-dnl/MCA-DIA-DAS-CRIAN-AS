"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { logoutAdmin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [pendente, iniciarTransicao] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pendente}
      onClick={() => iniciarTransicao(() => logoutAdmin())}
    >
      <LogOut className="h-4 w-4" /> Sair
    </Button>
  );
}
