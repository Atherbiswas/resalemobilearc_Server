const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECURITY_KEY}@cluster0.ukuxru5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const categoryCollection = client.db('resalemobilearc').collection('brandcategory');
        const productsCollection = client.db('resalemobilearc').collection('products');
        const bookingsCollection = client.db('resalemobilearc').collection('bookings');
        const usersCollection = client.db('resalemobilearc').collection('users');


        app.get('/categories', async(req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        });

        app.get('/categories/:id', async(req, res) => {
            const qureyNumber = req.params.id
            const query = {};
            const cursor = productsCollection.find(query);
            const result = await cursor.toArray();
            let productData = result.filter((b) => parseFloat(b.category_id) === parseFloat(qureyNumber))
            res.send(productData)
        });

        app.post('/booking', async(req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/booking', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        });

        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });

        app.get('/users', async(req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        });

        app.put('/users/admin/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

    }
    finally{

    }

}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('resalemobilearc server is running')
});

app.listen(port, () => {
    console.log(`resalemobilearc server running on ${port}`)
})