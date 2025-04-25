import { z } from "zod";

export const tagValidation = z.array(
	z.string().min(3, "Minimum length of the tag should be 3")
);