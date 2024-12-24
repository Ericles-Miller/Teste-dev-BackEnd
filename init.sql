-- create a database
CREATE DATABASE mydatabase;

USE mydatabase;

-- create table `users`
CREATE TABLE "users" (
    "id" INT PRIMARY KEY,
    "gender" VARCHAR(255),              
    "nameSet" VARCHAR(255),             
    "title" VARCHAR(255),               
    "givName" VARCHAR(255),              
    "surName" VARCHAR(255),             
    "streetAddress" VARCHAR(255),       
    "city" VARCHAR(255),                
    "emailAddress" VARCHAR(255),        
    "tropicalZodiac" VARCHAR(255),       
    "occupation" VARCHAR(255),          
    "vehicle" VARCHAR(255),             
    "countryFull" VARCHAR(255)           
);