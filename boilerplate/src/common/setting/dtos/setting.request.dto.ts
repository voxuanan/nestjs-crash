import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class SettingRequestDto {
    @IsNotEmpty()
    @Type(() => String)
    setting: string;
}
