import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import devServer from '@hono/vite-dev-server'
import path from 'path'

const adminDbPlugin = () => ({
  name: 'admin-db-plugin',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const url = req.url || '';
      if (url.startsWith('/api/_admin/db')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }
      }

      if (url === '/api/_admin/db/tables' || url.startsWith('/api/_admin/db/tables?')) {
        res.setHeader('Content-Type', 'application/json');
        try {
          const Database = require('better-sqlite3');
          const db = new Database('./local.db', { readonly: true });
          const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_better_%'").all();
          const tables = rows.map((r: any) => {
            try {
              const count = db.prepare(`SELECT COUNT(*) as count FROM "${r.name}"`).get();
              return { name: r.name, rowCount: count ? count.count : 0 };
            } catch {
              return { name: r.name, rowCount: 0 };
            }
          });
          db.close();
          res.statusCode = 200;
          res.end(JSON.stringify({ tables }));
        } catch {
          res.statusCode = 200;
          res.end(JSON.stringify({ tables: [] }));
        }
        return;
      }

      const tableMatch = url.match(/^\/api\/_admin\/db\/table\/([^/?]+)/);
      if (tableMatch) {
        const tableName = decodeURIComponent(tableMatch[1]);
        res.setHeader('Content-Type', 'application/json');
        try {
          const Database = require('better-sqlite3');
          const db = new Database('./local.db', { readonly: true });
          const columnsInfo = db.prepare(`PRAGMA table_info("${tableName}")`).all();
          const columns = columnsInfo.map((c: any) => c.name);
          const rows = db.prepare(`SELECT * FROM "${tableName}" LIMIT 100`).all();
          db.close();
          res.statusCode = 200;
          res.end(JSON.stringify({ columns, rows }));
        } catch {
          res.statusCode = 200;
          res.end(JSON.stringify({ columns: [], rows: [] }));
        }
        return;
      }

      next();
    });
  },
});

export default defineConfig({
  plugins: [
    react(),
    adminDbPlugin(),
    devServer({
      entry: 'server/index.ts',
      exclude: [/^(?!\/api).*/],
    }),
  ],
  server: { host: true, port: 5173, strictPort: true },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})