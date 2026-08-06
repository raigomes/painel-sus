---
name: pen-format-guardrails
description: Validates and guides .pen file creation/editing using the Pencil MCP tools. Use when creating layouts, editing .pen files, or fixing .pen format errors. Ensures compliance with .pen v2.15 schema: correct key order, variable format, node properties, shadow objects, and text nodes. Must-load before any Pencil MCP operation.
allowed-tools: Read, Bash, Grep, Glob, Write, Edit, pencil_get_app_state, pencil_execute, pencil_get_screenshot, pencil_export_html, pencil_export_nodes, pencil_browser
---

# Pen Format Guardrails — Pencil MCP Workflow

## When to Use This Skill

Activate this skill when the agent:
- Creates a new `.pen` layout file
- Edits an existing `.pen` file
- Encounters parsing errors in `.pen` files
- Needs to validate a `.pen` file before delivering
- Works with any Pencil MCP tool (execute, get_app_state, get_screenshot, etc.)

---

## CRITICAL: Pencil MCP First Step

**ALWAYS call `get_app_state` before any Pencil MCP operation.**

```
pencil_get_app_state({
  include_schema: true,
  include_canvas_design: true,
  include_scripts_and_shaders: false,
  include_browser: false
})
```

This returns:
- The current `.pen` file schema (node types, properties, valid values)
- Canvas design instructions
- The active `.pen` file path

**Never assume property names or values.** The schema from `get_app_state` is the source of truth for what the Pencil editor actually supports.

---

## 1. JSON Structure — Mandatory Key Order

The `.pen` format requires a **rigid key order** at the root level. Any other order causes parse errors.

```
{
  "version": "2.15",      ← FIRST
  "children": [...],       ← SECOND
  "variables": {...},      ← THIRD
  "fileToken": "..."       ← FOURTH (last)
}
```

### Common Errors
| Mistake | Error Message |
|---------|--------------|
| `variables` before `children` | `"Missing default value for variable type"` |
| `fileToken` not last | File won't open |
| `variables` missing | `$var` references don't resolve |

### When Using Pencil MCP `execute`:
When building or updating a node tree via `execute`, always ensure the final `.pen` JSON output respects this order. The Pencil editor handles this internally when using MCP tools, but if you export or write raw `.pen` JSON, enforce this order.

---

## 2. Variables Format

### Correct
```json
"variables": {
  "brand": { "type": "color", "value": "#0F766E" },
  "bg":    { "type": "color", "value": "#FAFAFA" }
}
```

### Rules
| Rule | WRONG | CORRECT |
|------|-------|---------|
| Keys have NO `$` prefix | `"$color.primary"` | `"color.primary"` |
| Type is `"color"` (REPO POLICY) | `"type": "number"` | Use `"color"` (visual tokens only) |
| NO `default` field | `"default": "#000"` | Remove |
| NO `"shadow"` type | `"type": "shadow"` | Use `effect` on node instead |

> **Note:** The v2.15 schema supports `boolean | color | number | string` variable types, but this repo uses **color-only** as a deliberate policy for visual design tokens. If you need non-color variables, consult `get_app_state` schema first.

### Referencing Variables in Nodes
Nodes reference variables WITH the `$` prefix:
```json
{ "fill": "$brand", "stroke": "$border" }
```

---

## 3. Node Properties

### MUST Always Include
- `"name"` on every node (descriptive text, e.g., `"name": "KPI Card"`)

### Accepted Properties

| Property | Format | Example |
|----------|--------|---------|
| `cornerRadius` | number | `8` |
| `padding` | array `[y, x]` | `[16, 24]` |
| `width` | number or `"fill_container"` | `1280` or `"fill_container"` |
| `height` | number | `900` |
| `fontWeight` | string (numeric) | `"400"`, `"500"`, `"600"`, `"700"` |
| `lineHeight` | number | `1.4`, `1.75` |
| `gap` | number | `8`, `16`, `24` |
| `layout` | `"vertical"` or `"horizontal"` | `"vertical"` |
| `alignItems` | string | `"center"`, `"flex-start"` |
| `justifyContent` | string | `"center"`, `"space-between"` |
| `effect` | object | See Section 4 |
| `fill` | string (color or `$var`) | `"#ffffff"` or `"$brand"` |
| `stroke` | string (color or `$var`) | `"#e4e4e7"` |
| `fontSize` | number | `14`, `16`, `30` |
| `fontFamily` | string | `"Inter"`, `"Geist Sans"` |
| `textAlign` | string | `"left"`, `"center"`, `"right"` |
| `textAlignVertical` | string | `"top"`, `"center"` |
| `content` | string | `"Hello World"` (for text nodes) |

