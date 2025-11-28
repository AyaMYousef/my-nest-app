import { User, UserDocument, UserModel } from './../../DB/models/user.model';
import { InjectModel } from "@nestjs/mongoose";
import { BadGatewayException, ConflictException, Get, Injectable, NotFoundException, Req, UseGuards } from "@nestjs/common";
import { Model } from 'mongoose';
import * as signupDto from "./signup.dto";
import { compare, hash } from 'src/common/utils/security/hash.utils';
import { emailEvent } from 'src/common/utils/events/email.event';
import { ProviderEnum } from 'src/common/enums/user.enum';
import { randomUUID } from 'crypto';
import { AuthGuard } from 'src/guards/auth.guard';

@Injectable()
export class AuthService{
    constructor(@InjectModel(User.name) private readonly UserModel:Model<UserDocument>){}

    async signup(signupDTO: signupDto.SignupDto){

        const {username,email, password} = signupDTO

        const checkUser = await this.UserModel.findOne({email});
        if(checkUser) throw new ConflictException('User Already Exist');
        
         const hashedPassword = await hash({ plaintext: password });

    
    const user = await this.UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    emailEvent.emit("confirmEmail",{to:email, otp:'232324',username})
        return {message: 'User Registered Successfully', user}
    }

    async login(loginDto: signupDto.LoginDTO){
        
        const {email, password} = loginDto
        const user = await this.UserModel.findOne({
            email,
            confirmEmail: {$exists: true},
            provider: ProviderEnum.SYSTEM,
        });
        if(!user) throw new NotFoundException('User Not Found');

        if(!(await compare({plaintext:password, hash:user.password})))
            throw new BadGatewayException(`Invalid Email or Password`);

        const jwtid = randomUUID()
        const accessToken = await this.jwtService.sign({
            id: user._id,
            email: user.email,
        },
        {
            secret: process.env.ACCESS_SECRET_KEY,
            expiresIn: Number(process.env.ACCESS_EXPIRES_IN as string),
            jwtid
        },
    
    );
    const refreshToken = await this.jwtService.sign(
        {
            id: user._id,
            email: user.email,
        },
        {
            secret: process.env.REFRESH_SECRET_KEY,
            expiresIn : Number(process.env.REFRESH_EXPIRES_IN as string),
            jwtid,
        },
    );

    return {
        message: 'User Confirmed Successfully',
        credential: { accessToken, refreshToken},
    };
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    profiles(@Req() req:any){
        return this.authService.getProfile(req);
    }

  
}