import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadAccountsConfig } from "./config.js";

async function main() {
  // Falha rápido e com mensagem acionável se accounts.json estiver ausente/inválido.
  loadAccountsConfig();

  const server = new McpServer({
    name: "mail-mcp-server",
    version: "0.1.0",
  });

  // Tools de leitura (mail_list_accounts, mail_list_folders,
  // mail_search_messages, mail_get_message, mail_get_attachment) são
  // registradas aqui conforme implementadas — ver Issue E02.

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(`[mail-mcp-server] erro fatal: ${(err as Error).message}`);
  process.exit(1);
});
