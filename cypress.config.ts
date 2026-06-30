import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3001",
    screenshotsFolder: "./cypress/snapshots/actual",
    expose: {
      visualRegressionType: "regression",
    },
    setupNodeEvents(on, config) {
      configureVisualRegression(on);
      // hooks pour plus tard (ex: reset DB via tasks Cypress) si besoin
    },
    viewportWidth: 1280,
    viewportHeight: 800,
  },
});