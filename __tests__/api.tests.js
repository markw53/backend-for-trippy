const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

describe("GET /api", () => {
    it("returns 200 and the JSON of all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints);
        });
    });
  });