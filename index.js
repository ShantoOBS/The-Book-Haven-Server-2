const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;
require('dotenv').config();



const admin = require("firebase-admin");

const decoded = Buffer.from(process.env.FIREBASE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.use(cors())
app.use(express.json())

const verifyByFireBase=async(req,res,next)=>{

     const authorization=req.headers.authorization;
    
     if(!authorization)return res.status(401).send({message:"unotherize access"});

     const token=authorization.split(' ')[1];

     if(!token)return res.status(401).send({message:"unotherize access"});


      //verify

      
      try{

        const decode=await admin.auth().verifyIdToken(token);
          req.token_email=decode.email;
          next();

      }
      catch{
        return res.status(401).send({message:"unotherize access"});
      }

   

}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t2y7ypa.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    const myDB = client.db("myDB");
    const myColl = myDB.collection("Book-store");

    app.post('/add-book', verifyByFireBase,async (req, res) => {
      const data = req.body;
      const result = await myColl.insertOne(data);
      res.send(result);
    })



    app.get("/all-book", async (req, res) => {
      const userEmail = req.query.email;
      try {
        let cursor;
        if (userEmail) {

          cursor = myColl.find({ userEmail });
        } else {

          cursor = myColl.find({});
        }

        const books = await cursor.toArray();
        res.send(books);
      } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message });
      }
    });

    app.delete('/delete-book/:id',verifyByFireBase, async (req, res) => {
      const id = req.params.id;
      const data=req.body;
      console.log(data,req.token_email);

     if(data.email!=req.token_email)return res.status(402).send({message:"forbidden access"});

      let query = { _id: new ObjectId(id) };
      const result = await myColl.deleteOne(query);
      res.send(result);
    });


    app.get('/book-details/:id',async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myColl.findOne(query);
      res.send(result);
    })



    app.patch('/update-book/:id',verifyByFireBase, async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;


        if(data.userEmail!=req.token_email)return res.status(403).send({message:"forbidden access"});

        const query = { _id: new ObjectId(id) };

        const update = {
          $set: {
            title: data.title,
            author: data.author,
            genre: data.genre,
            rating: data.rating,
            summary: data.summary,
            coverImage: data.coverImage,
            userEmail: data.userEmail
          }
        };

        const result = await myColl.updateOne(query, update);

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Book not found" });
        }

        res.send({ message: "Book updated successfully", result });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
      }
    });


  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})