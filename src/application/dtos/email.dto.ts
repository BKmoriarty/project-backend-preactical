import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Recipient email is required' })
  to: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject is required' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: 'Body is required' })
  body: string;
}
