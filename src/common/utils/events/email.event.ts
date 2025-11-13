import { EmailSubjectEnum } from './../../enums/user.enum';
import { EventEmitter } from "node:events";
import Mail from 'nodemailer/lib/mailer';
import { sendEmail } from "../email/send.email";



export const emailEvent = newEmitter();

interface IEmail extends Mail.Options {
    opt:string;
    username: string;

}


emailEvent.on('confirmEmail', async(date:IEmail) =>{
    try{
       await sendEmail(data);
    }
    catch(error){
       console.error(`Fail to send Email`, error)
    }
})

function newEmitter() {
    throw new Error('Function not implemented.');
}
