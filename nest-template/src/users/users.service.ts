import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './entity/user.entity';
import CreateUserDto from './dto/createUser.dto';
import Address from './entity/address.entity';
import PrivateFile from './entity/privateFile.entity';
import axios from 'axios';
import { Readable } from 'stream';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(PrivateFile)
    private privateFilesRepository: Repository<PrivateFile>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getAllAddressesWithUsers() {
    return this.addressRepository.find({ relations: ['user'] });
  }

  async createFilePrivate(assetId: string, publicId: string, userId: number) {
    const newFile = this.privateFilesRepository.create({
      asset_id: assetId,
      public_id: publicId,
      owner: {
        id: userId,
      },
    });
    await this.privateFilesRepository.save(newFile);
    return newFile;
  }

  public async getPrivateFile(fileId: number, userId: number) {
    const fileInfo = await this.privateFilesRepository.findOne({
      where: {
        id: fileId,
      },
      relations: {
        owner: true,
      },
    });
    if (fileInfo) {
      if (fileInfo.owner.id === userId) {
        const response = await axios.get(
          this.cloudinaryService.publicImageUrl(fileInfo.public_id),
          {
            responseType: 'stream',
          },
        );
        const stream = response.data as Readable;
        return {
          stream,
          info: fileInfo,
        };
      }
      throw new UnauthorizedException();
    }
    throw new NotFoundException();
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        files: true,
      },
    });

    if (userWithFiles) {
      return Promise.all(
        userWithFiles.files.map(async (file) => {
          const url = await this.cloudinaryService.generatePresignedUrl(
            file.public_id,
          );
          return {
            ...file,
            url,
          };
        }),
      );
    }
    throw new NotFoundException('User with this id does not exist');
  }
}
