const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const https = require('https');
const app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.get("/api/items", (req, res) => {
    if (req.query.q) {
        let searchParam = encodeURIComponent(req.query.q)
        console.log(searchParam)
        
        // Request to search endpoint
        // limited to 4 because request take too much time or is too large
        const options = {
            hostname: 'api.mercadolibre.com',
            port: 443,
            path: "/sites/MLA/search?q="+searchParam+"&limit=4",
            method: 'GET'
          }
      
          const request = https.request(options, response=> {
            console.log(`statusCode: ${response.statusCode}`)

            if (response.statusCode && response.statusCode === 404){
                res.sendStatus(response.statusCode);
                return;
            } 

            let chuncks = []
            response.on('data', d => {
                chuncks.push(d);
            }).on('end', () => {
                let data = Buffer.concat(chuncks);
                let schema = JSON.parse(data);

                //Object Format
                let list_items =  {
                    "author": {
                        "name": "Caleb",
                        "lastname": "Faillace"
                    },
                    "categories": [],
                    "items": []
                };

                // Get items and add to object items format
                schema.results.forEach(element => {

                    let el = {
                        "id": element.id,
                        "title": element.title,
                        "price": {
                            "currency": element.currency_id,
                            "amount": element.price,
                            "decimals": 0
                        },
                        "picture": element.thumbnail,
                        "free_shipping": element.shipping.free_shipping,
                        "city": element.seller_address.state.name
                    }
                   
                    // Get Item condition and add to object
                    el.condition = getCondition(element);
                    list_items.items.push(el)
                });      

                // Get Categories and add to object format
                getCategoryFromSearch(schema).then(categoriesRes => {
                    list_items.categories= categoriesRes;
                    res.send(list_items);
                });
            })
          })
          
          request.on('error', error => {
            console.error(error)
          })
          
          request.end()
            
    }
    
})

app.get("/api/items/:id", (req, res) => {
    console.log(req.params.id);
    if(req.params.id) {
        //Get item detail request
        const optionsId = {
            hostname: 'api.mercadolibre.com',
            port: 443,
            path: "/items/"+req.params.id,
            method: 'GET'
        }

        let item = {}
        const requestId = https.request(optionsId, response => {
            console.log(`statusCode: ${response.statusCode}`)
            let chuncksId = []

            if (response.statusCode && response.statusCode === 404){
                res.sendStatus(response.statusCode);
                return;
            } 

            response.on('data', d => {
                chuncksId.push(d);
            }).on('end', () => {
                let data = Buffer.concat(chuncksId);
                let schemaId = JSON.parse(data);

                item = { 
                    "author": {
                        "name": "Caleb",
                        "lastname": "Faillace"
                        },
                    "item": {
                        "id": schemaId.id, 
                        "title": schemaId.title,
                        "price": {
                            "currency": schemaId.currency_id,
                            "amount": schemaId.price,
                            "decimals": 0,
                        },
                        "picture": schemaId.pictures[0].url,
                        "free_shipping": schemaId.shipping.free_shipping,
                        "sold_quantity": schemaId.sold_quantity,
                        "description": ""
                    }
                }

                //Get Condition and add to object
                item.item.condition = getCondition(schemaId);
                
                //getCategoryById
                getCategoryById(schemaId.category_id).then((categories) => {
                    item.categories = categories;
                    //Get Description call and add to object and resolve
                    getItemDetailDescription(req).then((description) => {
                        item.item.description = description;
                        res.send(item);
                    })
                })
            })
          })
          
          requestId.on('error', error => {
            console.error(error);
          })
          
          requestId.end();
    
    }
})

function getItemDetailDescription(req) {
    return new Promise(function(resolve, reject) {
        //Get item description request
        const optionsDescription = {
            hostname: 'api.mercadolibre.com',
            port: 443,
            path: "/items/"+req.params.id+"/descriptions",
            method: 'GET'
        }
    
        let description = "";
        
        const requestdescription = https.request(optionsDescription, response => {
            console.log(`statusCode: ${response.statusCode}`)
            let chuncks = []
            response.on('data', d => {
                chuncks.push(d);
            }).on('end', () => {
                let data = Buffer.concat(chuncks);
                let schema = JSON.parse(data);
                description = schema[0] ? schema[0].plain_text : "";
                resolve(description);
            })
          })
          
          requestdescription.on('error', error => {
            console.error(error);
            reject(error)
          })
          
          requestdescription.end();
    })
}

function getCategoryById(id) {
    return new Promise(function(resolve, reject) {
        const optionsDescription = {
            hostname: 'api.mercadolibre.com',
            port: 443,
            path: "/categories/"+id,
            method: 'GET'
        }
    
        let categories = [];
        
        const requestdescription = https.request(optionsDescription, response => {
            console.log(`statusCode: ${response.statusCode}`)
            let chuncks = []
            response.on('data', d => {
                chuncks.push(d);
            }).on('end', () => {
                let data = Buffer.concat(chuncks);
                let schema = JSON.parse(data);
                
                schema.path_from_root.forEach(path => {
                    categories.push(path.name);
                })

                resolve(categories)
            })
          })
          
          requestdescription.on('error', error => {
            console.error(error);
            reject(error)
          })
          
          requestdescription.end();
    })
}

function getCondition(element){
    let condition = null;
    element.attributes.forEach(element => {
        if(element.id === "ITEM_CONDITION" ) {
            condition = element.value_name 
        }
    })
    return condition;
}

function getCategoryFromSearch(schema){

    return new Promise((resolve, reject) => {
        //get Categories from search endpoint, 
        let categories = [];
        if (schema.filters.length !== 0) {
            schema.filters.forEach(filter => {
                if (filter.id === "category") {
                    filter.values.forEach(value => {
                        value.path_from_root.forEach(path => {
                            categories.push(path.name);
                        })
                    }) 
                    resolve(categories);
                }
            })
        // else get category most result and get category request
        } else {
            let cats = []
            let counts = {}; 
            let compare = 0; 
            let mostFrequent;
            schema.results.forEach(item => {
                cats.push(item.category_id);
            })

            for(var i = 0, len = cats.length; i < len; i++){
                var word = cats[i];
            
                if(counts[word] === undefined){ 
                counts[word] = 1;    
                }else{                 
                counts[word] = counts[word] + 1; 
                }
                if(counts[word] > compare){ 
                compare = counts[word];   
                mostFrequent = cats[i]; 
                }
        }
        
        getCategoryById(mostFrequent)
            .then((categoriesResult) => {
                categories = categoriesResult;
                resolve(categories);
            })
        }
    })
}

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });

app.listen(5000, () => {
  console.log("server started on port 5000");
});