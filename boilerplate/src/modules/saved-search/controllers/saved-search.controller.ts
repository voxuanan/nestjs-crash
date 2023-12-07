import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SavedSeachConsumer } from '../processors/saved-search.procesor';

@ApiTags('common.public.saved-search')
@Controller({
    version: '1',
    path: '/saved-search',
})
export class SavedSearchController {
    constructor(private readonly savedSeachConsumer: SavedSeachConsumer) {}

    @Get('match')
    async savedSearchMatchingProperties() {
        this.savedSeachConsumer.savedSearchNewMatching({
            limit: 100,
            offset: 0,
            setLastRun: true,
        });
    }
}
