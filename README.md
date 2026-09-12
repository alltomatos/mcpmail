# mcpmail

Servidor MCP (Model Context Protocol) de email multi-conta — Gmail (via App
Password) e provedores IMAP/SMTP genéricos (ex: Speedmail). Leitura,
envio, operações de escrita (marcar/mover/deletar) e responder/encaminhar.

Ver [PRD.md](PRD.md), [CONTEXT.md](CONTEXT.md) e [docs/adr/](docs/adr/) para
o contexto completo de decisões — incluindo as salvaguardas de segurança
para operações destrutivas (ADR 0002).

## Instalação

```bash
npm install
npm run build
```

## Configuração

Copie `config/accounts.example.json` para `config/accounts.json` (git-ignored)
e preencha com suas contas reais:

```bash
cp config/accounts.example.json config/accounts.json
```

Cada conta usa App Password (não OAuth2). Para Gmail, gere uma App Password em
https://myaccount.google.com/apppasswords.

Por padrão o servidor lê `./config/accounts.json`. Para usar outro caminho,
defina a variável de ambiente `MAIL_MCP_ACCOUNTS_PATH`.

Para habilitar **envio** (`mail_send_message`, `mail_reply_message`,
`mail_forward_message`), adicione um bloco `smtp` opcional à conta:

```json
"smtp": { "host": "smtp.gmail.com", "port": 587, "secure": false }
```

Contas sem esse bloco continuam funcionando normalmente para leitura;
tentar enviar por elas retorna um erro claro.

## Uso

```bash
npm start
```

O servidor comunica via stdio (transporte `StdioServerTransport`), pensado
para rodar como subprocess do Claude Code:

```bash
claude mcp add mcpmail -- node /caminho/absoluto/dist/index.js
```

## Tools disponíveis

Ver [docs/agents/domain.md](docs/agents/domain.md) para a lista completa das
11 tools:

- **Leitura (v1)**: `mail_list_accounts`, `mail_list_folders`, `mail_search_messages`, `mail_get_message`, `mail_get_attachment`
- **Envio (v2)**: `mail_send_message`
- **Escrita (v2)**: `mail_mark_message`, `mail_move_message`, `mail_delete_message` (exige `confirm: true` — irreversível)
- **Responder/encaminhar (v2)**: `mail_reply_message`, `mail_forward_message`

## Testes

```bash
npm test
```

## Fora de escopo (ainda não implementado)

- OAuth2 para Gmail
- Operações em lote (múltiplas mensagens de uma vez)
