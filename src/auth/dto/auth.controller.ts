import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { confirmEmailSchema, loginSchema, signupSchema } from "./signup.dto";
import type {  LoginDTO, ResendDTO, SignupDto } from "./signup.dto";
import { ZodValidationPipe } from "@anatine/zod-nestjs";

@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ZodValidationPipe(signupSchema as any))
  @Post("/signup")
  signup(@Body() signUpDTO: SignupDto) {
    return this.authService.signup(signUpDTO);
  }

  @UsePipes(new ZodValidationPipe(resendOtpSchema))
  @Post('/resend-otp')
  resendOtp(@Body() resendOtp:ResendDTO){
    return this.authService.resendOtp(resendOtp);
  }

  @UsePipes(new ZodValidationPipe(confirmEmailSchema))
  @Patch('/confirm-email')
  confirmEmail(@Body() confirmEmail: ConfirmEmailDTO){
    return this.authService.confirmEmail(confirmEmail);
  }

  @UsePipes(new ZodValidationPipe(loginSchema))
  @Post('/login')
  login(@Body() loginDto: LoginDTO){
    return this.authService.login(loginDto);
  }

  @Get('/profile')
  profile(@Req() req: any){
    return this.authService.getProfile(profile)
  }
}
