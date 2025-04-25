import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(4, "username must at least contain 4 characters")
	.max(20, "username must not contain more than 20 characters")
	.regex(/^[a-zA-Z0-9\s]*$/, "Username must not contain special characters");

export const passwordValidation = z
	.string()
	.min(8, { message: "Password must contain atleast 8 characters" })
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[\S]{8,}$/, {
		message:
			"password must contain at least one uppercase, lowercase, special character and number",
	});

export const signUpSchema = z.object({
	username: usernameValidation,
	email: z.string().email({ message: "Invalid email" }),
	password: z
		.string()
		.min(8, { message: "Password must contain atleast 8 characters" })
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[\S]{8,}$/, {
			message:
				"password must contain at least one uppercase, lowercase, special character and number",
		}),
	fullName: z.string().min(6, "fullName should have aleast 6 characters"),
});

// const user = {
// 	username: "surajgorai",
// 	email: "surajgorai@gmail.com",
// 	password: "sdfjhsdfe#dD234",
// 	fullName: "suraj gorai",
// };

// const validate = signUpSchema.safeParse(user)

export const loginSchema = z
	.object({
		username: usernameValidation.optional(),
		email: z.string().email({ message: "Invalid email" }).optional(),
		password: passwordValidation,
	})
	.refine((data) => data.username || data.email, {
		message: "Either username or email is required",
		path: ["username"], // Show error near "username"
	});
