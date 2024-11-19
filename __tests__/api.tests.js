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
  it("200: returns 200 and the JSON of all available endpoints", () => {
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
  it("200: returns an array of user objects", () => {
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
  it("200: returns a single user object based on their email", () => {
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
  it("404: returns an appropriate error status and message when provided an invalid user_id", () => {
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

describe("PATCH /api/users/:user_id", () => {
  it("201: return an updated user object", () => {
    const updateUser = {
      name: "Adam",
      avatar_url:
        "https://img.freepik.com/free-photo/beach-surrounded-by-sea-greenery-sunlight-blue-sky-praslin-seychelles_181624-18574.jpg?t=st=1732010812~exp=1732014412~hmac=72c6680cdcfc9849980e4ee7e4aae8019788e2a000fadf09fadcc8dc7b82d091&w=1380",
    };

    return request(app)
      .patch("/api/users/2")
      .send(updateUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.user.name).toBe("Adam");
        expect(body.user.avatar_url).toBe(
          "https://img.freepik.com/free-photo/beach-surrounded-by-sea-greenery-sunlight-blue-sky-praslin-seychelles_181624-18574.jpg?t=st=1732010812~exp=1732014412~hmac=72c6680cdcfc9849980e4ee7e4aae8019788e2a000fadf09fadcc8dc7b82d091&w=1380"
        );
        expect(body.user.user_id).toBe(2);
        expect(body.user.email).toBe("jasmine@northcoders.co.uk");
      });
  });
  it("400: responds with appropiate status and error message when provided with a body with invalid fields", () => {
    return request(app)
      .patch("/api/users/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("400: responds with appropriate status and error message when provided with a valid body with invalid values", () => {
    const updatedUser = {
      name: 54,
      avatar: 64,
    };

    return request(app)
      .patch("/api/users/2")
      .send(updatedUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("404: responds with an appropriate status and error message when provided a valid user id that does not exist", () => {
    const updateUser = {
      name: "Adam",
      avatar_url:
        "https://img.freepik.com/free-photo/beach-surrounded-by-sea-greenery-sunlight-blue-sky-praslin-seychelles_181624-18574.jpg?t=st=1732010812~exp=1732014412~hmac=72c6680cdcfc9849980e4ee7e4aae8019788e2a000fadf09fadcc8dc7b82d091&w=1380",
    };

    return request(app)
      .patch("/api/users/9999")
      .send(updateUser)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: User Not Found");
      });
  });
  it("400: responds with an appropriate status and error message when provided an invalid user id", () => {
    const updateUser = {
      name: "Adam",
      avatar_url:
        "https://img.freepik.com/free-photo/beach-surrounded-by-sea-greenery-sunlight-blue-sky-praslin-seychelles_181624-18574.jpg?t=st=1732010812~exp=1732014412~hmac=72c6680cdcfc9849980e4ee7e4aae8019788e2a000fadf09fadcc8dc7b82d091&w=1380",
    };

    return request(app)
      .patch("/api/users/not_a_valid_id")
      .send(updateUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("DELETE /api/users/:user_id", () => {
  it("204: Response with no content", () => {
    return request(app).delete("/api/users/1").expect(204);
  });
  it("400: responds with an appropriate status and error message when provided an invalid user id", () => {
    return request(app)
      .delete("/api/users/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("404: responds with an appropriate status and error message when provided a valid user id that does not exist", () => {
    return request(app)
      .delete("/api/users/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
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
  it("200: returns a single user object based a trip id", () => {
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

describe("GET /api/trips/:trip_id/members", () => {
  it("200: returns an array of members for a valid trip ID", () => {
    return request(app)
      .get("/api/trips/1/members")
      .expect(200)
      .then(({ body }) => {
        const { members } = body;
        expect(Array.isArray(members)).toBe(true);
        members.forEach((member) => {
          expect(member).toHaveProperty("trip_member_id", expect.any(Number));
          expect(member).toHaveProperty("user_id", expect.any(Number));
          expect(member).toHaveProperty("is_admin", expect.any(Boolean));
          expect(member).toHaveProperty("name", expect.any(String));
          expect(member).toHaveProperty("avatar_url", expect.any(String));
        });
      });
  });

  it("404: responds with an error when trip ID does not exist", () => {
    return request(app)
      .get("/api/trips/999/members")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Trip not found");
      });
  });
});

describe("POST /api/trips/:trip_id/members", () => {
  it("201: adds a user to the trip and returns the new member", () => {
    const newMember = { user_id: 3 };

    return request(app)
      .post("/api/trips/1/members")
      .send(newMember)
      .expect(201)
      .then(({ body }) => {
        const { member } = body;
        expect(member).toEqual(
          expect.objectContaining({
            trip_member_id: expect.any(Number),
            trip_id: 1,
            user_id: 3,
            is_admin: false,
          })
        );
      });
  });

  it("400: responds with an error when user_id is missing", () => {
    return request(app)
      .post("/api/trips/1/members")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request - Missing required field: user_id");
      });
  });

  it("404: responds with an error when trip ID does not exist", () => {
    const newMember = { user_id: 3 };

    return request(app)
      .post("/api/trips/999/members")
      .send(newMember)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Trip or User Not Found");
      });
  });
});

describe("DELETE /api/trips/:trip_id/members with a body of user_id", () => {
  it("200: removes a user from the trip and responds with a success message", () => {
    return request(app)
      .delete("/api/trips/1/members")
      .send({user_id: 2})
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("User Was Removed From The Trip");
      });
  });

  it("404: responds with an error when trip ID or user ID does not exist", () => {
    return request(app)
      .delete("/api/trips/999/members")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields: trip_id and user_id are mandatory");
      });
  });
});
