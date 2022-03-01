import fs from 'fs';

async function loadUsers(path, client){
  let tempObjects = [];
    try{
      tempObjects  = JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch(err){
      console.log(err);
    }
    if(Array.isArray(tempObjects)){
      let objects = [];
      for(const temp of tempObjects){
        let user = await client.users.fetch(client.users.resolveId(temp.id));
        objects.push(user);
      }
      console.log("Successfully loaded in requested objects!");
      return objects;
    } else{
      console.log("No users found.")
    }

  }

  export{
      loadUsers
  }