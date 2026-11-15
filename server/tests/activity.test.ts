import { beforeEach, describe, expect, it } from "bun:test";
import { createApp } from "../src/app";
import { getSessionCookie } from "./helper/auth";
import { resetTables, seedEntity } from "./helper/db";

const app = createApp();
let _cookie: string;

beforeEach(async () => {
  await resetTables();
  _cookie = await getSessionCookie();
});

describe("Activity module", () => {
  describe("Positive test", () => {
    it("Should return 200 access GET /activities all activities without filter", async () => {
      const seeds = await seedEntity();

      for (const seed of seeds) {
        const res = await app.handle(
          new Request("http://localhost:3000/api/activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: _cookie,
            },
            body: JSON.stringify({
              entityId: seed.id,
              segment: seed.segment,
              visitDate: new Date().toISOString().split("T")[0]!,
            }),
          }),
        );
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("entityName");
        expect(body.data.entityName).toBe(seed.name);
      }

      const allRes = await app.handle(
        new Request("http://localhost:3000/api/activities", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: _cookie,
          },
        }),
      );
      const allBody = await allRes.json();

      expect(allRes.status).toBe(200);
      expect(allBody).toHaveProperty("data");
      expect(allBody.data).toHaveLength(3);
    });

    it("Should return 200 access GET /activities all activities with filter", async () => {
      const seeds = await seedEntity();

      for (const seed of seeds) {
        const res = await app.handle(
          new Request("http://localhost:3000/api/activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: _cookie,
            },
            body: JSON.stringify({
              entityId: seed.id,
              segment: seed.segment,
              visitDate: new Date().toISOString().split("T")[0]!,
            }),
          }),
        );
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("entityName");
        expect(body.data.entityName).toBe(seed.name);
      }

      const allRes = await app.handle(
        new Request(
          `http://localhost:3000/api/activities?search=3&segment=B2G&status=NOT_VISITED`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: _cookie,
            },
          },
        ),
      );
      const allBody = await allRes.json();

      expect(allRes.status).toBe(200);
      expect(allBody).toHaveProperty("data");
      expect(allBody.data).toHaveLength(1);
    });

    it("Should return 201 access POST /activities using valid input", async () => {
      const seeds = await seedEntity();

      for (const seed of seeds) {
        const res = await app.handle(
          new Request("http://localhost:3000/api/activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: _cookie,
            },
            body: JSON.stringify({
              entityId: seed.id,
              segment: seed.segment,
              visitDate: new Date().toISOString().split("T")[0]!,
            }),
          }),
        );
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("entityName");
        expect(body.data.entityName).toBe(seed.name);
      }
    });

    it("Should return 200 access GET /activities/:id using exist id", async () => {
      const seeds = await seedEntity();

      const activites = [];

      for (const seed of seeds) {
        const res = await app.handle(
          new Request("http://localhost:3000/api/activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: _cookie,
            },
            body: JSON.stringify({
              entityId: seed.id,
              segment: seed.segment,
              visitDate: new Date().toISOString().split("T")[0]!,
            }),
          }),
        );
        const body = await res.json();

        activites.push(body.data);

        expect(res.status).toBe(201);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("entityName");
        expect(body.data.entityName).toBe(seed.name);
      }

      const res = await app.handle(
        new Request(`http://localhost:3000/api/activities/${activites[1].id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: _cookie,
          },
        }),
      );
      const body = await res.json();

			expect(res.status).toBe(200)
			expect(body).toHaveProperty("data")
			expect(body.data.id).toBe(activites[1].id)
    });

		it("Should return 200 access PATCH /activities/:id using exist id and valid input", async () => {
      const seeds = await seedEntity();

      const activites = [];

      for (const seed of seeds) {
        const res = await app.handle(
          new Request("http://localhost:3000/api/activities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: _cookie,
            },
            body: JSON.stringify({
              entityId: seed.id,
              segment: seed.segment,
              visitDate: new Date().toISOString().split("T")[0]!,
            }),
          }),
        );
        const body = await res.json();

        activites.push(body.data);

        expect(res.status).toBe(201);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("entityName");
        expect(body.data.entityName).toBe(seed.name);
      }

      const res = await app.handle(
        new Request(`http://localhost:3000/api/activities/${activites[1].id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: _cookie,
          },
					body: JSON.stringify({
						status: 'VISITED',
						salesName: 'Doni'
					})
        }),
      );
      const body = await res.json();

			expect(res.status).toBe(200)
			expect(body).toHaveProperty("data")
			expect(body.data.id).toBe(activites[1].id)
			expect(body.data.status).toBe("VISITED")
			expect(body.data.salesName).toBe("Doni")
    });
  });

  describe("Negative test", () => {
    it("Cannot access all activities route before login", async () => {
      const seed = await seedEntity();
      const entity = seed[0];
      const createPayload = {
        entityId: entity.id,
        segment: "B2B",
        visitDate: new Date().toISOString().split("T")[0]!,
      };
      const changePayload = {
        status: "VISITED",
      };

      const allEndpoint = await app.handle(
        new Request("http://localhost:3000/api/activities"),
      );
      const createEndpoint = await app.handle(
        new Request("http://localhost:3000/api/activities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPayload),
        }),
      );
      const getSingleEndpoint = await app.handle(
        new Request(`http://localhost:3000/api/activities/${entity.id}`),
      );
      const changeEndpoint = await app.handle(
        new Request(`http://localhost:3000/api/activities/${entity.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changePayload),
        }),
      );

      expect(allEndpoint.status).toBe(401);
      expect(getSingleEndpoint.status).toBe(401);
      expect(createEndpoint.status).toBe(401);
      expect(changeEndpoint.status).toBe(401);
    });

    it("Should return 404 accessing GET /activities/:id using invalid id", async () => {
      const res = await app.handle(
        new Request(
          `http://localhost:3000/api/activities/${crypto.randomUUID()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: _cookie,
            },
          },
        ),
      );
      const body = await res.json();

      expect(res.status).toBe(404);
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Resource not found");
    });

    it("Should return 400 accessing POST /activities using invalid input", async () => {
      const createPayload = {
        entityId: "",
        segment: "",
        visitDate: "",
      };

      const res = await app.handle(
        new Request("http://localhost:3000/api/activities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: _cookie,
          },
          body: JSON.stringify(createPayload),
        }),
      );
      const body = await res.json();

      expect(res.status).toBe(400);
      expect(body).toHaveProperty("error");
      expect(body).toHaveProperty("message");
      expect(body.error).toBe("Validation error");
      expect(body.message).toHaveLength(3);
    });

    it("Should return 404 accessing PATCH /activities/:id using not exist id", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const changePayload = {
        status: "NOT_VISITED",
      };

      const changeRes = await app.handle(
        new Request(`http://localhost:3000/api/activities/${fakeId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: _cookie,
          },
          body: JSON.stringify(changePayload),
        }),
      );
      const changeBody = await changeRes.json();

      expect(changeRes.status).toBe(404);
      expect(changeBody).toHaveProperty("error");
      expect(changeBody).toHaveProperty("message");
      expect(changeBody.error).toBe("Resource not found");
    });

    it("Should return 400 accessing PATCH /activities/:id using invalid input", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const changePayload = {
        status: "",
      };

      const changeRes = await app.handle(
        new Request(`http://localhost:3000/api/activities/${fakeId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: _cookie,
          },
          body: JSON.stringify(changePayload),
        }),
      );
      const changeBody = await changeRes.json();

      expect(changeRes.status).toBe(400);
      expect(changeBody).toHaveProperty("error");
      expect(changeBody).toHaveProperty("message");
      expect(changeBody.error).toBe("Validation error");
      expect(changeBody.message).toHaveLength(1);
    });
  });
});
