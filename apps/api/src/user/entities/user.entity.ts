import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column()
  gender: string;

  @ApiProperty()
  @Column({ name: 'nameset' })
  nameSet: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ name: 'givname' })
  givName: string;

  @ApiProperty()
  @Column({ name: 'surname' })
  surName: string;

  @ApiProperty()
  @Column({ name: 'streetaddress' })
  streetAddress: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column({ name: 'emailaddress' })
  emailAddress: string;

  @ApiProperty()
  @Column({ name: 'tropicalzodiac' })
  tropicalZodiac: string;

  @ApiProperty()
  @Column()
  occupation: string;

  @ApiProperty()
  @Column()
  vehicle: string;

  @ApiProperty()
  @Column({ name: 'countryfull' })
  countryFull: string;
}
