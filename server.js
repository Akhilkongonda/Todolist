// Import the Express.js library
const express = require('express');
const cors=require('cors');
const corsOptions = {
  origin: '*',
};
const app = express();

app.use(cors(corsOptions));

const { ObjectId } = require('mongodb');
require('dotenv').config();

console.log("ENV :",process.env) 

const mongoURI = process.env.MONGODB;
const port=process.env.PORT;

console.log(mongoURI);

 





// Create an Express application



// // Define a route handler for the root URL "/"
// app.get('/', (req, res) => {
//   res.send('Hello, Express.js!');
// });

// Start the server and listen on a specific port (e.g., 3000)

app.listen(port, () => { 
  console.log(`Server is running on port ${port}`);
}); 

app.use(express.json());
// console.log(mongoURI);

const mclient=require("mongodb").MongoClient;
mclient.connect(mongoURI)
.then(dbserverref=>{
    const todosdb=dbserverref.db('todolist');
    listobj=todosdb.collection('listoftodos');
    console.log("db connected");

})
.catch((err)=>{



    console.log(err);

});




app.post('/addTask', async (req, res) => {
  try {
    const data = req.body;
    
    if (!data.task || data.task.trim() === '') {
      // Check if the 'task' field is empty or contains only whitespace
      res.send({ message: "Please enter a task" });
    } else {
      await listobj.insertOne(data);
      console.log('Data inserted:', data);
      res.status(201).json({ message: 'Data inserted successfully' });
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



  app.get('/gettask',async(req,res)=>{
    try{
        const data=await listobj.find().toArray();
        console.log(data);
        res.json(data);

    }
    catch{

    }
  })

  app.delete('/deleteTask/:id', async (req, res) => {
    try {
      const id = req.params.id
      console.log(id)
     
  
      // Assuming you've connected to MongoDB and have access to the collection

      const result = await listobj.deleteOne({_id:new ObjectId(id)});
  
      if (result.deletedCount === 1) {
        // The document was deleted successfully
        res.status(200).json({ message: 'Task deleted successfully' });
      } else {
        // No document with the specified ID found
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  
  





