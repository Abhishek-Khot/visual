import type { MockJiraTask, MockPhoto, MockInvoice, MockArticle } from '../types';

export const mockJiraTasks: MockJiraTask[] = [
    { id: 'PROJ-247', title: 'Deploy staging environment', priority: 'HIGH', due: '2026-03-12', status: 'Open' },
    { id: 'PROJ-251', title: 'Code review: authentication module', priority: 'MEDIUM', due: '2026-03-10', status: 'Open' },
    { id: 'PROJ-255', title: 'Write API documentation', priority: 'LOW', due: '2026-03-15', status: 'Open' },
    { id: 'PROJ-260', title: 'Fix database connection pooling', priority: 'HIGH', due: '2026-03-09', status: 'Open' },
    { id: 'PROJ-263', title: 'Update CI/CD pipeline config', priority: 'MEDIUM', due: '2026-03-11', status: 'Open' },
    { id: 'PROJ-267', title: 'Implement rate limiting middleware', priority: 'HIGH', due: '2026-03-08', status: 'Open' },
    { id: 'PROJ-271', title: 'Review security audit findings', priority: 'MEDIUM', due: '2026-03-14', status: 'Open' },
];

export const mockMinioPhotos: MockPhoto[] = [
    { key: 'project-phoenix/mockup-v3.png', size: '2.4MB', lastModified: '2026-02-28' },
    { key: 'project-phoenix/wireframe-main.png', size: '1.8MB', lastModified: '2026-02-25' },
    { key: 'project-phoenix/dashboard-draft.png', size: '3.1MB', lastModified: '2026-02-22' },
    { key: 'project-phoenix/logo-final.svg', size: '0.4MB', lastModified: '2026-02-20' },
    { key: 'project-phoenix/team-photo.jpg', size: '5.2MB', lastModified: '2026-02-18' },
    { key: 'project-phoenix/sprint-board.png', size: '1.1MB', lastModified: '2026-02-15' },
    { key: 'project-phoenix/architecture-v2.png', size: '2.8MB', lastModified: '2026-02-12' },
    { key: 'project-phoenix/api-flow.png', size: '1.6MB', lastModified: '2026-02-10' },
    { key: 'project-phoenix/deployment-diagram.png', size: '2.0MB', lastModified: '2026-02-08' },
    { key: 'project-phoenix/meeting-notes-scan.jpg', size: '4.1MB', lastModified: '2026-02-05' },
    { key: 'project-phoenix/client-feedback.png', size: '1.3MB', lastModified: '2026-02-03' },
    { key: 'project-phoenix/release-checklist.png', size: '0.9MB', lastModified: '2026-02-01' },
];

export const mockInvoices: MockInvoice[] = [
    { file: 'invoice_2024_11.pdf', amount: '$3,240.00', vendor: 'Cloud Services Inc' },
    { file: 'invoice_2024_10.pdf', amount: '$2,890.00', vendor: 'Cloud Services Inc' },
    { file: 'invoice_2024_09.pdf', amount: '$3,100.00', vendor: 'Cloud Services Inc' },
];

export const mockNewsArticles: MockArticle[] = [
    { title: 'Tech industry braces for Q1 2026 project deadline crunch', score: 0.88, source: 'TechCrunch' },
    { title: 'How teams are managing March 2026 sprint deadlines', score: 0.81, source: 'InfoWorld' },
    { title: 'Project management trends: deadline accountability', score: 0.73, source: 'Harvard Business Review' },
    { title: 'Remote work challenges in meeting quarterly goals', score: 0.45, source: 'Forbes' },
    { title: 'New project tracking tools for 2026', score: 0.52, source: 'Wired' },
];

export const gatewayYaml = `# gateway.yaml
datasources:
  mongo:
    uri: "mongodb://localhost:27017"
    db: "userdb"
    credentials:
      username: "alex"
      password: "s3cureP@ss!"
  mysql:
    host: "mysql.internal"
    port: 3306
    credentials:
      password: "mysql_r00t_pw"
  filesystem:
    base_path: "/data/alex/files"
    allowed_extensions: [".pdf", ".docx", ".txt"]
  minio:
    endpoint: "minio.internal:9000"
    bucket: "alex-assets"
    access_key: "AKIAIOSFODNN7EXAMPLE"
  jira:
    base_url: "https://alexcorp.atlassian.net"
    api_token: "ATT_jira_xoxb_1234567890"
  websearch:
    provider: "serper"
    api_key: "sk_serper_abc123xyz789"`;

export const securityYaml = `security:
  allowlists:
    mysql:
      allowed_tables:
        - "orders"
        - "invoices"
        - "billing_history"
      blocked_tables:
        - "user_passwords"
        - "admin_tokens"
        - "internal_audit"
    mongo:
      allowed_collections:
        - "user_profiles"
        - "preferences"
      blocked_collections:
        - "auth_tokens"
        - "session_secrets"
        - "admin_users"
  mutations:
    allow_write: false
    allow_delete: false
    log_all_queries: true`;

export const sensitiveFields = [
    'password', 'api_token', 'access_key', 'api_key',
];

export const alexQuery = "Show me all my open Jira tasks, find the photos I uploaded for Project Phoenix, pull my last 3 invoices from files, and tell me if there's any news about the deadline I have next week.";
