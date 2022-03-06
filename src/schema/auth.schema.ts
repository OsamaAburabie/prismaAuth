import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    })
      .min(3, "First name must be at least 3 characters long")
      .max(50, "First name must be less than 50 characters long"),
    lastName: string({
      required_error: "Last name is required",
    })
      .min(3, "Last name must be at least 3 characters long")
      .max(50, "Last name must be less than 50 characters long"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password is too short - should be min 6 chars"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),
});

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email or password"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Invalid email or password"),
  }),
});

export const refreshTokenSchema = object({
  body: object({
    refreshToken: string({
      required_error: "Refresh token is required",
    }).nonempty("Refresh token is required"),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type RefreshTokenInput = TypeOf<typeof refreshTokenSchema>["body"];
