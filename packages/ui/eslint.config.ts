import { defineConfig } from "eslint/config";

import { baseConfig } from "@powell-oss/eslint-config/base";
import { reactConfig } from "@powell-oss/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
