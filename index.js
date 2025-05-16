const Express = require("express");
const products = require("./products.json");

//create a API Server
const API_SERVER = Express();

//Parse incoming request body as JSON
API_SERVER.use(Express.json());

//Serving static files
API_SERVER.use(Express.static("public"));

//start and listen incoming request to this server
API_SERVER.listen(process.env.PORT,process.env.HOSTNAME, () => {
    console.log("Server started");
    console.log(`http://${process.env.HOSTNAME}:${process.env.PORT}`);
});


//ROUTE 1 = "/"
// API_SERVER.get("/", (req, res) => {
//     console.log(req);
//     res.send("/- Request received");
// });

API_SERVER.get("/", (req, res) => {
    return res.json({
        message: "Hello from the server",
        status: 200,
        success: true,
    })
});


//ROUTE 2 = "/products"
// This route is handled below with pagination and limit support.

//ROUTE 3 = "/products/create" method = POST;
API_SERVER.post("/products/create", (req, res) => {
    console.log(req.body);
    return res.json({
        message: "Product details",
        status: 200,
        success: true,
    });
});
//ROUTE 4 = "/products/:id" method = GET;
API_SERVER.get("/products/:id", (req, res) => {
    const matchedProduct = products.find((product) => product.id === req.params.id);
    if (!matchedProduct) {
        return res.json({
            message: "Product not found",
            status: 404,
            success: false,
        });
    }
   console.log(req.params);
    console.log(matchedProduct);
    return res.json({
        message: "Product details",
        status: 200,
        success: true,
        data: matchedProduct,
    });
});


//ROUTE 5 = "/products" method = GET using query params as limit and pagination;


API_SERVER.get("/products", (req, res) => {
    let productsList = [];
    const { limit, page } = req.query;
    
    if (limit && page) {
        console.log("Here", limit, page);
        const start = (Number(page) - 1) * Number(limit);
        const end = Number(page) * Number(limit);
        productsList = products.slice(start, end);
        console.log("Products List", productsList);
    } else {
        productsList = products;
        
    }if (!productsList.length) {
      return res.status(404).json({
        message: "No products found",
        status: 404,
        success: false,
        data: productsList,
      });
      
    }
    return res.json({
        message: "Products List",
        status: 200,
        success: true,
        data: productsList,
    });
    
});