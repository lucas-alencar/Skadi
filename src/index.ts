import dotenv from 'dotenv';

function Start(){
    dotenv.config();
    console.log(process.env.API_TEST);
}

Start();