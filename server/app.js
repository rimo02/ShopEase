const http = require('http');
const cors = require('cors');
const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const authRoutes = require('./routes/Auth')
const Stripe = require('stripe')
dotenv.config();
const app = express();
const server = http.createServer(app);
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use('/api', authRoutes);


const serviceAccount = require('./firebase-admin.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET_NAME
});

const db = getFirestore();
const bucket = getStorage().bucket();
const upload = multer({ storage: multer.memoryStorage() });

const uploadImageToStorage = async (file) => {
    const fileName = `products/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
    });

    const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '03-01-2190',
    });

    return url;
};

app.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, discount } = req.body;
        if (!name || !price || !req.file) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }
        const imgUrl = await uploadImageToStorage(req.file);
        const productData = {
            name,
            description,
            price: Number(price) || 0,
            discount: Number(discount) || 0,
            imgUrl,
            createdAt: new Date(),
        };
        const docRef = await db.collection("products").add(productData);
        res.status(201).json({ id: docRef.id, message: "Product added successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        let { page, limit, minPrice, maxPrice, categories } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        minPrice = parseInt(minPrice) || 0;
        maxPrice = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;

        const offset = (page - 1) * limit;

        let query = db.collection("products");

        query = query.where("price", ">=", minPrice);
        if (maxPrice < Number.MAX_SAFE_INTEGER) {
            query = query.where("price", "<=", maxPrice);
        }

        if (categories && categories.length > 0) {
            const catList = categories.split(",");
            if (catList.length > 0) {
                query = query.where("categories", "array-contains-any", catList);
            }
        }

        query = query.orderBy("price").orderBy("createdAt", "desc");

        const countSnapshot = await query.count().get();
        const totalCount = countSnapshot.data().count;
        const totalPages = Math.ceil(totalCount / limit);

        let paginatedQuery = query;

        if (offset > 0) {
            const snapshot = await query.limit(offset).get();
            const lastVisible = snapshot.docs[snapshot.docs.length - 1];

            if (lastVisible) {
                paginatedQuery = query.startAfter(lastVisible);
            }
        }

        const snapshot = await paginatedQuery.limit(limit).get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.status(200).json({
            products,
            totalPages,
            currentPage: page,
            totalCount
        });

    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ error: error.message });
    }
});



app.post('/create-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency || 'usd',
            payment_method_types: ["card"],
        });

        res.json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = server;
