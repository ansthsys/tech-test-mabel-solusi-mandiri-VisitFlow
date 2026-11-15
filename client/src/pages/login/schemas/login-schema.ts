import { requiredString } from "@helpers/form-schemas-validators";
import { z } from "zod";

export const loginSchema = z.object({
  username: requiredString("Email is required!"),
  password: requiredString("Password is required!"),
});
