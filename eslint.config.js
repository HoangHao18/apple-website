import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tailwindcss from 'eslint-plugin-tailwindcss'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      tailwindcss: tailwindcss,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Tailwind plugin rules (dùng mặc định)
      ...tailwindcss.configs.recommended.rules,
      // Prettier (tắt các quy tắc ESLint có thể mâu thuẫn với prettier)
      ...prettier.rules,

      // Giới hạn độ dài dòng
      'max-len': ['error', { code: 100, ignoreComments: true, ignoreUrls: true }],

      // Giới hạn số dòng trắng liên tiếp
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],

      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-undef': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
]
