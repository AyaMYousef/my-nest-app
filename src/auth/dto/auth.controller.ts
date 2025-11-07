import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { signupSchema } from "./signup.dto";
import type { SignupDto } from "./signup.dto";
import { ZodValidationPipe } from "@anatine/zod-nestjs";

@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signupSchema as any))
  @Post("/signup")
  signup(@Body() signUpDTO: SignupDto) {
    return this.authService.signup(signUpDTO);
  }
}
