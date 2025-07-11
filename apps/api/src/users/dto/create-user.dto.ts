import {IsNotEmpty, IsOptional, IsString, MinLength, IsPhoneNumber} from 'class-validator';

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsString()
    @IsOptional()
    email?: string;

}
