
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { Observable } from "rxjs";
import { User, UserDocument } from "src/DB/models/user.model";


@Injectable()

export class AuthGuard implements CanActivate{

    constructor(
        private jwtService: JWTService,
        @Injectable(User.name) private readonly userModel: Model<UserDocument>,
        
    ){}
   async canActivate(context: ExecutionContext): 
    Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if(!authHeader && !authHeader.startWith('Bearer'))
            throw new UnauthorizedException('Missing Authorization Header {arts')

        const token = authHeader.split(' ')[1];
        if(!token) throw new UnauthorizedException('Invalid Token Format');

        const payload = this.jwtService.verify(token,{
            secret: process.env.ACCESS_SECRET_KEY,
        });

        const user = await this.userModel.findById(payload.id);
        if(!user) throw new NotFoundException('User not Found')

            request.user = user;
        return true;
    }

}