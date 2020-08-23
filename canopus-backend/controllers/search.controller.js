const axios = require("axios");

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
        },
    };
    return abc;
}

function addQueryboost(query, path) {
    let abc = {
        text: {
            query: `${query}`,
            path: `${path}`,
            score: {
                "boost": {
                    "value": 1
                }
            }
        },
    };
    return abc;
}


async function queryBuilder(req) {
    // init query parameters
    var query = {};
    query.mustquery = [],
    query.shouldquery = [];
    //search only validated jobs
    //query.mustquery.push(addQuery(true,"validated"));
    console.log(query.mustquery);
    query.skip = parseInt(req.body.skip) || 0;
    query.limiter = parseInt(req.body.limit) || 10;
    if(req.body.coordinates){
        location =await geolocationAPI(req.body.coordinates);
        query.mustquery.push(addQuery(location, "description.location"));
        query.shouldquery.push(addQueryboost(req.body.location, "description.location"));
    }
    if (req.body.location && req.body.location.length > 0) {
    location = await nearbyAPI(req.body.location);
    // building query
    query.mustquery.push(addQuery(location, "description.location"));
    query.shouldquery.push(addQueryboost(req.body.location, "description.location"));
    }
    if (req.body.pin)
        query.shouldquery.push(addQuery(req.body.pin, "address.pin"));
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
    if (req.body.incentives)
        query.shouldquery.push(
            addQuery(req.body.incentives, "description.incentives"),
        );
    if (req.body.type)
        query.shouldquery.push(
            addQuery(req.body.type, "description.type"),
        );
    if (req.body.status)
        query.mustquery.push(
            addQuery(req.body.status, "description.status"),
        );
        
       // if(query.mustquery!=[])
        query.search = {
            $search: {
                compound: {
                    must: query.mustquery,
                    should: query.shouldquery,
                },
            },
        };
        // else if(query.shouldquery!=[])
        // query.search= {
        //     $search: {
        //         compound: {
        //             should: query.shouldquery,
        //         },
        //     },
        // };
        // else
        // query.search ={
        //     $search:{
        //         compound:{
        //             must:
        //         }
        //     }
        // }
       // console.log(query.search);
        //By default sort by Relevance
        query.sort = {$sort: { score: { $meta: "textScore" }} };
                if ((req.body.order == "New"))
                    query.sort = {
                        $sort: {
                            _id: -1,
                        },
                    };
                if ((req.body.order == "Old"))
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
exports.searchController={queryBuilder,nearbyAPI,addQuery,addQueryboost,geolocationAPI};
// response.data.forEach((element) => {
//     nearby.push(element[1]);
// });

//req.body.location="Mumbai";
//queryBuilder(req);