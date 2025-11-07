import {MongooseModule, Prop, Schema, SchemaFactory, Virtual} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GenderEnum, ProviderEnum } from 'src/common/enums/user.enum';


@Schema({
    timestamps:true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
})

export class User{

    
    @Prop({
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        trim: true,
    })
    firstName: string;

     @Prop({
        type: String,
        required: true,
        minLength: 2,
        maxLength: 20,
        trim: true,
    })
    lastName: string;

    @Virtual({
        get: function(){
            return this.firstName + ' ' + this.lastName;
        },
        set: function( value){
            const[firstName, lastName] = value.split(' ') || [];
            this.set({firstName, lastName});
        },
    })
    username: string;

    @Prop({
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    })
    email: string

       @Prop({
        type: Date,
       
    })
    confirmemail: Date;
    confirmEmailOTP: string
@Prop({
    type:String,
    required: function(){
        return this.provider === ProviderEnum.GOOGLE?false:true;
    },
})
password: string


@Prop({
    type: String,
    enum:{
        values: Object.values(ProviderEnum),
        message: '{VALUE} is not a valid provider',
    },
    default: ProviderEnum.SYSTEM
})
provider: string;
@Prop({
    type:String,
})
phone: string;

@Prop({
    type: String,
    enum:{
        values: Object.values(GenderEnum),
        message: '{VALUE} is not a valid Gender',
    },
    default: ProviderEnum.FEMALE,
})
gender: string;

}


export const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;


export const UserModel = MongooseModule.forFeature([
    {name: User.name, schema: userSchema},
]);