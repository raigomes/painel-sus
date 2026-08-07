# WebAuditMCP Plugin

Plugin para auditoria profissional de websites usando WebAuditMCP.

## Dependências

- Python 3.12+
- Node.js 22+
- WebAuditMCP: `git clone https://github.com/iberi22/WebAuditMCP.git /opt/WebAuditMCP`

## Setup

```bash
cd /opt/WebAuditMCP
pip install -r requirements.txt
cd node-tools && npm install && cd ..
playwright install chromium
cp .env.example .env
```

## MCP Server Config

```json
{
  "servers": {
    "webaudit": {
      "command": "python",
      "args": ["/opt/WebAuditMCP/mcp/server.py"],
      "env": {
        "CHROME_MCP_ENABLED": "true",
        "PYTHONUNBUFFERED": "1"
      }
    }
  }
}
```

## Available Tools

| Tool | Purpose |
|------|---------|
| `audit_lighthouse` | Performance, SEO, Best Practices with Core Web Vitals |
| `scan_axe` | WCAG 2.0/2.1 compliance testing |
| `security_headers` | HTTP security headers analysis |
| `responsive_audit` | Multi-viewport testing |
| `report_merge` | Consolidate results with budgets |

## Usage Examples

### Quick Audit (Development)
```
Using WebAuditMCP, run lighthouse_fast on http://localhost:3000 with device desktop
```

### Complete Audit (Release)
```
Using WebAuditMCP, perform a comprehensive audit of http://localhost:3000 following the complete-audit.md prompt.
Generate a single Markdown report with:
1. Executive summary with scores
2. Critical issues by priority
3. Actionable recommendations
```

### Accessibility Compliance
```
Audit http://localhost:3000 for WCAG 2.1 AA compliance using accessibility/wcag-compliance.md.
Include:
- Automated axe-core scan
- Screen reader compatibility notes
- Remediation priority matrix
```

## Output Format

All audit results return structured JSON:

```json
{
  "status": "ok",
  "url": "http://localhost:3000",
  "timestamp": "2026-08-05T14:32:00Z",
  "scores": {
    "overall": 85,
    "performance": 90,
    "accessibility": 95,
    "security": 70
  },
  "issues": [...],
  "recommendations": [...],
  "artifacts": {
    "screenshots": ["path/to/screenshot.png"],
    "reports": ["path/to/report.html"]
  }
}
```

## Troubleshooting

**Lighthouse fails with "command not found":**
- Ensure Node.js 22+ is installed
- Tool will auto-install on first run via `npx -y lighthouse`

**Chrome DevTools not connecting:**
- Check `CHROME_MCP_ENABLED=true` in environment
- Verify Chrome/Chromium is installed

**WAVE API errors:**
- Add `WAVE_API_KEY` to `.env` file
- Get free API key at https://wave.webaim.org/api/
