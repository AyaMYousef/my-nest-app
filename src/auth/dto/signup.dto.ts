import { GenderEnum, ProviderEnum, RoleEnum } from "src/common/enums/user.enum";
import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(2).max(20).optional(),
  lastName: z.string().min(2).max(20).optional(),
  username: z.string().min(2).max(45),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  role: z.nativeEnum(RoleEnum).optional(),
  gender: z.nativeEnum(GenderEnum).optional(),
  provider: z.nativeEnum(ProviderEnum).optional(),
  phone: z.string().optional(),
}).refine((data)=>data.password !== data.confirmPassword,{
    message:'Password and confirm password doesnt match',
    path:['confirmPassword'],
})


export type SignupDto = z.infer<typeof signupSchema>;
