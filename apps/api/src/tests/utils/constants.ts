export const TEST_EMAIL_TEMPLATE = "test-user+x@gmail.com";
export const TEST_PASSWORD_TEMPLATE = "PasswordX";

export const createTestEmail = (x: string) => TEST_EMAIL_TEMPLATE.replace("x", x);

export const createTestPassword = (x: string) => TEST_PASSWORD_TEMPLATE.replace("X", x);

export const createTestCredentials = (x: string) => ({
	email: createTestEmail(x),
	password: createTestPassword(x),
});