### Properties That DO NOT EXIST in .pen Format

| Forbidden | Replacement |
|-----------|-------------|
| `strokeWidth: 0` + `stroke: "transparent"` | Omit entirely (no stroke = no props) |
| `fill: "transparent"` | Omit |
| `borderRadius` | Use `cornerRadius` |
| `paddingX` / `paddingY` | Use `padding: [y, x]` |
| `minHeight` | Use `height` explicitly |
| `cursor: "pointer"` | Not supported |
| `shadow` (any form) | Use `effect` object |
| `fontVariantNumeric` | Verify in schema first |
| `text` (for text content) | Use `content` instead |

> **Note on `underline`:** The v2.15 schema defines `underline?: BooleanOrVariable` in `TextStyle`, but it may not render visually. Prefer visual alternatives when possible.

---

## 4. Shadows — Always Use `effect` Object

**NEVER use shadow strings. ALWAYS use the `effect` object:**

```json
"effect": {
  "type": "shadow",
  "shadowType": "outer",
  "color": "#0000000d",
  "offset": { "x": 0, "y": 2 },
  "blur": 4
}
```

**DO NOT use:**
```json
"shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)"
"shadow": "$shadow.sm"
```

### Shadow Presets (map from Tailwind)
| Tailwind | blur | offset.y | color (alpha) |
|----------|------|----------|---------------|
| `shadow-sm` | 4 | 2 | `#0000000d` (5%) |
| `shadow-md` | 6 | 4 | `#0000001a` (10%) |
| `shadow-lg` | 15 | 10 | `#0000001a` (10%) |

---

## 5. Text Nodes

```json
{
  "type": "text",
  "id": "abc12",
  "name": "Title",
  "content": "Hello World",
  "fill": "$fg",
  "fontFamily": "Inter",
  "fontSize": 30,
  "fontWeight": "700",
  "lineHeight": 1.2,
  "textAlign": "left",
  "textAlignVertical": "top"
}
```

### Rules
- Use `content` for the text string, NEVER `text`
- Always include `id`, `name`, `content`
- `fontWeight` is a STRING: `"400"`, `"500"`, `"600"`, `"700"`

---

## 6. Pencil MCP `execute` — Node Creation Patterns

### Creating a Frame (Container)
```
pencil_execute({
  filePath: "path/to/file.pen",
  input: `
    const frame = new Frame({
      name: "Dashboard Layout",
      width: 1280,
      height: 900,
      fill: "#fafafa",
      layout: "vertical",
      gap: 24,
      padding: [24, 24]
    });
    frame;
  `
})
```

### Creating a Text Node
```
pencil_execute({
  filePath: "path/to/file.pen",
  input: `
    const text = new Text({
      name: "Page Title",
      content: "Painel SUS",
      fill: "#004B87",
      fontFamily: "Geist Sans",
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 1.3
    });
    text;
  `
})
```

### Creating a Rectangle (Card)
```
pencil_execute({
  filePath: "path/to/file.pen",
  input: `
    const card = new Rectangle({
      name: "Indicator Card",
      width: 280,
      height: 140,
      fill: "#ffffff",
      cornerRadius: 8,
      effect: {
        type: "shadow",
        shadowType: "outer",
        color: "#0000000d",
        offset: { x: 0, y: 2 },
        blur: 4
      }
    });
    card;
  `
})
```

