# CONTEXT.md — mcpmail

## Linguagem de domínio

| Termo | Significado |
|---|---|
| Account (Conta) | Entrada em `config/accounts.json`: credenciais e config de conexão IMAP (+ SMTP opcional, para envio) de uma caixa de email (Gmail via App Password, ou Speedmail). Única entidade persistida localmente. |
| Folder (Pasta) | Mailbox IMAP remota (ex: INBOX, Sent). Obtida em tempo real via `imapflow`, não persistida. |
| Message (Mensagem) | Email individual dentro de uma Folder, identificado por UID IMAP. Parseado sob demanda via `mailparser`. |
| Attachment (Anexo) | Arquivo anexado a uma Message, identificado por `filename`/`partId`. Conteúdo binário obtido sob demanda. |
| App Password | Senha de aplicativo usada para autenticação IMAP/SMTP, em vez de OAuth2. Escolhida por simplicidade na v1. |
| Provider | Rótulo do provedor de email (`gmail`, `speedmail`, `outlook`, `generic-imap`) usado para aplicar particularidades de conexão. |

## Decisões arquiteturais chave

- **Somente leitura na v1**: reduz blast radius de erro de config ou prompt
  injection vindo de conteúdo de email malicioso.
- **Envio e escrita na v2** (ver [ADR 0002](docs/adr/0002-escrita-e-envio-v2.md)):
  bloco `smtp` opcional em accounts.json, `mail_delete_message` exige
  `confirm: true` explícito no schema (rejeitado antes de qualquer lógica
  rodar), `mail_delete_message`/`mail_move_message` com `destructiveHint: true`.
- **App Password em vez de OAuth2**: simplicidade de configuração agora;
  Speedmail já é IMAP/SMTP puro por natureza. OAuth2 fica documentado como
  evolução futura.
- **Sem pool de conexão persistente**: uma conexão IMAP por chamada de tool,
  fechada ao final. Simplicidade > performance na v1.
- **`.strict()` + `.describe()` obrigatórios em todo schema Zod**: rejeita
  campos extras (defesa contra injeção de parâmetros) e melhora o
  preenchimento correto pelo LLM.
- **Config централizada em arquivo, não env vars por conta**: `accounts.json`
  (gitignored) referenciado por uma única env var
  `MAIL_MCP_ACCOUNTS_PATH` — inviável ter env var por conta com N contas.
- **Credenciais nunca aparecem em outputs de tools** (ver `mail_list_accounts`).

## Onde estão as decisões detalhadas

- Plano completo e escopo: [PRD.md](PRD.md)
- Modelo de dados lógico: [DER.md](DER.md)
- Schemas de validação: [schema.md](schema.md)
- Decisões arquiteturais registradas formalmente: `docs/adr/`
