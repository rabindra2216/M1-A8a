let express = require("express");
//const { studentsData } = require("./studentData");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header(
"Access-Control-Allow-Methods",
"GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
);
res.header(
"Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
});
var port=process.env.PORT || 2410;
app.listen(port, () =>console.log(`Node app listening on port ${port}!`));
let {data}=require('./Datas');
let {shops,products,purchases}=data;

//All datas-------------->
app.get("/datas",function(req,res){
    let arr=data;
    res.send(arr);
  })
//shops----->

app.get("/shops",function(req,res){
  let arr=shops;
  //arr=arr.map(st=>{return{shopId:st.shopId,name:st.name}});
  console.log(arr)
  res.send(arr);
})
app.post("/shops",function(req,res){
    let body=req.body;
    let maxId=shops.reduce((acc,curr)=>curr.shopId>acc?curr.shopId:acc,1);
    let newShops={shopId:maxId+1,...body};
    shops.push(newShops);
    res.send(newShops);
})
//products-------->

app.get("/products",function(req,res){
    let arr=products;
   // console.log(arr)
    res.send(arr);
  })
  app.get("/products/:id",function(req,res){
    let id=+req.params.id;
   let editEle=products.find(st=>st.productId===id);
    res.send(editEle);
  })

  app.post("/products",function(req,res){
    let body=req.body;
    let maxId=products.reduce((acc,curr)=>curr.productId>acc?curr.productId:acc,1);
    let newShops={productId:maxId+1,...body};
    products.push(newShops);
    res.send(newShops);
})
app.put("/products/:id",function(req,res){
    let id=+req.params.id;
    let body=req.body;
    let index=products.findIndex(st=>st.productId===id);
    let updatedProduct={productId:id,...body}
    products[index]=updatedProduct;
    res.send(updatedProduct);
})
//purchases------->
app.get("/purchases",function(req,res){
    let shopName=req.query.shop;
    let prStr=req.query.product;
    let sort=req.query.sort;
    let arr=purchases;
    if(shopName) arr=arr.filter(st=>st.shopId===(shops.find(el=>el.name===shopName)).shopId);
    if(prStr){
        let prArr=prStr.split(',');
         arr=arr.filter(st=>prArr.find(el=>el===products[st.productid-1].productName));
    }
    if(sort){
        if(sort==='QtyAsc') arr.sort((st1,st2)=>st1.quantity-st2.quantity);
        if(sort==='QtyDesc') arr.sort((st1,st2)=>st2.quantity-st1.quantity)
        if(sort==='ValueAsc') {
            arr.sort((st1,st2)=>(st1.quantity*st1.price)-(st2.quantity*st2.price))
        }
        if(sort==='ValueDesc') {
              
            arr.sort((st1,st2)=>(st2.quantity*st2.price)-(st1.quantity*st1.price))
        }
    }
    arr=arr.map(st=>{return{purchaseId:st.purchaseId,shopId:st.shopId,productid:st.productid,quantity:st.quantity,price:st.price,}});
    //console.log(arr)
    res.send(arr);
  });

  app.get("/purchases/shops/:id",function(req,res){
    let id=+req.params.id;
    let arr=purchases.filter(st=>st.shopId===id);
    //console.log(arr)
    res.send(arr);
  })
  app.get("/purchases/products/:id",function(req,res){
    let id=+req.params.id;
    let arr=purchases.filter(st=>st.productid===id);
    //console.log(arr)
    res.send(arr);
  })

  //TotalPurchase--------->
  app.get("/totalPurchase/shop/:id",function(req,res){
    let id=+req.params.id;
    let arr=purchases.filter(st=>st.shopId===id);
    let arr1=products.map(st=>{return{productId:st.productId,totalPurchase:arr.reduce((acc,curr)=>curr.productid===st.productId?acc+1:acc,0)}});
    console.log(arr)
    res.send(arr1);
  });

  app.get("/totalPurchase/product/:id",function(req,res){
    let id=+req.params.id;
    let arr=purchases.filter(st=>st.productid===id);
    let arr1=shops.map(st=>{return{shopId:st.shopId,totalPurchase:arr.reduce((acc,curr)=>curr.shopId===st.shopId?acc+1:acc,0)}});
    console.log(arr)
    res.send(arr1);
  });

  app.post("/purchases",function(req,res){
    let body=req.body;
    let maxId=purchases.reduce((acc,curr)=>curr.purchaseId>acc?curr.purchaseId:acc,1);
    let newShops={productId:maxId+1,...body};
    purchases.push(newShops);
    res.send(newShops);
})