const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

// PRODUCTS
let products = [
    { id: 1, name: "Hydrating Velvet Lip Oil", category: "Lips", price: 26 },
    { id: 2, name: "Luminous Silk Tint SPF 30", category: "Complexion", price: 42 },
    { id: 3, name: "Dewy Dewdrop Blush", category: "Cheeks", price: 28 },
    { id: 4, name: "Satin Bare Eyeshadow Quad", category: "Eyes", price: 36 },
    { id: 5, name: "Essential Brush Collection", category: "Tools", price: 32 },
    { id: 6, name: "Skin Silk Renewal Serum", category: "Skincare", price: 39 },
    { id: 7, name: "Cloud Cream Moisturizer", category: "Skincare", price: 34 },
    { id: 8, name: "Noir Eau de Parfum", category: "Fragrance", price: 74 }
];

let nextProductId = 9;

// USERS
let users = [];
let nextUserId = 1;

// CART
let cart = [];

// ORDERS
let orders = [];
let nextOrderId = 1;

// REVIEWS
let reviews = [
    { id: 1, customer: "Sarah M.", rating: 5, comment: "Absolutely love these products!" },
    { id: 2, customer: "Emily R.", rating: 5, comment: "Beautiful packaging and quality." },
    { id: 3, customer: "Jessica L.", rating: 4, comment: "Great products and lovely colors." },
    { id: 4, customer: "Olivia K.", rating: 5, comment: "My new favorite beauty store." }
];

let nextReviewId = 5;

// NEWSLETTER
let subscribers = [];


// HOME
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to MAISON BEAUTY API",
        endpoints: [
            "/api/products",
            "/api/users",
            "/api/cart",
            "/api/orders",
            "/api/reviews",
            "/api/newsletter"
        ]
    });
});


// ===================================
// 1. PRODUCTS CRUD
// ===================================

// GET all products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// GET one product
app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});

// CREATE product
app.post("/api/products", (req, res) => {
    const { name, category, price } = req.body;

    if (!name || !category || price === undefined ||
        !Number.isFinite(price) || price < 0) {
        return res.status(400).json({
            message: "Valid name, category and price are required"
        });
    }

    const product = {
        id: nextProductId++,
        name,
        category,
        price
    };

    products.push(product);

    res.status(201).json({
        message: "Product created successfully",
        product
    });
});

// UPDATE product
app.put("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === Number(req.params.id));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { name, category, price } = req.body;

    if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Invalid name" });
        }
        product.name = name;
    }

    if (category !== undefined) {
        if (typeof category !== "string" || !category.trim()) {
            return res.status(400).json({ message: "Invalid category" });
        }
        product.category = category;
    }

    if (price !== undefined) {
        if (!Number.isFinite(price) || price < 0) {
            return res.status(400).json({ message: "Invalid price" });
        }
        product.price = price;
    }

    res.json({
        message: "Product updated successfully",
        product
    });
});

// DELETE product
app.delete("/api/products/:id", (req, res) => {
    const index = products.findIndex(p => p.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const deletedProduct = products.splice(index, 1)[0];

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct
    });
});


// ===================================
// 2. USERS: SIGNUP AND LOGIN
// ===================================

// GET all users
app.get("/api/users", (req, res) => {
    res.json(users.map(({ password, ...user }) => user));
});

// SIGNUP
app.post("/api/users/signup", (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match"
        });
    }

    const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
        return res.status(409).json({
            message: "Email already registered"
        });
    }

    const user = {
        id: nextUserId++,
        firstName,
        lastName,
        email,
        password
    };

    users.push(user);

    const { password: hiddenPassword, ...safeUser } = user;

    res.status(201).json({
        message: "Signup successful",
        user: safeUser
    });
});

// LOGIN
app.post("/api/users/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        u => u.email.toLowerCase() === String(email || "").toLowerCase()
            && u.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        });
    }

    const { password: hiddenPassword, ...safeUser } = user;

    res.json({
        message: "Login successful",
        user: safeUser
    });
});


// ===================================
// 3. CART CRUD
// ===================================

// GET cart
app.get("/api/cart", (req, res) => {
    const cartItems = cart.map(item => {
        const product = products.find(p => p.id === item.productId);

        return {
            productId: item.productId,
            name: product ? product.name : "Product unavailable",
            price: product ? product.price : 0,
            quantity: item.quantity,
            subtotal: product ? product.price * item.quantity : 0
        };
    });

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
        items: cartItems,
        total
    });
});

// ADD product to cart
app.post("/api/cart", (req, res) => {
    const { productId, quantity } = req.body;

    const product = products.find(p => p.id === Number(productId));

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
            message: "Quantity must be a positive integer"
        });
    }

    const existingItem = cart.find(
        item => item.productId === product.id
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            quantity
        });
    }

    res.status(201).json({
        message: "Product added to cart",
        cart
    });
});

