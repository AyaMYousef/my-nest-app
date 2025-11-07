import { User, UserDocument, UserModel } from './../../DB/models/user.model';
import { InjectModel } from "@nestjs/mongoose";
import { ConflictException, Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import * as signupDto from "./signup.dto";

@Injectable()
export class AuthService{
    constructor(@InjectModel(User.name) private readonly UserModel:Model<UserDocument>){}

    async signup(signupDTO: signupDto.SignupDto){

        const {username,email, password} = signupDTO

        const checkUser = await this.UserModel.findOne({email});
        if(checkUser) throw new ConflictException('User Already Exist');
        
        const user = await this.UserModel.create({username, email, password}) || [];


        return {message: 'User Registered Successfully', user}
    }
}