### Adding Children to a Parent
```
pencil_execute({
  filePath: "path/to/file.pen",
  input: `
    const parent = batch_get(["parent-id"])[0];
    const child = new Text({
      name: "Label",
      content: "Cobertura Vacinal",
      fill: "#71717a",
      fontSize: 14,
      fontWeight: "500"
    });
    parent.appendChild(child);
    parent;
  `
})
```

---

## 7. Validation Checklist — Before Delivering ANY .pen File

Run this Python validation script after every significant edit:

```bash
python3 -c "
import json, sys, os

# Find the .pen file
pen_files = []
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.pen'):
            pen_files.append(os.path.join(root, f))

if not pen_files:
    print('No .pen files found')
    sys.exit(0)

for pen_file in pen_files:
    print(f'\nValidating: {pen_file}')
    try:
        with open(pen_file) as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(f'  JSON PARSE ERROR: {e}')
        continue

    errors = []

    # 1. Version check
    version = data.get('version', 'missing')
    if version != '2.15':
        errors.append(f'Version is \"{version}\" — expected \"2.15\"')

    # 2. Key order
    keys = list(data.keys())
    expected = ['version', 'children', 'variables', 'fileToken']
    if keys != expected:
        errors.append(f'Wrong key order: {keys} (expected {expected})')

    # 3. Variables
    variables = data.get('variables', {})
    for k, v in variables.items():
        if k.startswith('\$'):
            errors.append(f'Variable key has \$ prefix: {k}')
        if 'default' in v:
            errors.append(f'Variable {k} has forbidden default field')
        if v.get('type') not in ('color',):
            errors.append(f'Variable {k} has non-color type: {v.get(\"type\")} (repo policy: color-only)')

    # 4. Nodes missing name
    def check_nodes(nodes, path=''):
        for i, node in enumerate(nodes):
            if 'name' not in node:
                errors.append(f'Node [{path}{i}] missing name property')
            if 'children' in node:
                check_nodes(node['children'], f'{path}{i}/')

    check_nodes(data.get('children', []))

    # 5. Forbidden properties
    forbidden = ['borderRadius', 'paddingX', 'paddingY', 'minHeight', 'cursor']
    def check_forbidden(nodes):
        for node in nodes:
            for prop in forbidden:
                if prop in node:
                    errors.append(f'Forbidden property \"{prop}\" on node {node.get(\"id\",\"?\")}')
            if 'children' in node:
                check_forbidden(node['children'])

    check_forbidden(data.get('children', []))

    # 6. Shadow keys (any shadow key is invalid — use effect instead)
    def check_shadows(nodes):
        for node in nodes:
            if 'shadow' in node:
                errors.append(f'Forbidden \"shadow\" key on node {node.get(\"id\",\"?\")} — use effect object')
            if 'children' in node:
                check_shadows(node['children'])

    check_shadows(data.get('children', []))

    # 7. Text using 'text' key (any text key on text nodes is suspect)
    def check_text_props(nodes):
        for node in nodes:
            if node.get('type') == 'text' and 'text' in node:
                errors.append(f'Text node {node.get(\"id\",\"?\")} has \"text\" key — use \"content\" only')
            if 'children' in node:
                check_text_props(node['children'])

    check_text_props(data.get('children', []))

    if errors:
        print('VALIDATION FAILED:')
        for e in errors:
            print(f'  X {e}')
    else:
        print('VALIDATION PASSED — all checks OK')
"
```

---

## 8. Reference Templates

When in doubt about valid properties, check existing `.pen` templates:

### In-Repo (primary reference)
```
docs/layout/painel-sus.pen
```

### Sibling Project (cross-reference)
```
/home/rai/Documentos/Projects/prototipos/dashboard-rapidolar/docs/layout/dashboard.pen
```

Compare your output against these files as the source of truth for valid property combinations.

---

## 9. Workflow Summary

```
1. get_app_state() → understand current schema and file
2. get_guidelines() → load relevant guides/styles if needed
3. execute() → build/modify nodes using correct patterns
4. get_screenshot() → visually verify the result
5. validate() → run the Python checklist script
6. export_nodes() → export final PNG/WEBP for review
```

**Never skip step 1 or step 5.**
