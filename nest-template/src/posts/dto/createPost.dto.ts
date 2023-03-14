import { IsString, IsNotEmpty } from 'class-validator';
class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export default CreatePostDto;
