# DEVELOPER-ROADMAP.md — mcpmail

Bússola estratégica do projeto. Cada Epic tem um GitHub Issue como fonte
detalhada de contexto, critérios de aceite e status.

## Epics

### [**[E01] Setup do projeto e infraestrutura base**](https://github.com/alltomatos/mcpmail/issues/1)
- **Estado**: done
- **Objetivo**: scaffolding TypeScript, config de contas (Zod), cliente IMAP
  compartilhado, servidor MCP base (stdio).

### [**[E02] Tools MCP de leitura de email (5 tools)**](https://github.com/alltomatos/mcpmail/issues/2)
- **Estado**: done
- **Objetivo**: implementar `mail_list_accounts`, `mail_list_folders`,
  `mail_search_messages`, `mail_get_message`, `mail_get_attachment`.
- **Bloqueado por**: [E01]

### [**[E03] Verificação, documentação e registro no Claude Code**](https://github.com/alltomatos/mcpmail/issues/3)
- **Estado**: done
- **Objetivo**: README, testes automatizados, verificação manual completa,
  registro do servidor via `claude mcp add`.
- **Bloqueado por**: [E02]

### [**[E04] Envio de email (SMTP)**](https://github.com/alltomatos/mcpmail/issues/15)
- **Estado**: todo
- **Objetivo**: schema `smtp` opcional em accounts, cliente SMTP (`smtp-client.ts`), tool `mail_send_message`.

### [**[E05] Operações de escrita (marcar/mover/deletar)**](https://github.com/alltomatos/mcpmail/issues/16)
- **Estado**: todo
- **Objetivo**: `mail_mark_message`, `mail_move_message`, `mail_delete_message` (com `confirm` obrigatório em delete).

### [**[E06] Responder e encaminhar mensagens**](https://github.com/alltomatos/mcpmail/issues/17)
- **Estado**: todo
- **Objetivo**: `mail_reply_message`, `mail_forward_message`, reaproveitando SMTP (E04) e leitura existente.
- **Bloqueado por**: [E04]

## Milestones

### M1 — v1 utilizável localmente (E01 → E02 → E03) ✅ concluído
Entrega o escopo mínimo do PRD.md: servidor MCP local, somente leitura,
multi-conta (Gmail App Password + Speedmail), testado manualmente contra
contas reais e registrado no Claude Code.

### M2 — v2: envio, escrita e reply/forward (E04 → E05 → E06)
Expande o mcpmail além de somente-leitura: envio de email via SMTP,
operações de escrita sobre mensagens existentes (marcar/mover/deletar, com
salvaguardas para operações destrutivas) e responder/encaminhar mensagens.
Ver `docs/adr/0002-escrita-e-envio-v2.md` para as decisões de segurança.
Ordem: E04 → E05 (independente, pode paralelizar) → E06 (depende de E04).

## Fora de escopo (ainda não roadmapeado)

- OAuth2 para Gmail
- Operações em lote (múltiplas mensagens de uma vez)
