import z from "zod";

const FIELD_REQUIRED_STR = "This field is required";

export const singUpFormSchema = z.object({
  username: z
    .string({
      invalid_type_error: "Username must be a string",
      required_error: FIELD_REQUIRED_STR,
    })
    .min(5, "Username must be at least 5 characters long")
    .max(50, "Username must be at most 100 characters long")
    .trim(),
  name: z.object({
    firstName: z
      .string({
        invalid_type_error: "First name must be a string",
        required_error: FIELD_REQUIRED_STR,
      })
      .min(2, "First name must be at least 2 characters long")
      .max(70, "First name must be at most 50 characters long")
      .trim(),
    lastName: z
      .string({
        invalid_type_error: "Last name must be a string",
        required_error: FIELD_REQUIRED_STR,
      })
      .min(2, "Last name must be at least 2 characters long")
      .max(70, "Last name must be at most 50 characters long")
      .trim(),
  }),
  email: z
    .string({
      invalid_type_error: "Email must be a string",
      required_error: FIELD_REQUIRED_STR,
    })
    .email("Invalid email address"),
  dateOfBirth: z
    .date({
      invalid_type_error: "Date of birth must be a date",
      required_error: FIELD_REQUIRED_STR,
    })
    .min(new Date(1900, 1, 1), "Invalid date of birth")
    .max(new Date(), "Invalid date of birth")
    .default(new Date()),
  password: z
    .object({
      password: z
        .string({
          invalid_type_error: "Password must be a string",
          required_error: FIELD_REQUIRED_STR,
        })
        .min(5, "Password must be at least 5 characters long")
        .trim()
        .default(""),
      confirmPassword: z
        .string({
          invalid_type_error: "Confirm password must be a string",
          required_error: FIELD_REQUIRED_STR,
        })
        .min(5, "Confirm password must be at least 5 characters long")
        .trim()
        .default(""),
      // take the shape of the image picker asset
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
  profilePicture: z.object({
    uri: z.string(),
    assetId: z.string().optional().nullable(),
    width: z.number().optional(),
    height: z.number().optional(),
    type: z.string().optional().nullable(),
    base64: z.string().optional().nullable(),
    fileName: z.string().optional().nullable(),
    fileSize: z.number().optional().nullable(),
    duration: z.number().optional().nullable(),
  }),
});

export type SignUpFormValues = z.infer<typeof singUpFormSchema>;
