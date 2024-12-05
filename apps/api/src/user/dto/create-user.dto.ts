import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  nameSet: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  givName: string;

  @ApiProperty()
  surName: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  emailAddress: string;

  @ApiProperty()
  tropicalZodiac: string;

  @ApiProperty()
  occupation: string;

  @ApiProperty()
  vehicle: string;

  @ApiProperty()
  countryFull: string;
}
