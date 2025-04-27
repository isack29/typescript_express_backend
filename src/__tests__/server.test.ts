import { connectDB } from "../server";
import db from "../config/db";

jest.mock("../config/db");

describe("ConnectDB", () => {
  it("should handle database connection error", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValue(new Error("Error en conexión a la base de datos"));
    const consoleSpy = jest.spyOn(console, "log");
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error en conexión a la base de datos")
    );
  });
});
