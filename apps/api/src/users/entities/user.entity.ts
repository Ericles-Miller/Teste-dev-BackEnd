import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  Id: number;

  @Column()
  Gender: string;

  @Column()
  NameSet: string;

  @Column()
  Title: string;

  @Column()
  GivName: string;

  @Column()
  SurName: string;

  @Column()
  StreetAddress: string;

  @Column()
  City: string;

  @Column()
  EmailAddress: string;

  @Column()
  TropicalZodiac: string;

  @Column()
  Occupation: string;

  @Column()
  Vehicle: string;

  @Column()
  CountryFull: string;

  constructor(
    id: number,
    gender: string,
    nameSet: string,
    title: string,
    givName: string,
    surName: string,
    streetAddress: string,
    city: string,
    emailAddress: string,
    tropicalZodiac: string,
    occupation: string,
    vehicle: string,
    countryFull: string,
  ) {
    this.Id = id;
    this.Gender = gender;
    this.NameSet = nameSet;
    this.Title = title;
    this.GivName = givName;
    this.SurName = surName;
    this.StreetAddress = streetAddress;
    this.City = city;
    this.EmailAddress = emailAddress;
    this.TropicalZodiac = tropicalZodiac;
    this.Occupation = occupation;
    this.Vehicle = vehicle;
    this.CountryFull = countryFull;
  }
}
