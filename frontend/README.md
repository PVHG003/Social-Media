# Social Media

This project uses ShadCN UI for consistent, customizable, and accessible components in the frontend.

---

## Installing a ShadCN UI Component

Install frontend packages

```shell
cd frontend
npm install
```

Install a shadcn/ui component

```shell
npx shadcn@latest add button
```

Import and Use

```tsx
import {Button} from "@/components/ui/button"

export function MyPage() {
    return <Button>Click me</Button>
}
```

Documentation

- [ShadCN UI Docs](https://ui.shadcn.com/docs/installation/vite): Installation and setup guide.
- [Component List](https://ui.shadcn.com/docs/components): Available components and usage examples