import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CarProperties } from '../interface/carProperties.interface';
import { BookProperties } from '../interface/bookProperties.interface';
import ProductCategory from './productCategory.entity';

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.products,
  )
  public category: ProductCategory;

  @Column({
    type: 'jsonb',
  })
  public properties: CarProperties | BookProperties;
}

export default Product;
