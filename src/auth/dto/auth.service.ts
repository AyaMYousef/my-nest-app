import { User, UserDocument, UserModel } from './../../DB/models/user.model';
import { InjectModel } from "@nestjs/mongoose";
import { ConflictException, Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import * as signupDto from "./signup.dto";
import { hash } from 'src/common/utils/security/hash.utils';
import { emailEvent } from 'src/common/utils/events/email.event';

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
}