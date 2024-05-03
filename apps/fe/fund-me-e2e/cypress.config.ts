import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run fund-me:serve',
        production: 'nx run fund-me:preview',
      },
      ciWebServerCommand: 'nx run fund-me:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
