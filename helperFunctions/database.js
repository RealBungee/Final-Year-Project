import mongoose from 'mongoose';
import config from '../config.js';

const username = config.mongoDB.username;
const pass = config.mongoDB.password;
const dbname = config.mongoDB.dbname;

const url = `mongodb+srv://${username}:${pass}@cluster0.mhsqx.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to database!');
})
.catch((err) => {
    console.log(`Error connecting to the database! \n${err}`)
})

var userSchema = new mongoose.Schema({
  id: String,
  allowTrading: Boolean,
  binanceApiKey: String,
  binanceApiSecret: String
});

var registeredUsers = mongoose.model('registeredUsers', userSchema);

function getRegisteredUsers(){
  try{
    return registeredUsers.find({});
  } catch (err){
    console.log(`Error loading registered users from the database! \n${err}`);
  }
}

function addNewRegisteredUser(newUser){
  let user = new registeredUsers(newUser);
  console.log(`Adding user ${newUser.username} to list of registered users in database.`);
  try{
    user.save();
  } catch(err) {
    console.log(`Error adding new registered user to database...`);
  }
}

function updateUserData(user){
  try{

  } catch(err){
    console.log(`Error updating user data...`);
  }
  console.log(`User data successfully updated!`);
}

export {
  getRegisteredUsers,
  addNewRegisteredUser
}