// UPDATE cart quantity
app.put("/api/cart/:productId", (req, res) => {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    const item = cart.find(i => i.productId === productId);

    if (!item) {
        return res.status(404).json({
            message: "Cart item not found"
        });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
            message: "Quantity must be a positive integer"
        });
    }

    item.quantity = quantity;

    res.json({
        message: "Cart quantity updated",
        item
    });
});

// DELETE one cart item
app.delete("/api/cart/:productId", (req, res) => {
    const productId = Number(req.params.productId);
    const index = cart.findIndex(i => i.productId === productId);

    if (index === -1) {
        return res.status(404).json({
            message: "Cart item not found"
        });
    }

    cart.splice(index, 1);

    res.json({
        message: "Item removed from cart",
        cart
    });
});

// CLEAR cart
app.delete("/api/cart", (req, res) => {
    cart = [];

    res.json({ message: "Cart cleared successfully" });
});


// ===================================
// 4. ORDERS / CHECKOUT CRUD
// ===================================

// GET all orders
app.get("/api/orders", (req, res) => {
    res.json(orders);
});

// GET one order
app.get("/api/orders/:id", (req, res) => {
    const order = orders.find(o => o.id === Number(req.params.id));

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
});

// CREATE order / CHECKOUT
app.post("/api/orders", (req, res) => {
    const { customer, paymentMethod } = req.body;

    if (!customer || !customer.firstName || !customer.lastName ||
        !customer.email || !customer.address || !customer.city) {
        return res.status(400).json({
            message: "Customer name, email, address and city are required"
        });
    }

    if (!["card", "cash_on_delivery"].includes(paymentMethod)) {
        return res.status(400).json({
            message: "Payment method must be card or cash_on_delivery"
        });
    }

    if (cart.length === 0) {
        return res.status(400).json({
            message: "Your cart is empty"
        });
    }

    const items = cart.map(item => {
        const product = products.find(p => p.id === item.productId);

        return {
            productId: item.productId,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            subtotal: product.price * item.quantity
        };
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    const order = {
        id: nextOrderId++,
        customer,
        items,
        paymentMethod,
        total,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    orders.push(order);
    cart = [];

    res.status(201).json({
        message: "Order placed successfully",
        order
    });
});

// UPDATE order status
app.put("/api/orders/:id", (req, res) => {
    const order = orders.find(o => o.id === Number(req.params.id));

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    const { status } = req.body;
    const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid order status"
        });
    }

    order.status = status;

    res.json({
        message: "Order updated successfully",
        order
    });
});

// DELETE order
app.delete("/api/orders/:id", (req, res) => {
    const index = orders.findIndex(o => o.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Order not found" });
    }

    const deletedOrder = orders.splice(index, 1)[0];

    res.json({
        message: "Order deleted successfully",
        order: deletedOrder
    });
});


// ===================================
// 5. REVIEWS CRUD
// ===================================

// GET all reviews
app.get("/api/reviews", (req, res) => {
    res.json(reviews);
});

// GET one review
app.get("/api/reviews/:id", (req, res) => {
    const review = reviews.find(r => r.id === Number(req.params.id));

    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
});

// CREATE review
app.post("/api/reviews", (req, res) => {
    const { customer, rating, comment } = req.body;

    if (!customer || !comment ||
        !Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Customer, comment and rating from 1 to 5 are required"
        });
    }

    const review = {
        id: nextReviewId++,
        customer,
        rating,
        comment
    };

    reviews.push(review);

    res.status(201).json({
        message: "Review added successfully",
        review
    });
});

// UPDATE review
app.put("/api/reviews/:id", (req, res) => {
    const review = reviews.find(r => r.id === Number(req.params.id));

    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    const { customer, rating, comment } = req.body;

    if (customer !== undefined) {
        review.customer = customer;
    }

    if (rating !== undefined) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }
        review.rating = rating;
    }

    if (comment !== undefined) {
        review.comment = comment;
    }

    res.json({
        message: "Review updated successfully",
        review
    });
});

// DELETE review
app.delete("/api/reviews/:id", (req, res) => {
    const index = reviews.findIndex(r => r.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Review not found" });
    }

    const deletedReview = reviews.splice(index, 1)[0];

    res.json({
        message: "Review deleted successfully",
        review: deletedReview
    });
});


// ===================================
// 6. NEWSLETTER
// ===================================

// GET subscribers
app.get("/api/newsletter", (req, res) => {
    res.json(subscribers);
});

// SUBSCRIBE
app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;

    if (!email || !String(email).includes("@")) {
        return res.status(400).json({
            message: "A valid email is required"
        });
    }

    const existingEmail = subscribers.find(
        e => e.toLowerCase() === email.toLowerCase()
    );

    if (existingEmail) {
        return res.status(409).json({
            message: "Email is already subscribed"
        });
    }

    subscribers.push(email);

    res.status(201).json({
        message: "Successfully subscribed to newsletter",
        email
    });
});


// START SERVER
app.listen(PORT, () => {
    console.log(`MAISON BEAUTY API running at http://localhost:${PORT}`);
});