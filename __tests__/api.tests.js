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
describe("POST /api/trips", () => {
  it("201: creates a new trip and returns the created trip with its properties", () => {
    const newTrip = {
      trip_name: "Beach Bonanza",
      location: "Maldives",
      description: "A relaxing trip to the Maldives",
      start_date: "2024-12-01",
      end_date: "2024-12-15",
      created_by: 1,
      trip_img_url: "https://example.com/trip.jpg",
    };

    return request(app)
      .post("/api/trips")
      .send(newTrip)
      .expect(201)
      .then(({ body }) => {
        const { trip } = body;
        expect(trip).toHaveProperty("trip_id", expect.any(Number));
        expect(trip).toHaveProperty("trip_name", "Beach Bonanza");
        expect(trip).toHaveProperty("location", "Maldives");
        expect(trip).toHaveProperty(
          "description",
          "A relaxing trip to the Maldives"
        );
        expect(trip).toHaveProperty("start_date", "2024-12-01T00:00:00.000Z");
        expect(trip).toHaveProperty("end_date", "2024-12-15T00:00:00.000Z");
        expect(trip).toHaveProperty("created_by", 1);
        expect(trip).toHaveProperty("created_at", expect.any(String));
        expect(trip).toHaveProperty(
          "trip_img_url",
          "https://example.com/trip.jpg"
        );
      });
  });

  it("400: responds with an error when required fields are missing", () => {
    const incompleteTrip = {
      location: "Maldives",
      description: "Missing required fields",
    };

    return request(app)
      .post("/api/trips")
      .send(incompleteTrip)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Missing required fields: trip_name, location, start_date, created_by are mandatory"
        );
      });
  });

  it("400: responds with an error when created_by references a non-existent user", () => {
    const nonExistentUserTrip = {
      trip_name: "Non-existent User Test",
      location: "Nowhere",
      description: "Trying to create a trip with a non-existent user",
      start_date: "2024-12-01",
      end_date: "2024-12-15",
      created_by: 9999,
      trip_img_url: "https://example.com/non-existent-user-trip.jpg",
    };

    return request(app)
      .post("/api/trips")
      .send(nonExistentUserTrip)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request - User does not exist");
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
        expect(body.msg).toBe(
          "400: Bad Request - Missing required field: user_id"
        );
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
      .send({ user_id: 2 })
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
        expect(body.msg).toBe(
          "Missing required fields: trip_id and user_id are mandatory"
        );
      });
  });
});

//ACTIVITIES TESTS!!
describe("GET /api/trips/:trip_id/activities", () => {
  it("200: responds with an array of activities for the given trip_id", () => {
    return request(app)
      .get("/api/trips/1/activities")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.activities)).toBe(true);
        body.activities.forEach((activity) => {
          expect(activity).toHaveProperty("activity_id", expect.any(Number));
          expect(activity).toHaveProperty("trip_id", 1);
          expect(activity).toHaveProperty("description", expect.any(String));
          expect(activity).toHaveProperty("date", expect.any(String));
          expect(activity).toHaveProperty("time", expect.any(String));
          expect(activity).toHaveProperty(
            "activity_img_url",
            expect.any(String)
          );
          expect(activity).toHaveProperty("created_at", expect.any(String));
          expect(activity).toHaveProperty("in_itinerary", expect.any(Boolean));
          expect(activity).toHaveProperty("votes", expect.any(Number));
        });
      });
  });

  it("404: responds with an error if trip_id does not exist", () => {
    return request(app)
      .get("/api/trips/999/activities")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Trip not found");
      });
  });
});
describe("GET /api/trips/1/activities/:activity_id", () => {
  it("200: responds with the activity object for a valid activity_id", () => {
    return request(app)
      .get("/api/trips/1/activities/1")
      .expect(200)
      .then(({ body }) => {
        const { activity } = body;
        expect(activity).toEqual(
          expect.objectContaining({
            activity_id: 1,
            trip_id: expect.any(Number),
            activity_name: expect.any(String),
            description: expect.any(String),
            date: expect.any(String),
            time: expect.any(String),
            activity_img_url: expect.any(String),
            created_at: expect.any(String),
            in_itinerary: expect.any(Boolean),
            votes: expect.any(Number),
          })
        );
      });
  });

  it("404: responds with an error if activity_id does not exist", () => {
    return request(app)
      .get("/api/trips/1/activities/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Activity Not Found");
      });
  });

  it("400: responds with an error if activity_id is invalid", () => {
    return request(app)
      .get("/api/trips/1/activities/not_a_valid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});
describe("POST /api/trips/:trip_id/activities", () => {
  it("201: adds a new activity and responds with the created activity", () => {
    const newActivity = {
      activity_name: "Hiking",
      description: "Mountain hike",
      date: "2024-11-21T00:00:00.000Z",
      time: "10:00:00",
    };

    return request(app)
      .post("/api/trips/1/activities")
      .send(newActivity)
      .expect(201)
      .then(({ body }) => {
        const { activity } = body;
        expect(activity).toHaveProperty("activity_id", expect.any(Number));
        expect(activity).toHaveProperty("trip_id", 1);
        expect(activity).toHaveProperty("activity_name", "Hiking");
        expect(activity).toHaveProperty("description", "Mountain hike");
        expect(activity).toHaveProperty("date", "2024-11-21T00:00:00.000Z");

        expect(activity).toHaveProperty("time", "10:00:00");
        expect(activity).toHaveProperty("activity_img_url", expect.any(String));
        expect(activity).toHaveProperty("created_at", expect.any(String));
        expect(activity).toHaveProperty("in_itinerary", false);
        expect(activity).toHaveProperty("votes", 0);
      });
  });

  it("400: responds with an error when required fields are missing", () => {
    const invalidActivity = { description: "Incomplete data" };
    return request(app)
      .post("/api/trips/1/activities")
      .send(invalidActivity)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Missing required fields: activity_name, date are mandatory"
        );
      });
  });
});

