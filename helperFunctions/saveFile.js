import fs from "fs";

function saveObjects(path, registeredUsers){
    fs.writeFile(path, JSON.stringify(registeredUsers), (err, result) => {
    if(err){
      console.log(err);
    }
  });
}

export{
    saveObjects
}