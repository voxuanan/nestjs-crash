import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public asset_id: string;

  @Column()
  public public_id: string;

  // @ManyToOne(() => User, (owner: User) => owner.files)
  // public owner: User;
}

export default PublicFile;
