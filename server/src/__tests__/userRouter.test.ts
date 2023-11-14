import testHelper from "./utils/testHelper";

const getRandomChar = () =>
  String.fromCharCode(Math.floor(Math.random() * 26) + 97);
const getRandomString = (len: number) =>
  Array.from({ length: len }, getRandomChar).join("");
const getRandomUser = () => ({
  name: getRandomString(20),
  pass: getRandomString(20),
  email: `${getRandomString(10)}@gmail.com`,
  avatar: getRandomString(10) + ".png",
});

describe("userRouter tests", () => {
  const mockUser = getRandomUser();

  afterAll(async () => {
    testHelper.cleanup();
  });

  it("should register a new user", async () => {
    console.dir(mockUser);
    const res = await testHelper.noAuthRequest(
      "post",
      "/users/register",
      mockUser
    );
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    testHelper.addCleanup("users", "user_id", res.body.userId);
  });

  it("should not register a new user with the existing name", async () => {
    const res = await testHelper.noAuthRequest("post", "/users/register", {
      ...getRandomUser(),
      name: mockUser.name,
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("User with this name already exists");
  });

  it("should not register a new user with the existing email", async () => {
    const res = await testHelper.noAuthRequest("post", "/users/register", {
      ...getRandomUser(),
      email: mockUser.email,
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("User with this email already exists");
  });

  it("should not register a new user with invalid email", async () => {
    const res = await testHelper.noAuthRequest("post", "/users/register", {
      ...getRandomUser(),
      email: "invalidEmail.com",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid email");
  });

  it("should not register a new user with invalid username", async () => {
    const res = await testHelper.noAuthRequest("post", "/users/register", {
      ...getRandomUser(),
      name: "Invalid username",
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid username");
  });

  it("should login a user", async () => {
    await testHelper.noAuthRequest("post", "/users/register", mockUser);
    const loginRes = await testHelper.noAuthRequest("post", "/users/login", {
      name: mockUser.name,
      pass: mockUser.pass,
    });
    expect(loginRes.status).toBe(200);
    // only matches jwt tokens with 2 or 3 parts
    expect(loginRes.text).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    );
  });

  it("should not login a user with invalid password", async () => {
    const newMockUser = getRandomUser();
    await testHelper.noAuthRequest("post", "/users/register", newMockUser);
    const loginRes = await testHelper.noAuthRequest("post", "/users/login", {
      name: newMockUser.name,
      pass: "invalidPassword",
    });
    expect(loginRes.status).toBe(400);
    expect(loginRes.text).toBe("Invalid password");
  });

  it("should not login a user with invalid username", async () => {
    const newMockUser = getRandomUser();
    await testHelper.noAuthRequest("post", "/users/register", newMockUser);
    const loginRes = await testHelper.noAuthRequest("post", "/users/login", {
      name: getRandomString(20),
      pass: newMockUser.pass,
    });
    expect(loginRes.status).toBe(404);
  });

  it("should update a user", async () => {
    const newMockUser = getRandomUser();
    const registerRes = await testHelper.noAuthRequest(
      "post",
      "/users/register",
      newMockUser
    );
    const newUserDetails = getRandomUser();
    let updateRes = await testHelper.authRequest(
      "put",
      `/users/${registerRes.body.userId}`,
      { body: newUserDetails, credentials: newMockUser }
    );
    expect(updateRes.status).toBe(200);

    updateRes = await testHelper.authRequest(
      "put",
      `/users/${registerRes.body.userId}`,
      { body: newMockUser, credentials: newUserDetails }
    );
    expect(updateRes.status).toBe(200);
  });

  it("should not update a user when using existing name", async () => {
    const newMockUser = getRandomUser();
    const registerRes = await testHelper.noAuthRequest(
      "post",
      "/users/register",
      newMockUser
    );
    const anotherMockUser = getRandomUser();
    await testHelper.noAuthRequest("post", "/users/register", anotherMockUser);
    const newUserDetails = { ...getRandomUser(), name: anotherMockUser.name };
    const updateRes = await testHelper.authRequest(
      "put",
      `/users/${registerRes.body.userId}`,
      { body: newUserDetails, credentials: newMockUser }
    );
    expect(updateRes.status).toBe(400);
    expect(updateRes.text).toBe("User with this name already exists");
  });

  it("should not update a user when using existing email", async () => {
    const newMockUser = getRandomUser();
    const registerRes = await testHelper.noAuthRequest(
      "post",
      "/users/register",
      newMockUser
    );
    const anotherMockUser = getRandomUser();
    await testHelper.noAuthRequest("post", "/users/register", anotherMockUser);
    const newUserDetails = { ...getRandomUser(), email: anotherMockUser.email };
    const updateRes = await testHelper.authRequest(
      "put",
      `/users/${registerRes.body.userId}`,
      { body: newUserDetails, credentials: newMockUser }
    );
    expect(updateRes.status).toBe(400);
    expect(updateRes.text).toBe("User with this email already exists");
  });

  it("should not register a user when required fields are missing", async () => {
    const incompleteUser = { name: "test", pass: "test" }; // missing email and avatar
    const res = await testHelper.noAuthRequest(
      "post",
      "/users/register",
      incompleteUser
    );
    expect(res.status).toBe(400);
  });

  it("should not login a user when the username is invalid", async () => {
    const invalidUser = { name: getRandomString(20), pass: "test" };
    const loginRes = await testHelper.noAuthRequest(
      "post",
      "/users/login",
      invalidUser
    );
    expect(loginRes.status).toBe(404);
    expect(loginRes.text).toBe("User not found");
  });

  it("should not update a user when the user is unauthorized", async () => {
    const newMockUser = getRandomUser();
    const registerRes = await testHelper.noAuthRequest(
      "post",
      "/users/register",
      newMockUser
    );
    const unauthorizedUser = getRandomUser();
    await testHelper.noAuthRequest("post", "/users/register", unauthorizedUser);
    const newUserDetails = { ...getRandomUser(), name: unauthorizedUser.name };
    const updateRes = await testHelper.authRequest(
      "put",
      `/users/${registerRes.body.userId}`,
      { body: newUserDetails, credentials: unauthorizedUser }
    );
    expect(updateRes.status).toBe(403);
    expect(updateRes.text).toBe("Unauthorized");
  });
});
