// cypress/e2e/register.cy.ts
describe("Inscription", () => {
  // Stockés pendant le test, consommés dans after() pour le cleanup
  let createdUserToken: string;

  after(() => {
    if (!createdUserToken) return;

    cy.request({
      method: "DELETE",
      url: `${Cypress.expose("apiUrl")}/users/me`,
      headers: { Authorization: `Bearer ${createdUserToken}` },
    });
  });

  it("crée un compte et redirige vers la collection avec le booster de bienvenue", () => {
    const pseudo = `Cypress${Date.now().toString().slice(-6)}`;
    const uniqueEmail = `test-${Date.now()}@cypress.local`;
    const password = "MotDePasse123!";

    cy.intercept("GET", "**/users/me/boosters").as("getBoosters");
    cy.intercept("POST", "**/users/register").as("register");

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

    cy.wait("@register").then(({ response }) => {
      createdUserToken = response!.body.token;
    });

    cy.url({ timeout: 15000 }).should("include", "/collection");
    cy.url().should("include", "newUser=true");

    cy.wait("@getBoosters", { timeout: 15000 });

    cy.get('[data-testid=booster-opener-modal]', { timeout: 15000 }).should(
      "be.visible",
    );

    cy.get('[data-testid=booster-pack-3d-container]', {
      timeout: 15000,
    }).should("have.attr", "data-scene-ready", "true");

    cy.get('[data-testid=booster-opener-modal]').compareSnapshot(
      "booster-modal-opened",
      {
        // 0.05 plutôt que 0.01 : le canvas WebGL (anti-aliasing, éclairage,
        // compression de texture) génère du bruit de rendu naturel d'une
        // capture à l'autre, même sans aucune régression réelle.
        errorThreshold: 0.05,
        disableTimersAndAnimations: false,
      },
    );

    // Intercept l'ouverture du booster avant de simuler le drag
    cy.intercept("POST", "**/users/me/boosters/*/open").as("openBooster");

    // Simulation du drag :
    // 1. pointerdown sur l'overlay (enregistre le X de départ)
    // 2. pointermove sur window (le hook écoute sur window, pas sur l'élément)
    //    avec un delta suffisant pour dépasser le seuil de 90%
    cy.get('[data-testid=booster-drag-overlay]')
      .should("be.visible")
      .trigger("pointerdown", {
        clientX: 100,
        clientY: 300,
        pointerId: 1,
        bubbles: true,
      });

    cy.window().then((win) => {
      const moveEvent = new PointerEvent("pointermove", {
        clientX: 500,
        clientY: 300,
        pointerId: 1,
        bubbles: true,
      });
      win.dispatchEvent(moveEvent);
    });

    // Attente de la réponse du backend avant de vérifier les cartes
    cy.wait("@openBooster", { timeout: 15000 });

    cy.get('[data-testid=booster-cards-result]', { timeout: 15000 }).should(
      "be.visible",
    );

    cy.get('[data-testid=card-item]').should("have.length", 5);

    cy.get('[data-testid=booster-cards-count]').should("contain", "5");

    // Attente de la fin des animations CSS (cascade delay 0.6s + durée 0.5s)
    // avant le screenshot — pas de signal DOM exploitable pour ce cas.
    cy.wait(1500);

    cy.get('[data-testid=booster-cards-result]').compareSnapshot(
      "booster-cards-revealed",
      {
        errorThreshold: 0.05,
        disableTimersAndAnimations: false,
      },
    );
  });
});