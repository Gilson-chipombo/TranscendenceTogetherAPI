import { IsString } from "class-validator";

export class SendDmDto {

  @IsString()
  senderId: string;

  @IsString()
  receiverId: string;

  @IsString()
  content: string;

}