import type { Metadata } from "next";

import { eventoConfig } from "@/config/evento";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Política de privacidade",
};

function ehPlaceholder(valor: string) {
  return valor.startsWith("[A_DEFINIR");
}

export default function PaginaPrivacidade() {
  const temEmail = !ehPlaceholder(eventoConfig.emailContato);

  return (
    <>
      <Header />
      <main className="py-16 sm:py-20">
        <div className="container max-w-2xl space-y-6">
          <h1 className="font-display text-3xl text-evento-marrom">
            Política de privacidade
          </h1>

          <p className="text-sm leading-relaxed text-foreground/80">
            Esta página descreve, de forma simples, como o {eventoConfig.nomeIgreja}{" "}
            trata os dados fornecidos na inscrição do evento{" "}
            {eventoConfig.nomeEvento}.
          </p>

          <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
            <div>
              <h2 className="font-display text-lg text-evento-marrom">
                Quais dados coletamos
              </h2>
              <p>
                Coletamos apenas os dados necessários para organizar o
                evento com segurança: nome da criança, idade, nome e
                WhatsApp do responsável, informações sobre alergias,
                restrições alimentares ou outras informações importantes
                de segurança/bem-estar (quando informadas), os dados de um
                contato de emergência, e as autorizações de uso dos
                brinquedos e de imagem.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-evento-marrom">
                Como usamos os dados
              </h2>
              <p>
                Os dados são usados exclusivamente para confirmar a
                inscrição, organizar a logística do evento, garantir a
                segurança da criança durante as atividades e entrar em
                contato com o responsável quando necessário. Fotos e
                vídeos só são usados em divulgação quando a autorização de
                imagem for marcada como &quot;sim&quot;. Não compartilhamos
                esses dados com terceiros para fins comerciais.
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-evento-marrom">
                Seus direitos
              </h2>
              <p>
                {temEmail ? (
                  <>
                    Você pode solicitar a correção ou remoção dos dados a
                    qualquer momento entrando em contato pelo e-mail{" "}
                    <a
                      href={`mailto:${eventoConfig.emailContato}`}
                      className="underline"
                    >
                      {eventoConfig.emailContato}
                    </a>
                    .
                  </>
                ) : (
                  "Você pode solicitar a correção ou remoção dos dados a qualquer momento entrando em contato com a organização do evento."
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
