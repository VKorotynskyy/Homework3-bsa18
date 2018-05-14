//Import and starting queries
mongoimport-d bsa18-c users--file users.json
    > show dbs
admin       0.000GB
bsa18       0.001GB
categories  0.000GB
config      0.000GB
crunchbase  0.033GB
local       0.000GB
m101        0.000GB
m201        0.104GB
mongomart   0.000GB
school      0.246GB
test        0.033GB
video       0.000GB
    > use bsa18
switched to db bsa18
    > show collections
users
var cursor = db.users.find()
    > cursor.length()
844

//Find average age on collection
    > db.users.aggregate([{ $group: { _id: null, ageAvg: { $avg: '$age' }}}])
{ "_id" : null, "ageAvg" : 30.38862559241706 }

//Find avarage age in Alaska state
    > db.users.aggregate([{ $match: { address: /Alaska/g } }, { $group: { _id: null, avgAge_Alaska: { $avg: "$age" } } }])
{ "_id" : null, "avgAge_Alaska" : 31.5 }

//Find first man with the friend Dennis
> db.users.find({ 'friends.name': /Dennis/g }, { _id: 0, name: 1, friends: 1 }).limit(1)
{
    "name" : "Macias Shannon", "friends" : [{ "id": 0, "name": "Dennis Sawyer" }, { "id": 1, "name": "Durham Pollard" },
    { "id": 2, "name": "Tammy Griffin" }]
}

//Find ppl from the same state as Macias Shannon and get to know their favorite fruits
> db.users.aggregate([{
    $match: {
        address: /Virginia/g
    }
}, {
    $group: {
        _id: '$favoriteFruit',
        avg: {
            $avg: "$age"
        }
    }
}])
{ "_id" : "strawberry", "avg" : 31.071428571428573 }
{ "_id" : "banana", "avg" : 28.555555555555557 }
{ "_id" : "apple", "avg" : 31.857142857142858 }

//Find first registered man with the same favorite fruit
> db.users.aggregate([{
    $match: {
        address: /Virginia/g,
        favoriteFruit: 'apple',
    }
}, 
{
    $sort: {registered: 1}
},
{
    $group: {
        _id: '$favoriteFruit',
        firstReg: {
            $first: "$registered"
        }
    }
}])
{
    "_id": "apple",
    "firstReg": "2014-04-09T12:19:34 -03:00"
}

//Add new feature this user
> db.users.updateOne({ registered: "2014-04-09T12:19:34 -03:00" }, { $set: { features: 'first apple eater' } })
{ "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 }

> db.users.find({ features: { $ne: null } }, { _id: 0, features: 1, name: 1 })
{ "name" : "May Cote", "features" : "first apple eater" }

//Delete all strawbeery eaters
> db.users.deleteMany({ favoriteFruit: 'strawberry' })
{ "acknowledged" : true, "deletedCount" : 0 }

