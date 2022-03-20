import mongoose from 'mongoose';
import config from '../config.js';
import structures from '../structures.js';

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

var twitterAccountSchema = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  latestTweet: String,
  subscribedUsers: [{
    type: String
  }]
});

var registeredUsers = mongoose.model('registeredUsers', userSchema);
var twitterAccounts = mongoose.model('twitterAccounts', twitterAccountSchema);

async function getRegisteredUsers(){
  try{
    structures.registeredUsers = await registeredUsers.find({});
  } catch (err){
    console.log(`Error loading registered users from the database! \n${err}`);
  }
}

function addNewRegisteredUser(newUser){
  let user = new registeredUsers(newUser);
  try{
    user.save();
    console.log(`Registered ${newUser.username}.`);
  } catch(err) {
    console.log(`Error adding new registered user to database...`);
  }
}

async function deregisterUser(user){
  try{
    await registeredUsers.deleteOne({ id: user.id });
    console.log(`Successfully removed ${user.username} and their info from the database`);
  } catch(err){
    console.log(`Error removing user ${user.username} from the database \n${err}`);
  } 
}

function trackTwitterAccount(twitterAccount){
  let account = new twitterAccounts(twitterAccount);
  try{
    console.log('Adding new twitter account to database');
    account.save();
  } catch(err){
    console.log(`Error adding new twitter account to database!\n${err}`);
  }
}

async function getTwitterAccounts(){
  try{
    structures.twitterAccounts = await twitterAccounts.find({});
  } catch(err){
    console.log(`Error loading twitter account data! \n${err}`);
  }
}

function updateTwitterAccount(data){

}

function updateUserData(user){
  try{
    

  } catch(err){
    console.log(`Error updating user data...`);
  }
  console.log(`User data successfully updated!`);
}

export default{
  getRegisteredUsers,
  addNewRegisteredUser,
  deregisterUser,
  trackTwitterAccount,
  getTwitterAccounts
}

