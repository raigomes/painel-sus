# Guardrails: Formato .pen — Regras de Validação

## Objetivo

Prevenir que layouts `.pen` sejam gerados em formato inválido. Todo agente que criar ou modificar um arquivo `.pen` DEVE seguir estas regras.

---

## 1. Estrutura Obrigatória do JSON

A ordem das chaves raiz é **rígida** — qualquer outra ordem causa erro de parsing:

```
{
  "version": "2.15",        ← PRIMEIRO
  "children": [...],         ← SEGUNDO
  "variables": {...},        ← TERCEIRO
  "fileToken": "..."         ← QUARTO (último)
}
```

**ERROS COMUNS:**
- `variables` no início do JSON → `"Missing default value for variable type"`
- `fileToken` no início → arquivo não abre
- `variables` ausente → referências `$var` não resolvem

---

## 2. Formato de Variáveis

### Correto
```json
"variables": {
  "brand": { "type": "color", "value": "#0F766E" },
  "bg":    { "type": "color", "value": "#FAFAFA" }
}
```

### Regras
| Regra | Errado | Correto |
|-------|--------|---------|
| Chave SEM `$` prefix | `"$color.primary"` | `"color.primary"` |
| Tipo SEMPRE `"color"` | `"type": "number"` | Remover (só `color` é suportado) |
| SEM campo `default` | `"default": "#000"` | Remover |
| SEM tipo `"string"` | `"type": "string"` | Remover ou converter para `color` |
| SEM tipo `"shadow"` | `"type": "shadow"` | Usar `effect` no nó, não variável |

### Referência a variáveis
Nós referenciam variáveis COM `$` prefix:
```json
{ "fill": "$brand", "stroke": "$border" }
```

---

## 3. Propriedades de Nós

### Sempre incluir
- `"name"` em todo nó (texto descritivo, ex: `"name": "KPI Card"`)

### Propriedades aceitas (não exaustivo)

| Propriedade | Formato | Exemplo |
|-------------|---------|---------|
| `cornerRadius` | number | `8` |
| `padding` | array `[y, x]` | `[16, 24]` |
| `width` | number ou `"fill_container"` | `1280` ou `"fill_container"` |
| `height` | number | `900` |
| `fontWeight` | string numérica | `"400"`, `"500"`, `"600"`, `"700"` |
| `lineHeight` | number | `1.4`, `1.75` |
| `gap` | number | `8`, `16`, `24` |
| `layout` | `"vertical"` ou `"horizontal"` | `"vertical"` |
| `alignItems` | string | `"center"`, `"flex-start"` |
| `justifyContent` | string | `"center"`, `"space-between"` |
| `effect` | object | Ver seção 4 |

### Propriedades que NÃO existem no formato .pen
- `strokeWidth: 0` + `stroke: "transparent"` → **omitir** (sem stroke = sem props)
- `fill: "transparent"` → **omitir**
- `borderRadius` → usar `cornerRadius`
- `paddingX` / `paddingY` → usar `padding: [y, x]`
- `minHeight` → usar `height` explícito
- `underline: true` → não suportado
- `cursor: "pointer"` → não suportado
- `shadow: "$var"` (string) → usar `effect` object
- `fontVariantNumeric` → verificar se suportado

---

## 4. Sombras (Shadows)

NUNCA usar string de sombra. SEMPRE usar objeto `effect`:

```json
"effect": {
  "type": "shadow",
  "shadowType": "outer",
  "color": "#0000000d",
  "offset": { "x": 0, "y": 2 },
  "blur": 4
}
```

**NÃO usar:**
```json
"shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)"
"shadow": "$shadow.sm"
```

---

## 5. Texto

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

---

## 6. Checklist de Validação (antes de commit)

Execute antes de salvar qualquer `.pen`:

```bash
python3 -c "
import json, sys

with open('FILE.pen') as f:
    data = json.load(f)

errors = []

# 1. Ordem das chaves
keys = list(data.keys())
expected = ['version', 'children', 'variables', 'fileToken']
if keys != expected:
    errors.append(f'Wrong key order: {keys} (expected {expected})')

# 2. Variáveis
variables = data.get('variables', {})
for k, v in variables.items():
    if k.startswith('\$'):
        errors.append(f'Variable key has \$ prefix: {k}')
    if 'default' in v:
        errors.append(f'Variable {k} has forbidden default field')
    if v.get('type') != 'color':
        errors.append(f'Variable {k} has non-color type: {v.get(\"type\")}')

# 3. Nós sem name
def check_nodes(nodes, path=''):
    for i, node in enumerate(nodes):
        if 'name' not in node:
            errors.append(f'Node [{path}{i}] missing name property')
        if 'children' in node:
            check_nodes(node['children'], f'{path}{i}/')

check_nodes(data.get('children', []))

# 4. Propriedades proibidas
forbidden = ['borderRadius', 'paddingX', 'paddingY', 'minHeight', 'underline', 'cursor']
def check_forbidden(nodes):
    for node in nodes:
        for prop in forbidden:
            if prop in node:
                errors.append(f'Forbidden property \"{prop}\" on node {node.get(\"id\",\"?\")}')
        if 'children' in node:
            check_forbidden(node['children'])

check_forbidden(data.get('children', []))

if errors:
    print('VALIDATION FAILED:')
    for e in errors:
        print(f'  ✗ {e}')
    sys.exit(1)
else:
    print('VALIDATION PASSED — all checks OK')
"
```

---

## 7. Referência Válida

Sempre comparar com o template válido:
```
/home/rai/Documentos/Projects/prototipos/dashboard-rapidolar/docs/layout/dashboard.pen
```

Se houver dúvida sobre uma propriedade, buscar nesse arquivo como fonte de verdade.
