import fs from 'fs';
function loadObjects(path){
    try{
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch(err){
      console.log(err);
    }
  }

  export{
      loadObjects
  }