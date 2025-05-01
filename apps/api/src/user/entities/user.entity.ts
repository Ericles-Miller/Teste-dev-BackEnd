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
  @Column({ name: 'nameSet' })
  nameSet: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ name: 'givName' })
  givName: string;

  @ApiProperty()
  @Column({ name: 'surName' })
  surName: string;

  @ApiProperty()
  @Column({ name: 'streetAddress' })
  streetAddress: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column({ name: 'emailAddress' })
  emailAddress: string;

  @ApiProperty()
  @Column({ name: 'tropicalZodiac' })
  tropicalZodiac: string;

  @ApiProperty()
  @Column()
  occupation: string;

  @ApiProperty()
  @Column()
  vehicle: string;

  @ApiProperty()
  @Column({ name: 'countryFull' })
  countryFull: string;
}
