import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "MONITOR CURVO - TEST",
      price: -2200,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("should validate that the price is a number and greather than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "MONITOR CURVO - TEST",
      price: "Hola",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "MOUSE - TESTING",
      price: 50,
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products", () => {
  it("Should check if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
  });
  it("GET a Json response with products", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveLength(1);

    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("GET /api/products/:id", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 10213;
    const response = await request(server).get(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Producto no encontrado");
  });

  it("Should ckeck a valid ID in the url", async () => {
    const response = await request(server).get(`/api/products/not-valid-url`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no válido");
  });

  it("get a JSON response for a single product ", async () => {
    const response = await request(server).get(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT api/products/:id", () => {
  it("Should ckeck a valid ID in the url", async () => {
    const response = await request(server)
      .put(`/api/products/not-valid-url`)
      .send({
        name: "Monitor Curvo",
        availability: true,
        price: 300,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Id no válido");
  });

  it("Should display validation error messages when updating a product", async () => {
    const respose = await request(server).put("/api/products/1").send({});

    expect(respose.status).toBe(400);
    expect(respose.body).toHaveProperty("errors");
    expect(respose.body.errors).toBeTruthy();
    expect(respose.body.errors).toHaveLength(5);
    expect(respose.status).not.toBe(200);
    expect(respose.body).not.toHaveProperty("data");
  });

  it("Should validate that the price is greater than 0 ", async () => {
    const respose = await request(server).put("/api/products/1").send({
      name: "Monitor Curvo",
      availability: true,
      price: -300,
    });

    expect(respose.status).toBe(400);
    expect(respose.body).toHaveProperty("errors");
    expect(respose.body.errors).toBeTruthy();
    expect(respose.body.errors).toHaveLength(1);
    expect(respose.body.errors[0].msg).toBe("Precio no válido");
    expect(respose.status).not.toBe(200);
    expect(respose.body).not.toHaveProperty("data");
  });

  it("Should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const respose = await request(server)
      .put(`/api/products/${productId}`)
      .send({
        name: "Monitor Curvo",
        availability: true,
        price: 300,
      });

    expect(respose.status).toBe(404);
    expect(respose.body.error).toBe("Producto no encontrado");

    expect(respose.status).not.toBe(200);
    expect(respose.body).not.toHaveProperty("data");
  });

  it("Should update an existing product with valid data", async () => {
    const respose = await request(server).put(`/api/products/1`).send({
      name: "Monitor Curvo",
      availability: true,
      price: 300,
    });

    expect(respose.status).toBe(200);
    expect(respose.body).toHaveProperty("data");

    expect(respose.status).not.toBe(400);
    expect(respose.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/products/:id", () => {
  it("should return a 404 response for a non-existing product", async () => {
    const productId = 123134;
    const response = await request(server).patch(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto no encontrado");
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should update the product availabiliy", async () => {
    const response = await request(server).patch(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("error");
  });
});
describe("DELETE /api/products/:id", () => {
  it("should check a valid ID", async () => {
    const response = await request(server).delete("/api/products/non-valid");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Id no válido");
  });

  it("should return a 404 response for a non-existent product", async () => {
    const productId = 2000;
    const response = await request(server).delete(`/api/products/${productId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Producto no encontrado");
    expect(response.status).not.toBe(200);
  });

  it("should delete a product", async () => {
    const response = await request(server).delete(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body.data).toBe("Producto eliminado");
    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });
});

