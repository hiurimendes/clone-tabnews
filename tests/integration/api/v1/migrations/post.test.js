import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("With no authentication", async () => {
        await orchestrator.runPendingMigrations();

        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(403);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          action:
            'Verifique se o seu usuário possui a feature "create:migration".',
          message: "Você não possui permissão para executar esta ação.",
          name: "ForbiddenError",
          status_code: 403,
        });
      });
    });
  });

  describe("Default user", () => {
    describe("Running pending migrations", () => {
      test("With defaults permissions", async () => {
        await orchestrator.runPendingMigrations();

        const createdUser = await orchestrator.createUser();
        const activatedUser = await orchestrator.activateUser(createdUser);
        const sessionObject = await orchestrator.createSession(
          activatedUser.id,
        );

        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${sessionObject.token}`,
            },
          },
        );

        expect(response.status).toBe(403);

        const responseBody = await response.json();

        expect(responseBody).toEqual({
          action:
            'Verifique se o seu usuário possui a feature "create:migration".',
          message: "Você não possui permissão para executar esta ação.",
          name: "ForbiddenError",
          status_code: 403,
        });
      });
    });
  });

  describe("Privileged user", () => {
    describe("Running pending migrations", () => {
      // TODO: Melhorar a geração da migration de teste para que seja possível testar a criação da migration e a execução da mesma em sequência.
      test.skip("With `create:migration` for the first time", async () => {
        await orchestrator.runPendingMigrations();

        const privilegedUser = await orchestrator.createUser();
        const activatedPrivilegedUser =
          await orchestrator.activateUser(privilegedUser);

        await orchestrator.addFeaturesToUser(privilegedUser, [
          "create:migration",
        ]);

        const privilegedUserSession = await orchestrator.createSession(
          activatedPrivilegedUser.id,
        );

        // await orchestrator.createNewMigration("test-migration");

        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${privilegedUserSession.token}`,
            },
          },
        );
        expect(response1.status).toBe(201);

        const response1Body = await response1.json();

        expect(Array.isArray(response1Body)).toBe(true);
        expect(response1Body.length).toBeGreaterThan(0);
      });

      test("With `create:migration` for the second time", async () => {
        const privilegedUser = await orchestrator.createUser();
        const activatedPrivilegedUser =
          await orchestrator.activateUser(privilegedUser);

        await orchestrator.addFeaturesToUser(privilegedUser, [
          "create:migration",
        ]);

        const privilegedUserSession = await orchestrator.createSession(
          activatedPrivilegedUser.id,
        );

        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
            headers: {
              Cookie: `session_id=${privilegedUserSession.token}`,
            },
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();

        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
