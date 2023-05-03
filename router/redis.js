const Redis=require('ioredis');
const redis=new Redis();

function hsetCache(key, value){
    return new Promise((resolve, reject)=>{
        redis.hset(key, 'count', value, 'totalViews', value, (err, result)=>{
            if(err){
                return reject(err);
            }else{
                return resolve(result)
            }
        })
    })
}

function hgetCache(key, field){
    return new Promise((resolve, reject)=>{
        redis.hget(key, field, (err, result)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(result)

            }
        })
    })

}

function updateCache(key){
    return new Promise((resolve, reject)=>{
        redis.hincrby(key, 'totalViews', 1, (err, result)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(result)
            }
        })
    });

}

function cleanCache(key){
    return new Promise((resolve, reject)=>{
        redis.del(key, (err, result)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(result)}
            
        });
    })
}


module.exports={hsetCache, hgetCache, updateCache, cleanCache};