import fs from 'fs';

async function loadUsers(path){
  let users = [];
    try{
      users = JSON.parse(fs.readFileSync(path, 'utf8'));
      console.log("Successfully loaded in registered users!");
    } catch(err){
      console.log(err);
    }
    if(Array.isArray(users)){
      return users;
    } else{
      console.log("No users found.")
    }
  }

  export{
      loadUsers
  }