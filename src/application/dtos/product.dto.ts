import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
