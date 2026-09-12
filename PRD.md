Plano: MCP de Email (leitura, multi-conta, local)
Contexto

O sócio migrou a conta de email principal do Gmail para um provedor "Speedmail" (IMAP/SMTP genérico), e o usuário mantém múltiplas contas Gmail próprias. O conector Gmail nativo já disponível neste ambiente só cobre uma conta Gmail por OAuth — não resolve múltiplas contas Gmail nem um provedor IMAP arbitrário como o Speedmail.

A ideia original era usar o repositório tecnologicachile/mail-mcp (Rust, 31 tools, IMAP/SMTP/Graph/EWS) como inspiração, mas o usuário decidiu construir uma versão própria, mais simples, em TypeScript, cobrindo só o essencial de leitura para começar — e abrir o repositório publicamente no GitHub.

Decisões já tomadas na entrevista (grill-me):

Multi-conta: várias contas Gmail + 1 conta Speedmail (IMAP/SMTP puro).
Autenticação Gmail via App Password (não OAuth2) — mais simples de configurar agora; Speedmail já é IMAP/SMTP puro por natureza.
Só leitura na v1 — sem envio, sem escrita/exclusão/movimentação. Isso limita o blast radius de qualquer erro de config ou prompt injection vindo de conteúdo de email.
Repositório próprio, separado do opencode, público no GitHub.
Linguagem: TypeScript, usando o SDK oficial @modelcontextprotocol/sdk com transporte stdio (uso local, subprocess do Claude Code).
Rodar local, nesta máquina (Rust/Node já disponíveis; sem Docker, sem servidor remoto).
Escopo mínimo de v1 (5 tools de leitura): listar contas, listar pastas, buscar mensagens, ler mensagem completa, baixar anexo.
O que será construído

Um novo repositório mcpmail (TypeScript), com:

Config de contas: arquivo config/accounts.json (gitignored, com config/accounts.example.json versionado como template) — cada entrada com {id, label, provider, host, port, secure, user, appPassword}. Não usar variáveis de ambiente individuais por conta (ficaria inviável com N contas) — env var única MAIL_MCP_ACCOUNTS_PATH aponta pro arquivo (default ./config/accounts.json).
Cliente IMAP compartilhado (src/services/imap-client.ts): usa imapflow para conectar/listar pastas/buscar/baixar, com pool de conexão simples por conta (uma conexão por chamada de tool, fechada ao final — sem pool persistente na v1, para simplicidade).
Parsing de mensagem: mailparser para extrair corpo (texto/HTML sanitizado), remetente, assunto, anexos (metadados).
5 tools MCP, prefixo mail_ (convenção do skill mcp-builder):
mail_list_accounts — lista contas configuradas (id, label, provider) sem expor credenciais.
mail_list_folders — lista pastas/mailboxes de uma conta.
mail_search_messages — busca mensagens numa pasta (filtro por remetente/assunto/data/não lida, paginação com limit/offset).
mail_get_message — lê uma mensagem completa (corpo + lista de anexos) por UID.
mail_get_attachment — baixa um anexo específico (retorna base64 ou salva em disco, a decidir na implementação).
Todas as tools com annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } e Zod schemas .strict().
Truncamento de resposta (CHARACTER_LIMIT) para não estourar contexto em caixas de entrada grandes.
Erros acionáveis: falha de auth aponta para checar accounts.json; timeout de conexão sugere checar host/porta.
Estrutura do projeto
mcpmail/
├── package.json
├── tsconfig.json
├── README.md
├── .gitignore              # inclui config/accounts.json
├── config/
│   └── accounts.example.json
└── src/
    ├── index.ts            # McpServer + StdioServerTransport
    ├── types.ts
    ├── config.ts           # carrega e valida accounts.json com Zod
    ├── services/
    │   └── imap-client.ts  # imapflow wrapper
    ├── schemas/            # Zod schemas por tool
    └── tools/
        ├── list-accounts.ts
        ├── list-folders.ts
        ├── search-messages.ts
        ├── get-message.ts
        └── get-attachment.ts
Dependências principais
@modelcontextprotocol/sdk, zod
imapflow (cliente IMAP moderno, Promise-based)
mailparser (parse de MIME)
Fora de escopo (v2, não implementar agora)
SMTP / envio / resposta / encaminhamento
Mover, deletar, marcar como lida/flag, operações em lote
OAuth2 para Gmail (fica documentado como possível evolução no README)
Verificação
npm run build sem erros.
Criar config/accounts.json local (fora do git) com 1 conta Gmail (app password) e a conta Speedmail.
Rodar npx @modelcontextprotocol/inspector node dist/index.js e testar manualmente cada uma das 5 tools contra as contas reais.
Confirmar que nenhuma credencial aparece nos outputs de mail_list_accounts.
Registrar o servidor no Claude Code (claude mcp add) e testar via um prompt real ("resuma os emails não lidos da conta X").