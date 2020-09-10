const axios = require("axios"),
Job = require("../models/job.model"),
Freelance = require("../models/freelance.model");

const searchController={};
// query builder function

function addMatchquery(query,path) {
    let abc = {
        $match:{path:query},
    };
    return abc;

}
function addQuery(query, path) {
    let abc = {
        text: {
            query: `${query}`,
            path: `${path}`,
            // score:{
            //     "constant":{
            //         "value":1
            //     }
            // }
        },
    };
    return abc;
}

function addQueryboost(query, path,num) {
    let abc = {
        text: {
            query: `${query}`,
            path: `${path}`,
            score: {
                "boost": {
                    "value": num
                }
            }
        },
    };
    return abc;
}
async function updateQueryBuilder(req){
    var query={};
    query.update={};
    if(req.body.title) query.update["title"]=req.body.title;
    if(req.body.profession) query.update["profession"]=req.body.profession;
    if(req.body.specialization) query.update["specialization"]=req.body.specialization
    if(req.body.superSpecialization) query.update["superSpecialization"]=req.body.superSpecialization;
    if(req.body.address) query.update["address"]=req.body.address;
    if(req.body.description) query.update["description"]=req.body.description;
    if(req.body.tag) query.update["tag"]=req.body.tag;
    //console.log(query.update);
    return query;
}


async function queryBuilder(req) {
    // init query parameters
    var query = {};
    query.mustquery = [],
    query.shouldquery = [];
    var boostval=1,
        boost=1;
    //search only validated jobs

    //query.mustquery.push(addQuery(true,"validated"));
    
    // console.log(query.mustquery);
    query.skip = parseInt(req.body.skip) || 0;
    query.limiter = parseInt(req.body.limit) || 10;
    if(req.body.coordinates){
        location =await geolocationAPI(req.body.coordinates);
       // console.log(location);
        query.mustquery.push(addQuery(location, "description.location"));
        //query.shouldquery.push(addQueryboost(req.body.location, "description.location",1));
    }
    if (req.body.location && req.body.location.length > 0) {
    location = await nearbyAPI(req.body.location);
    // building query
    query.mustquery.push(addQuery(location, "description.location"));
    query.shouldquery.push(addQueryboost(req.body.location, "description.location",1));
    }
    // if (req.body.pin)
    
    //     query.shouldquery.push(addQuery(req.body.pin, "address.pin"));
    if (req.body.profession)
        query.mustquery.push(addQuery(req.body.profession, "profession"));
    if (req.body.specialization)
        query.mustquery.push(
            addQuery(req.body.specialization, "specialization"),
        );
    if (req.body.superSpecialization)
        query.mustquery.push(
            addQuery(
                req.body.superSpecialization,
                "superSpecialization",
            ),
        );
    if (req.body.incentives){
        query.shouldquery.push(
            addQuery(req.body.incentives, "description.incentives"),
        );
        boost=boost+boostval;
    }
    if (req.body.type){
        query.shouldquery.push(
            addQuery(req.body.type, "description.type"),
        );
        boost=boost+boostval;
    }
    if (req.body.status){
        query.mustquery.push(
            addQuery(req.body.status, "description.status"),
        );
        boost=boost+boostval;
    }
       // query.mustquery.push(addQuery(true,"validated"));
        query.shouldquery.push(addQueryboost(true,"sponsored",boost));
       if(query.mustquery.length!=0)
        query.search = {
            $search: {
                compound: {
                    must: query.mustquery,
                    should: query.shouldquery,
                },
            },
        };
        else
        query.search = {
            $search: {
                compound: {
                    should: query.shouldquery,
                },
            },
        };
        //By default sort by Relevance
        //console.log(query.mustquery);
    //console.log(query.shouldquery);
        query.sort = {$sort: { score: { $meta: "textScore" }} };
                if ((req.body.order === "New"))
                    query.sort = {
                        $sort: {
                            _id: -1,
                        },
                    };
                if ((req.body.order === "Old"))
                    query.sort = {
                        $sort: {
                            _id: 1,
                        },
                    };
    return query;
}
const nearbyAPI=(location)=>{
    return new Promise((resolve,reject)=> {
        var nearby = [];
        axios
        .get(
             `http://getnearbycities.geobytes.com/GetNearbyCities?radius=100&locationcode=${location}%2C`,
             )
        .then(function (response) {
            //console.log(response.data);
            response.data.forEach((element) => {
                nearby.push(element[1]);
            });
            resolve(response.data.map((element)=>element[1]));
        }).catch(err=>reject(err));
    //return nearby;
});
}
const geolocationAPI=(location)=>{
    return new Promise((resolve,reject)=> {
        var nearby = [];
        axios
        .get(
             `http://getnearbycities.geobytes.com/GetNearbyCities?radius=100&latitude=${location[0]}&longitude=${location[1]}`,
             )
        .then(function (response) {
            //console.log(response.data);
            response.data.forEach((element) => {
                nearby.push(element[1]);
            });
            resolve(response.data.map((element)=>element[1]));
        }).catch(err=>reject(err));
    //return nearby;
});
}

exports.searchController={queryBuilder,nearbyAPI,addQuery,addQueryboost,geolocationAPI,updateQueryBuilder};
// response.data.forEach((element) => {
//     nearby.push(element[1]);
// });

//req.body.location="Mumbai";
//queryBuilder(req);