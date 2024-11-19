const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

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

// USERS
describe("GET /api/users", () => {
  it("returns an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        body.forEach((user) => {
          expect(user).toHaveProperty("name", expect.any(String));
          expect(user).toHaveProperty("email", expect.any(String));
          expect(user).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });
});

describe("GET /api/users/user_id", () => {
  it("returns a single user object based on their email", () => {
    return request(app)
      .get("/api/users/1")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toBeInstanceOf(Object);
        expect(user.user_id).toBe(1);
        expect(user.name).toBe("Abdiaziz");
        expect(user.avatar_url).toBe(
          "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        );
      });
  });
  it("returns an appropriate error status and message when provided an invalid user_id", () => {
    return request(app)
      .get("/api/users/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: User Not Found");
      });
  });
});

describe("POST /api/users", () => {
  it("201: creates a new user and returns the created user", () => {
    const newUser = {
      username: "new_user",
      email: "newuser@email.com",
      name: "New User",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            email: "newuser@email.com",
            name: "New User",
          })
        );
      });
  });

  it("400: returns an error if required fields are missing", () => {
    const incompleteUser = {
      username: "incomplete_user",
    };

    return request(app)
      .post("/api/users")
      .send(incompleteUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

// TRIPS
describe("GET /api/trips", () => {
  it("return an array of trips object", () => {
    return request(app)
      .get("/api/trips")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        body.forEach((trip) => {
          expect(trip).toHaveProperty("trip_name", expect.any(String));
          expect(trip).toHaveProperty("location", expect.any(String));
          expect(trip).toHaveProperty("description", expect.any(String));
          expect(trip).toHaveProperty("start_date", expect.any(String));
        });
      });
  });
});

describe("GET /api/trips/trip_id", () => {
  it("returns a single user object based a trip id", () => {
    return request(app)
      .get("/api/trips/1")
      .expect(200)
      .then(({ body }) => {
        const { trip } = body;
        expect(trip).toBeInstanceOf(Object);
        expect(trip.trip_name).toBe("Barbados 2024");
        expect(trip.location).toBe("Barbados");
        expect(trip.description).toBe("Silent Assassin");
        expect(trip.start_date).toBe("2022-02-02T00:00:00.000Z");
        expect(trip.trip_img_url).toBe(null);
      });
  });
});
