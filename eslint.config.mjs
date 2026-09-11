import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["^(\\.\\.\\/){3,}"],
              message:
                "Không import lùi quá 3 cấp (../../../*). Vui lòng dùng path alias (@/*).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;