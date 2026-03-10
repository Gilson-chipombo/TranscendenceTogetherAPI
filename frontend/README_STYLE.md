# Guia de Estilos — Tailwind CSS

Este guia ensina como estilizar componentes no projeto usando **Tailwind CSS**.  
Usa classes utilitárias directamente no `className` dos elementos JSX/TSX.

---

## 1. Cor de fundo e texto

```tsx
className="bg-blue-600 text-white"
//          ^ fundo azul   ^ texto branco
```

| Tipo | Exemplo |
|---|---|
| Cores do Tailwind | `bg-red-500`, `bg-green-400`, `bg-slate-800` |
| Cor custom (hex) | `style={{ backgroundColor: '#E9F1F2' }}` |
| Com opacidade | `bg-blue-600/80` → 80% de opacidade |

---

## 2. Tamanho e centralização

```tsx
className="w-full h-12"
//          ^ largura 100%  ^ altura fixa (48px)
```

### Centralizar o botão dentro do pai:

```tsx
// No elemento pai:
className="flex justify-center"

// No próprio botão:
className="mx-auto"   // margem automática horizontal
```

| Classe | Efeito |
|---|---|
| `w-full` | Largura 100% |
| `w-1/2` | Largura 50% |
| `w-fit` | Largura do conteúdo |
| `h-12` | Altura 48px |
| `mx-auto` | Centrado horizontalmente |
| `flex justify-center items-center` | Centrado com flexbox |

---

## 3. Bordas e arredondamento

```tsx
className="rounded-full"    // totalmente redondo (pill)
className="rounded-xl"      // bastante arredondado
className="rounded-lg"      // médio
className="rounded-none"    // sem arredondamento

className="border border-white"        // borda fina branca
className="border-2 border-blue-500"   // borda 2px azul
```

| Classe | Efeito |
|---|---|
| `rounded-full` | Bordas completamente redondas (pill) |
| `rounded-xl` | Bordas bastante arredondadas |
| `rounded-lg` | Bordas médias |
| `rounded-none` | Sem arredondamento |
| `border` | Borda fina (1px) |
| `border-2` | Borda 2px |
| `border-blue-500` | Borda azul |

---

## 4. Hover

O prefixo `hover:` aplica o estilo **só quando o rato está em cima** do elemento:

```tsx
className="bg-blue-600 hover:bg-blue-800"
//                      ^ escurece ao passar o rato

className="text-white hover:text-yellow-300"
className="border-transparent hover:border-white"
className="hover:shadow-xl"
className="hover:scale-105"   // cresce ligeiramente
```

| Classe | Efeito no hover |
|---|---|
| `hover:bg-blue-800` | Muda cor de fundo |
| `hover:text-yellow-300` | Muda cor do texto |
| `hover:border-white` | Mostra/muda borda |
| `hover:shadow-xl` | Adiciona sombra |
| `hover:scale-105` | Cresce 5% |
| `hover:opacity-80` | Fica semi-transparente |
| `hover:underline` | Sublinhado no texto |

---

## 5. Transições (hover suave)

Sem `transition`, as mudanças de hover são **instantâneas**. Para animar suavemente:

```tsx
className="transition-colors duration-200"   // transição de cor em 200ms
className="transition-all duration-300"      // tudo transiciona em 300ms
className="transition-transform duration-200 hover:scale-105"
```

| Classe | Efeito |
|---|---|
| `transition-colors` | Anima mudanças de cor |
| `transition-all` | Anima tudo |
| `transition-transform` | Anima transformações (scale, translate) |
| `duration-150` | 150ms |
| `duration-300` | 300ms |
| `duration-500` | 500ms |
| `ease-in-out` | Aceleração suave nos dois lados |

---

## 6. Sombras

```tsx
className="shadow-sm"    // sombra subtil
className="shadow-md"    // sombra média
className="shadow-lg"    // sombra grande
className="shadow-xl"    // sombra muito grande
className="shadow-blue-500/50"  // sombra colorida com 50% opacidade
```

---

## 7. Tipografia

```tsx
className="text-sm font-normal"    // pequeno, peso normal
className="text-base font-medium"  // base, médio
className="text-lg font-semibold"  // grande, semi-negrito
className="text-xl font-bold"      // extra-grande, negrito
className="text-4xl font-extrabold" // título
```

---

## 8. Exemplo completo — Botão estilizado

```tsx
<Button
  type="submit"
  className="
    w-full h-12
    rounded-full
    bg-blue-600
    text-white text-base font-bold
    shadow-lg
    border-2 border-blue-400
    transition-all duration-300
    hover:bg-blue-800
    hover:scale-105
    hover:shadow-blue-500/50
  "
>
  Entrar
</Button>
```

---

## 9. Autofill do browser (inputs)

Quando o browser preenche automaticamente um input, aplica estilos próprios que podem sobrepor os teus.  
Para corrigir, usa este CSS em `index.css`:

```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px #4a5568 inset !important; /* cor de fundo do input */
  -webkit-text-fill-color: #ffffff !important;                  /* cor do texto */
  caret-color: #ffffff;                                         /* cor do cursor */
}
```

> Não uses `color` para mudar a cor do texto em autofill — o browser ignora.  
> Usa sempre `-webkit-text-fill-color`.

---

## 10. Referências

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)
