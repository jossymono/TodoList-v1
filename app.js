const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Router } = require('express');
const date = require(__dirname + '/date.js');    
const app = express()
const port = 3000


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb+srv://Admin-jossymono:ilerioluwa1998@cluster0.vxjwyl0.mongodb.net/todolistDB', 
{useNewUrlParser: true, useUnifiedTopology: true})

const itemSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


let day = date.getDate();

app.get('/', (req, res) => {
  Item.find({}).then((items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems)
     res.redirect('/');
    } else {
     res.render('list', {listTitle: day, newListItems: items});
    }
  })});

app.get('/:customListName', (req, res) => {
  const customListName = req.params.customListName;

  const list = new List({
    name: customListName,
    items: defaultItems,
  });

  list.save();
});




app.post('/', (req, res) => {
 const itemName = req.body.newItem;

 const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect('/');

    
});

app.post('/delete',async (req, res) => {
  const checkedItemId = req.body.checkbox;
  console.log("checkedItemId: ${checkedItemId}");
  try {
    const item = await Item.findByIdAndRemove(checkedItemId);
    if (!item) {
      return res.status(404).send({ 
        message: "Item not found with id${checkedItemId}" });
    }
    console.log("Item deleted item: ${item}");
    res.redirect('/');
  } catch (err) {
    console.error('error deleting item: ${err.message}');
    res.status(500).send({ message: "Error deleting item: ${err.message} " }); 
  }
});
module.exports = app;
    




app.listen(port|| process.env.PORT, () => {
  console.log(`Todolist app listening on port ${port}`)
})




