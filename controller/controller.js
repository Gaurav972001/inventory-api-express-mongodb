
const mongodb = require('mongodb')

let db;

mongodb.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    console.log('connection established with mongodb')
     db = client.db()
  }
)


createItem = async (req,res)=>{
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const newItem={
        itemName : req.body.itemName, 
        stocks : req.body.stocks 
    }
    try{
        const insertedItem= await db.collection('items').insertOne(newItem);
        console.log(insertedItem.ops[0]);
        res.json(insertedItem.ops[0]);
    } catch(err){
        console.log(err);
        res.json(err.message);
    }
}

// retrieve and return all items
getItem = async (req, res)=>{
    try{
        const fetchedItems= await db.collection('items').find({}).toArray();
        res.json(fetchedItems)
    }catch(err){
        res.json(err)
    }
}

// Update a new idetified item by item id
updateItem = async (req, res)=>{
    if(!req.body.itemName || !req.body.stocks){
        return res.status(400).send({ message : "Data to update can not be empty"})
    }
 
    try{ 
        const item = await db
        .collection("items")
        .find({ _id: new mongodb.ObjectId(req.params.id) }).count();
  
      if(item === 0){
          res.status(400).send({ message: "id not found" });
          return;
      }

        await db.collection('items').findOneAndUpdate(
            { _id: new mongodb.ObjectId(req.params.id) },
            { $set: { itemName : req.body.itemName, stocks: req.body.stocks } },
            ()=> {
            res.send('Success updated!')
            }
        )
    }catch(err){
        res.send(err.message)
    }
}

// Delete a item with specified item id in the request
deleteItem = async (req, res) => {
    try {
      const item = await db
        .collection("items")
        .find({ _id: new mongodb.ObjectId(req.params.id) }).count();
  
      if(item === 0){
          res.status(400).send({ message: "id not found" });
          return;
      }
  
      await db
        .collection("items")
        .deleteOne({ _id: new mongodb.ObjectId(req.params.id) }, function () {
          res.send("Successfully deleted!");
        });
    } catch (err) {
      res.send(err.message);
      return;
    }
  };

module.exports = {
    createItem,
    getItem,
    updateItem,
    deleteItem
};