# 🔧 Correção dos Warnings de Viewport - Next.js 15

## ⚠️ **Problema:**
```
⚠ Unsupported metadata viewport is configured in metadata export. 
Please move it to viewport export instead.
```

## ✅ **Solução Aplicada:**

### **Antes (❌ Incorreto no Next.js 15):**
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página",
  description: "Descrição",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#16a34a"
};
```

### **Depois (✅ Correto no Next.js 15):**
```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Página",
  description: "Descrição"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#16a34a"
};
```

## 🚀 **Mudanças Feitas:**

1. **Layout Principal** (`src/app/layout.tsx`):
   - ✅ Separou `viewport` do `metadata`
   - ✅ Importou `Viewport` type
   - ✅ Removeu `themeColor` duplicado

2. **Benefícios:**
   - ✅ Elimina warnings do Next.js 15
   - ✅ Segue as novas convenções
   - ✅ Melhor organização do código
   - ✅ Preparado para futuras versões

## 🎯 **Resultado:**
- Sem mais warnings de viewport
- Código compatível com Next.js 15
- PWA funcionando corretamente
- Meta tags otimizadas

---

**📝 Nota:** Outros arquivos que tiverem o mesmo warning seguirão o mesmo padrão de correção.
