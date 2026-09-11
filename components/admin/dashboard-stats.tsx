import { Users, Clock, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type Estatisticas = {
  total: number;
  pendentes: number;
  confirmados: number;
  cancelados: number;
};

export function DashboardStats({ stats }: { stats: Estatisticas }) {
  const itens = [
    { icone: Users, rotulo: "Total de inscrições", valor: stats.total },
    { icone: Clock, rotulo: "Pendentes", valor: stats.pendentes },
    { icone: CheckCircle2, rotulo: "Confirmadas", valor: stats.confirmados },
    { icone: XCircle, rotulo: "Canceladas", valor: stats.cancelados },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {itens.map((item) => (
        <Card key={item.rotulo}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <item.icone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.rotulo}
              </p>
              <p className="text-xl font-semibold text-foreground">
                {item.valor}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
