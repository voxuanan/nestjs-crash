import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Readable } from 'stream';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { QueueJob, Queue_Enum } from 'src/common/enums/queue.enum';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadMutipleFileDto } from 'src/utils/dto/UploadMutipleFile.dto';

@Controller('optimize')
export class OptimizeController {
  constructor(
    @InjectQueue(Queue_Enum.ImageQueue) private readonly imageQueue: Queue,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload File',
    type: UploadMutipleFileDto,
    required: true,
  })
  @Post('image')
  @UseInterceptors(AnyFilesInterceptor())
  async processImage(@UploadedFiles() files: Express.Multer.File[]) {
    const job = await this.imageQueue.add(
      QueueJob.ImageQueueOptimizeJob,
      {
        files,
      },
      {
        removeOnFail: true,
      },
    );

    return {
      jobId: job.id,
    };
  }

  @Get('image/:id')
  async getJobResult(@Res() response: Response, @Param('id') id: string) {
    const job = await this.imageQueue.getJob(id);

    if (!job) {
      return response.sendStatus(404);
    }

    const isCompleted = await job.isCompleted();

    if (!isCompleted) {
      return response.sendStatus(202);
    }

    const result = Buffer.from(job.returnvalue);

    const stream = Readable.from(result);

    stream.pipe(response);
  }
}
