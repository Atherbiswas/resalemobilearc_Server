const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
            console.log('this is ',productData)
            // console.log(result)
            res.send(productData)
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