export type StatusInscricao = "pendente" | "confirmado" | "cancelado";

export type Inscricao = {
  id: string;
  nome_crianca: string;
  idade: number;
  nome_responsavel: string;
  telefone: string;
  possui_restricao_alimentar: boolean;
  restricao_alimentar_detalhe: string | null;
  possui_informacao_importante: boolean;
  informacao_importante_detalhe: string | null;
  contato_emergencia_nome: string;
  contato_emergencia_parentesco: string;
  contato_emergencia_telefone: string;
  autorizacao_brinquedos: boolean;
  autorizacao_imagem: boolean;
  status_inscricao: StatusInscricao;
  observacoes_administrativas: string | null;
  created_at: string;
  updated_at: string;
};

export type InscricaoInsert = Pick<
  Inscricao,
  | "nome_crianca"
  | "idade"
  | "nome_responsavel"
  | "telefone"
  | "possui_restricao_alimentar"
  | "possui_informacao_importante"
  | "contato_emergencia_nome"
  | "contato_emergencia_parentesco"
  | "contato_emergencia_telefone"
  | "autorizacao_brinquedos"
  | "autorizacao_imagem"
> &
  Partial<
    Pick<
      Inscricao,
      | "restricao_alimentar_detalhe"
      | "informacao_importante_detalhe"
      | "status_inscricao"
    >
  >;

export type Administrador = {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  created_at: string;
};

export type AuditoriaInscricao = {
  id: string;
  inscricao_id: string;
  administrador_id: string | null;
  campo_alterado: string;
  valor_anterior: string | null;
  valor_novo: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      inscricoes: {
        Row: Inscricao;
        Insert: Partial<Inscricao> & InscricaoInsert;
        Update: Partial<Inscricao>;
        Relationships: [];
      };
      administradores: {
        Row: Administrador;
        Insert: Partial<Administrador> & Pick<Administrador, "id" | "email">;
        Update: Partial<Administrador>;
        Relationships: [];
      };
      auditoria_inscricoes: {
        Row: AuditoriaInscricao;
        Insert: Partial<AuditoriaInscricao> &
          Pick<AuditoriaInscricao, "inscricao_id" | "campo_alterado">;
        Update: Partial<AuditoriaInscricao>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
