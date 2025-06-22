import { IsEmail, IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

// Data validation DTOs
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}

// Data Serialization DTOs
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
