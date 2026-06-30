// cypress/e2e/register.cy.ts
describe("Inscription", () => {
  it("crée un compte et redirige vers la collection avec le booster de bienvenue", () => {
    const pseudo = `Cypress${Date.now().toString().slice(-6)}`;
    const uniqueEmail = `test-${Date.now()}@cypress.local`;
    const password = "MotDePasse123!";

    cy.intercept("GET", "**/users/me/boosters").as("getBoosters");

    cy.visit("/");
    cy.get('[data-testid=home-register-button]')
      .should("be.visible")
      .and("be.enabled")
      .click();

    cy.get('[data-testid=register-pseudo-input]')
      .should("be.visible")
      .type(pseudo)
      .should("have.value", pseudo);

    cy.get('[data-testid=register-email-input]')
      .should("be.visible")
      .type(uniqueEmail)
      .should("have.value", uniqueEmail);

    cy.get('[data-testid=register-password-input]')
      .should("be.visible")
      .type(password)
      .should("have.value", password);

    cy.get('[data-testid=register-submit-button]')
      .should("be.visible")
      .and("be.enabled")
      .click();

    cy.url({ timeout: 15000 }).should("include", "/collection");
    cy.url().should("include", "newUser=true");

    cy.wait("@getBoosters", { timeout: 15000 });

    cy.get('[data-testid=booster-opener-modal]', { timeout: 15000 }).should(
      "be.visible",
    );
    cy.compareSnapshot("booster-modal-opened", {
      errorThreshold: 0.01,
      disableTimersAndAnimations: false,
    });
  });
});