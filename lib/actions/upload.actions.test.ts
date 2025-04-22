import { deleteFile } from "../actions/upload.actions";
import { createPresignedDeleteURL } from "../s3";
import { db } from "../../database/drizzle";
import { attestations } from "../../database/schema";
import { and, eq } from "drizzle-orm";

jest.mock("../s3", () => ({
  createPresignedDeleteURL: jest.fn(),
}));

jest.mock("../../database/drizzle", () => ({
  db: {
    delete: jest.fn().mockReturnThis(),
  },
}));

describe("deleteFile", () => {
  const mockUserId = "test-user-id";
  const mockFileName = "test-file.txt";
  const mockPresignedURL = "https://example.com/delete-url";

  beforeEach(() => {
    jest.clearAllMocks();
    (createPresignedDeleteURL as jest.Mock).mockResolvedValue(mockPresignedURL);
  });

  it("should delete a file successfully", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock;

    await deleteFile(mockFileName);

    expect(createPresignedDeleteURL).toHaveBeenCalledWith({
      bucket: expect.any(String),
      key: `${mockUserId}/${mockFileName}`,
    });
    expect(fetchMock).toHaveBeenCalledWith(mockPresignedURL, {
      method: "DELETE",
    });
  });

  it("should throw an error if the file deletion fails", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: false });
    global.fetch = fetchMock;

    await expect(deleteFile(mockFileName)).rejects.toThrow(
      "Failed to delete file"
    );

    expect(createPresignedDeleteURL).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalled();
    expect(db.delete).not.toHaveBeenCalled();
  });

  it("should throw an error if the database deletion fails", async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock;
    (db.delete as jest.Mock).mockReturnValueOnce(null);

    await expect(deleteFile(mockFileName)).rejects.toThrow(
      "Failed to delete file from database"
    );

    expect(createPresignedDeleteURL).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalled();
    expect(db.delete).toHaveBeenCalled();
  });
});
