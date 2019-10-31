var sqlMap = {
  selectUser: 'select * from user where userName = ? and password = ? ',
  insertUser: 'insert into user (userName,password) values (?,?) '
}

module.exports = sqlMap;
