import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { includeIgnoreFile } from "@eslint/compat";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import path from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const gitIgnorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

const allFiles = ["**/*.{ts,js}"];
const projectFiles = ["lib/**/*.{ts,js}", "test/**/*.{ts,js}"];
const testFiles = ["test/**/*.{ts,js}"];
const utilFiles = ["utils/**/*.{ts,js}"];

const defaultRules = {

    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-require-imports": "warn",

    /* strict rules */
    "@typescript-eslint/no-dynamic-delete": "warn",
    "@typescript-eslint/no-extraneous-class": "warn",
    "@typescript-eslint/no-useless-constructor": "warn",
    "@typescript-eslint/no-inferrable-types": "warn",

    /* error on deprecated */
    "@typescript-eslint/no-deprecated": "error",

    /* stylistic rules */
    "@typescript-eslint/naming-convention": [
        "warn",
        { "selector": "default", "format": ["camelCase"], "leadingUnderscore": "allow" },
        { "selector": "variableLike", "format": ["camelCase", "PascalCase", "UPPER_CASE"], "leadingUnderscore": "allow" },
        { "selector": "memberLike", "format": ["camelCase", "PascalCase", "UPPER_CASE"], "leadingUnderscore": "allow" },
        { "selector": "typeLike", "format": ["PascalCase"] },
        { "selector": "interface", "format": ["PascalCase"], "prefix": ["I"] },
        { "selector": "objectLiteralProperty", "format": null }
    ],
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/unified-signatures": "error",

    "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
    "comma-spacing": ["error", { "before": false, "after": true }],
    "indent": ["error", 4, { "SwitchCase": 1 }],
    "no-extra-semi": "error",
    "semi": ["error", "always"],
    "no-console": "warn",
    "space-in-parens": ["warn", "never"],
    "space-before-function-paren": [
        "error",
        { "anonymous": "never", "named": "never", "asyncArrow": "ignore" }
    ],

    // ignoreDeclaration sort allows import plugin to handle it
    "sort-imports": ["error", { "ignoreCase": true, ignoreDeclarationSort: true, "allowSeparatedGroups": true, "memberSyntaxSortOrder": ["none", "multiple", "single", "all"] }],

    "import/newline-after-import": "error",
    // 'import/no-named-as-default-member': 'off',
    "import/order": [
        "error",
        {
            "newlines-between": "never",
            // https://github.com/import-js/eslint-plugin-import/blob/HEAD/docs/rules/order.md
            groups: [
                "builtin", // Built-in imports (come from NodeJS native) go first
                "external", // <- External imports
                "internal", // <- Absolute imports
                ["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
                "index", // <- index imports
                "type",  // typescript type imports
                "object", // <- unknown
            ],
            alphabetize: {
                /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
                order: "asc",
                /* ignore case. Options: [true, false] */
                caseInsensitive: true,
            },
        },
    ],


};

// rules to apply by default to any code
const defaultConfig = {
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.strict
    ],
    settings: {
        "import/resolver": {
            // You will also need to install and configure the TypeScript resolver
            // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
            "typescript": true,
            "node": true,
        },
    },
    files: allFiles,
    ignores: [],
    plugins: {
        "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
        globals: {
            ...globals.node,
        },
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            projectService: true,
            tsconfigRootDir: __dirname,
        },
    },
    rules: defaultRules
};

// the main project
const projectConfig = {
    ...defaultConfig,
    rules: defaultRules,
    files: projectFiles,
};

// the test suite
const testConfig = {
    ...defaultConfig,
    rules: {
        ...defaultRules,
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-non-null-assertion": "off"
    },
    files: testFiles
}

// util folder set to commonjs since it still using require() type imports
const utilConfig = {
    ...defaultConfig,
    files: utilFiles,
    languageOptions: {
        ...defaultConfig.languageOptions,
        sourceType: "commonjs"
    },
    rules: {
        ...defaultRules,
        "semi": "warn",
        "no-console": "off",
        "no-extra-semi": "warn",
        "prefer-const": "warn",
        "no-undef": "warn",
        "@typescript-eslint/no-require-imports": "off"
    }
};

export default
    defineConfig(
        [includeIgnoreFile(gitIgnorePath, "imported .gitignore"), globalIgnores(["eslint.config.mjs"])]
    ).concat(
        [importPlugin.flatConfigs.recommended]
    ).concat(
        tseslint.config(
            {
                ...defaultConfig, ignores: projectFiles.concat(utilFiles)
            },
            projectConfig,
            testConfig,
            utilConfig
        )
    );
