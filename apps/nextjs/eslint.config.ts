import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@powell-oss/eslint-config/base";
import { nextjsConfig } from "@powell-oss/eslint-config/nextjs";
import { reactConfig } from "@powell-oss/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
