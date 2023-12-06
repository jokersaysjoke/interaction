const pool = require('./model');

const home=async (req, res)=>{
  res.render('../views/home.ejs', {});
};

const root=async (req, res)=>{
  try {
    let sql=`
    SELECT HOST
    FROM ROOM
    WHERE STATUS = ?
    `
    const cookie = req.cookies['cookie'];
    const [record]=await pool.promise().query(sql, ['LIVE']);
    
    if (cookie&&record.length>0) {
      res.render('../views/index.ejs', {});
    } else {
      res.redirect('/home');
    }
  } catch (error) {
    console.log('err', error);
    return res.status(500).json({"error":true, "message":"Database error"});
  }
};

const description=async (req, res)=>{
    res.render('../views/desc.ejs', {});
};

const profile=async (req, res)=>{
    const cookie = req.cookies['cookie'];
    if(cookie){
      res.render('../views/profile.ejs', {});
    }else{
      res.redirect('/home');
    }
};

module.exports={home, root, description, profile};