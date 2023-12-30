const Redis=require('ioredis');
// const redis=new Redis();
const redis = new Redis({
    host: 'redis',
    port: 6379,
  });

function hsetCache(roomId, value){
    return new Promise((resolve, reject)=>{
        
        redis.hset(roomId, 'concurrent', value, 'totalViews', value, (err, result)=>{
            if(err){
                return reject(err);
            }else{
                return resolve(result)
            }
        })
        redis.sadd('liveStreams', roomId);
    })
};

function hgetCache(roomId, field){
    
    return new Promise((resolve, reject)=>{
        redis.hget(roomId, field, (err, result)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(result)
            }
        })
    })
};

function updateConcurrent(roomId, concurrent){
    
    return new Promise((resolve, reject)=>{
        redis.hincrby(roomId, 'concurrent', concurrent, (err, result)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(result)
            }
        })
    });
};

function updateTotalViews(roomId){
    
    return new Promise((resolve, reject)=>{
        redis.hincrby(roomId, 'totalViews', 1, (err, result)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(result)
            }
        })
    });
};

function cleanCache(roomId){
    return new Promise((resolve, reject)=>{
        redis.srem('liveStreams', roomId, (err, result)=>{
            if(err){
                return reject(err)
            }else{
                return resolve(result)
            }
        })
    });
};

async function getAllLiveStreams() {
    
    const liveStreamKeys = await redis.smembers('liveStreams');
    const liveStreamsData = [];
    
    for (const liveKey of liveStreamKeys) {
        const liveData = await redis.hgetall(liveKey);
        liveStreamsData.push({
            roomId: liveKey,
            concurrent: liveData.concurrent,
            totalViews: liveData.totalViews
        });
    }

    return liveStreamsData;
};


module.exports={hsetCache, hgetCache, updateConcurrent, updateTotalViews, cleanCache, getAllLiveStreams};