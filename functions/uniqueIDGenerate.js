const mongoose = require('mongoose');
const ShortUniqueId = require('short-unique-id');
const dataBaseSchema = require('./schema');
const uid = new ShortUniqueId({length:10});

async function generateUniqueId(){
   
    let isUnique = false;
    let newUrlId;

    while (!isUnique) {
        newUrlId = uid.rnd();
        try{
            const exsistingUrl = await UrlModel.findOne({urlId:newUrlId});
            isUnique = !exsistingUrl;
        }catch(error){
            console.error("Error checking id",error.message);
        }
    }

    return newUrlId;

}

module.exports = generateUniqueId;