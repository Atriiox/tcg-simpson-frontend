import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    screenshotsFolder: "./cypress/snapshots/actual",
    expose: {
      visualRegressionType: "regression",
      apiUrl: "http://localhost:3000",
    },
    setupNodeEvents(on, config) {
      configureVisualRegression(on);
      return config;
    },
    viewportWidth: 1280,
    viewportHeight: 800,
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "spec, mochawesome",
      mochawesomeReporterOptions: {
        reportDir: "cypress/reports",
        overwrite: false,
        html: false,   // on génère d'abord le JSON par run
        json: true,
      },
    },
  },
});