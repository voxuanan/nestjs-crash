import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
class UpdatePostDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export default UpdatePostDto;
