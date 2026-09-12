# ADR 0002 — Expansão para escrita e envio (v2)

## Status

Aceito

## Contexto

A ADR 0001 restringiu a v1 do `mcpmail` a operações somente-leitura,
reduzindo deliberadamente o blast radius de erros de configuração e de
prompt injection vindo de conteúdo de email malicioso. Com a v1 estável,
testada (31 testes automatizados) e verificada contra contas reais, o
usuário decidiu expandir o escopo para v2:

1. Envio de email via SMTP (`mail_send_message`)
2. Operações de escrita sobre mensagens existentes: marcar
   lida/não lida/flag, mover entre pastas, deletar
3. Responder/encaminhar mensagens (`mail_reply_message`,
   `mail_forward_message`), construídas sobre o envio e a leitura já
   existentes

OAuth2 para Gmail não foi priorizado nesta rodada e permanece fora de
escopo.

## Decisão

1. **Schema de contas estendido, não substituído**: `config/accounts.json`
   ganha um bloco `smtp: { host, port, secure }` **opcional** por conta.
   Contas sem esse bloco continuam funcionando normalmente para leitura;
   tentativas de envio nessas contas falham com erro claro em vez de
   exceção genérica.

2. **Sem pool de conexão SMTP persistente**, consistente com a decisão já
   tomada para IMAP na v1 (ADR 0001): um transporter `nodemailer` por
   chamada, fechado ao final.

3. **Operações destrutivas exigem salvaguardas explícitas**:
   - `mail_delete_message` exige um parâmetro `confirm: z.literal(true)`
     no schema de entrada (sem valor default). Um cliente MCP que não
     passe `confirm: true` deliberadamente tem a chamada rejeitada pela
     validação Zod, antes de qualquer lógica de negócio rodar — isso
     reduz o risco de um LLM ser induzido (via prompt injection em
     conteúdo de email) a deletar mensagens sem intenção clara do
     usuário.
   - `mail_delete_message` e `mail_move_message` usam annotations
     `{ destructiveHint: true, idempotentHint: false }`.
   - `mail_mark_message` (mudança de flags) é considerada reversível e de
     baixo risco — não exige `confirm`.

4. **Reply/Forward reaproveitam código existente**: em vez de duplicar a
   lógica de parsing de mensagem, `mail_reply_message` e
   `mail_forward_message` reaproveitam o cliente SMTP (item 2) e a lógica
   de leitura já implementada para `mail_get_message`.

## Consequências

- A v2 introduz risco real de efeitos colaterais irreversíveis (deletar
  mensagens, enviar emails incorretos) que a v1 deliberadamente evitava.
  As salvaguardas acima (schema opcional, `confirm` explícito,
  annotations corretas) mitigam esse risco, mas não o eliminam —
  operações de escrita devem ser testadas manualmente contra contas de
  teste antes de qualquer uso em produção.
- `nodemailer` passa a ser dependência direta do projeto (antes era
  transitiva via `mailparser`).
- Operações em lote (múltiplas mensagens de uma vez) permanecem fora de
  escopo — cada tool de escrita opera em uma mensagem por chamada,
  seguindo o mesmo princípio de simplicidade da v1.