describe("PATCH /api/trips/:trip_id/activities/:activity_id", () => {
  it("200: updates an activity and responds with the updated activity", () => {
    const updatedFields = {
      activity_name: "Updated Activity",
      description: "Updated Description",
      date: "2024-12-01T00:00:00.000Z",
      time: "15:00:00",
    };

    return request(app)
      .patch("/api/trips/1/activities/1")
      .send(updatedFields)
      .expect(200)
      .then(({ body }) => {
        const { activity } = body;
        expect(activity).toHaveProperty("activity_id", 1);
        expect(activity).toHaveProperty("trip_id", 1);
        expect(activity).toHaveProperty("activity_name", "Updated Activity");
        expect(activity).toHaveProperty("description", "Updated Description");
        expect(activity).toHaveProperty("date", "2024-12-01T00:00:00.000Z");
        expect(activity).toHaveProperty("time", "15:00:00");
        expect(activity).toHaveProperty("activity_img_url", expect.any(String));
        expect(activity).toHaveProperty("created_at", expect.any(String));
        expect(activity).toHaveProperty("in_itinerary", expect.any(Boolean));
        expect(activity).toHaveProperty("votes", expect.any(Number));
      });
  });

  it("404: responds with an error if the activity_id does not exist", () => {
    const updatedFields = {
      activity_name: "Nonexistent",
      date: "2024-12-01T00:00:00.000Z",
      time: "15:00:00",
    };

    return request(app)
      .patch("/api/trips/1/activities/999")
      .send(updatedFields)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Activity not found");
      });
  });

  it("400: responds with an error when no fields are provided for update", () => {
    return request(app)
      .patch("/api/trips/1/activities/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("DELETE /api/trips/:trip_id/activities/:activity_id", () => {
  it("200: deletes an activity and responds with a success message", () => {
    return request(app)
      .delete("/api/trips/1/activities/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe("Activity deleted successfully");
      });
  });

  it("404: responds with an error if the activity_id does not exist", () => {
    return request(app)
      .delete("/api/trips/1/activities/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Activity not found");
      });
  });

  it("400: responds with an error if activity_id is invalid", () => {
    return request(app)
      .delete("/api/trips/1/activities/not_a_valid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
});

describe("GET /api/trips/:trip_id/activities/itinerary", () => {
  it("200: returns an array of activities that are in the itinerary", () => {
    return request(app)
      .get("/api/trips/1/activities/itinerary")
      .expect(200)
      .then(({ body }) => {
        const { activities } = body;
        expect(Array.isArray(activities)).toBe(true);
        activities.map((activity) => {
          expect(activity.in_itinerary).toBe(true);
        });
      });
  });
  it("400: responds with an error if trip_id is invalid", () => {
    return request(app)
      .get("/api/trips/not_a_valid_id/activities/itinerary")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("404: responds with an error if trip_id is valid but does not exist", () => {
    return request(app)
      .get("/api/trips/9999/activities/itinerary")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});

describe("GET /api/trips/:trip_id/activities/possibility", () => {
  it("200: returns an array of activities that are in the itinerary", () => {
    return request(app)
      .get("/api/trips/1/activities/possibility")
      .expect(200)
      .then(({ body }) => {
        const { activities } = body;
        expect(Array.isArray(activities)).toBe(true);
        activities.map((activity) => {
          expect(activity.in_itinerary).toBe(false);
        });
      });
  });
  it("400: responds with an error if trip_id is invalid", () => {
    return request(app)
      .get("/api/trips/not_a_valid_id/activities/possibility")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad Request");
      });
  });
  it("404: responds with an error if trip_id is valid but does not exist", () => {
    return request(app)
      .get("/api/trips/9999/activities/possibility")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });
});
describe("GET /api/users/email/:email", () => {
  it("200: returns the user ID when a valid email is provided", () => {
    return request(app)
      .get("/api/users/email/abdiaziz@northcoders.co.uk") 
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          userId: {
            user_id: expect.any(Number), 
          },
        });
      });
  });

  it("404: responds with an error when the email does not exist", () => {
    return request(app)
      .get("/api/users/by-email/nonexistent@example.com")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Not Found");
      });
  });

});
