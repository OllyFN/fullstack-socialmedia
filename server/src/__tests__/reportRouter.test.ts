import testHelper from "./utils/testHelper";

describe("reportRouter tests", () => {
  afterEach(async () => {
    testHelper.cleanup();
  });

  it("should create a new report", async () => {
    const res = await testHelper.authRequest("post", "/report/post/1", {
      body: { reason: "This is a test report" },
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("reportId");
    testHelper.addCleanup("reports", "report_id", res.body.reportId);
  });

  it("should return 404 if the post does not exist", async () => {
    const res = await testHelper.authRequest("post", "/report/post/invalidId", {
      body: { reason: "This is a test report" },
    });
    expect(res.status).toBe(404);
  });

  it("should return 400 if reason is missing", async () => {
    const res = await testHelper.authRequest("post", "/report/post/1", {});
    expect(res.status).toBe(400);
    expect(res.text).toBe("Reason is required");
  });

  it("should return 401 if the user is a guest", async () => {
    const res = await testHelper.noAuthRequest("post", "/report/post/1", {
      body: { reason: "This is a test report" },
    });
    expect(res.status).toBe(401);
    expect(res.text).toBe("You must be logged in to do that");
  });

  it("should return 404 if id contains non-digit characters", async () => {
    const res = await testHelper.authRequest("post", "/report/post/invalidId", {
      body: { reason: "This is a test report" },
    });
    expect(res.status).toBe(404);
    expect(res.text).toBe("ID must be a string of digits");
  });

  it("should return 404 if type is neither 'post' nor 'comment'", async () => {
    const res = await testHelper.authRequest("post", "/report/invalidType/1", {
      body: { reason: "This is a test report" },
    });
    expect(res.status).toBe(404);
  });
});
