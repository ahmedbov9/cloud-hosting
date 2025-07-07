import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // ✅ 1. تجاهل مجلدات معينة
  {
    ignores: ["src/generated/**"],
  },

  // ✅ 2. قواعد Next.js + TypeScript (يجب أن تأتي قبل تخصيص القواعد)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ 3. تخصيص قواعد خاصة بك (بعد extends دائمًا)
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
