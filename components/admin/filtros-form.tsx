const OPCOES_STATUS = [
  { value: "todos", label: "Todas as inscrições" },
  { value: "pendente", label: "Pendente" },
  { value: "confirmado", label: "Confirmado" },
  { value: "cancelado", label: "Cancelado" },
];

const classeInput =
  "h-11 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function FiltrosForm({
  valores,
}: {
  valores: {
    busca?: string;
    status?: string;
  };
}) {
  return (
    <form
      method="get"
      className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <input
        type="search"
        name="busca"
        placeholder="Nome da criança, responsável ou WhatsApp"
        defaultValue={valores.busca}
        className={`${classeInput} lg:col-span-2`}
      />
      <select
        name="status"
        defaultValue={valores.status ?? "todos"}
        className={classeInput}
      >
        {OPCOES_STATUS.map((opcao) => (
          <option key={opcao.value} value={opcao.value}>
            {opcao.label}
          </option>
        ))}
      </select>
      <div className="flex gap-3">
        <button
          type="submit"
          className="h-11 flex-1 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Filtrar
        </button>
        <a
          href="/admin"
          className="flex h-11 items-center justify-center rounded-full border border-input px-6 text-sm font-medium text-foreground hover:bg-muted/60"
        >
          Limpar
        </a>
      </div>
    </form>
  );
}
