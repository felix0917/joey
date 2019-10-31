const mysql = require('mysql');
const dbConfig = require('./db');
const sqlMap = require('./sqlMap');

const pool = mysql.createPool({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  port: dbConfig.mysql.port,
  multipleStatements: true    // 多语句查询
});

module.exports = {
  login(req, res, next) {
    let userName = req.query.userName;
    let password = req.query.password;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.selectUser;
      connection.query(sql, [userName, password], (err, result) => {
        // res.json(result);    // 向前端返回json格式的数据
        connection.release();
        let state = {}
        if (result.length > 0) {
          state.state = 1;
          res.json(state);
        } else {
          state.state = 0;
          res.json(state);
        }
      })
    })
  },
  registe(req,res,next){
    let userName = req.body.params.userName;
    let password = req.body.params.password;
    pool.getConnection((err,connection)=>{
        var sql = sqlMap.insertUser;
        try{
          connection.query(sql,[userName,password],(err,result)=>{
            connection.release();
            let state = {};
            if(err===null){
              state.state = 1;
              res.json(state);
            }
            else{
              console.log('新增用户失败，原因是：该用户已存在')
              state.state = 0;
              res.json(state);
            }
          })
        }catch(e){
        }
      }
    )
  }
}
