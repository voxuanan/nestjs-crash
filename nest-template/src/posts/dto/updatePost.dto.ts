import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
class UpdatePostDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString({ each: true })
  @IsOptional()
  paragraphs: string[];

  @IsString()
  @IsOptional()
  title: string;
}

export default UpdatePostDto;
