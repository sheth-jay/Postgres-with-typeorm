import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Profile } from "./entities/Profile";

const app = express();

app.use(express.json());

const port = 3000;

app.get("/", async function(req, res) {
  const { userId } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const profileRepo = AppDataSource.getRepository(Profile);
  
  //find all the user records
  const allRecords = await userRepo.find();

  const userFound = await userRepo.findOne({ where: {id: 1 }});

  if(userFound) {
    userFound.email = "email@gmail.com";
    userFound.firstName = "abc2";
    userFound.lastName = "test"
    userFound.profile.gender = "female";
    userFound.profile.photo = "new photo";

    const updateRecord = await userRepo.save(userFound);
    res.json(updateRecord);
  } else {
    res.send("Record does not exist");
  }

  // delete a user
  await userRepo.delete(userId);

  // add a new user
  let profile: Profile = new Profile();

  profile.gender = "male";
  profile.photo = "this is photo";

  let newUser: User = new User();
  newUser.email = "jay1@gmail.com";
  newUser.firstName = "jay1";
  newUser.lastName = "sheth";
  newUser.profile = profile;

  const userInserted = userRepo.save(newUser);

  // update a user

  const updatedUser = await userRepo.update(userId, {
    firstName: "jay2",
    lastName: "sheth",
  });

  // filter user

  const user = await userRepo.findOne({ where: { id: userId }});

  res.send();
});

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Lazovw$6.",
  database: "typeorm",
  entities: ["src/entities/*{.ts, .js}"],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Application is running on ${port}`);
    });
  })
  .catch(err => console.log("Error while connecting to database", err));
