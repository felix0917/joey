<template>
  <div class="login-wrap">
    <div class="ms-title">登 录 管 理 系 统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="账号"  prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :type="textType" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"  prefix-icon="el-icon-star-off">
            <i slot="suffix" class="el-input__icon el-icon-view btn-eye" @click="changeType"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="validate">
          <el-input v-model="ruleForm.validate" class="validate-code" placeholder="验证码"></el-input>
          <div class="code" @click="refreshCode">
            <sidentify :identifyCode="identifyCode"></sidentify>
          </div>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <div v-if="errorInfo" class="ms-tips">
          <span>{{errInfo}}</span>
        </div>
        <p class="register" @click="handleCommand()">注册</p>
      </el-form>
    </div>
  </div>
</template>

<script>
  import sidentify from './identify'
  import axios from 'axios'
  export default {
    name: 'login',
    components: {
      sidentify
    },
    data() {
      return {
        identifyCodes: '1234567890',
        identifyCode: '',
        errorInfo: false,
        ruleForm: {
          userName: '',
          password: '',
          validate: ''
        },
        rules: {
          userName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          validate: [{
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }]
        },
        textType:'password'
      }
    },
    mounted() {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    methods: {
      submitForm(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.identifyCode!=this.ruleForm.validate){
              self.errorInfo = true
              self.errInfo = '验证码错误'
              this.identifyCode = ''
              this.makeCode(this.identifyCodes, 4)
              return;
            }
            axios.get('/api/login',{
              params: {
                userName: this.ruleForm.userName,
                password: this.ruleForm.password
              } 
            })
            .then((response) => {
              if(response.data.state===0){
                self.errorInfo = true
                self.errInfo = '账号或者密码错误'
              } else if (response.data.state === 1) {
                self.$router.push('/home')
                sessionStorage.setItem('username', self.ruleForm.userName)
                //sessionStorage.setItem('user', JSON.stringify(self.ruleForm))
              }
            }).then((error) => {
              console.log(error)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleCommand() {
        this.$router.push('/register')
      },
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      refreshCode() {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
          ]
        }
      },
      debounce(func, delay) {
        return function(args) {
          var _this = this
          var _args = args
          clearTimeout(func.id)
          func.id = setTimeout(function() {
            func.call(_this, _args)
          }, delay)
        }
      },
      submitDebounce(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            localStorage.setItem('ms_username', self.ruleForm.name)
            localStorage.setItem('ms_user', JSON.stringify(self.ruleForm))
            self.$http.post('/api/user/login', JSON.stringify(self.ruleForm))
              .then((response) => {
                if (response.data === -1) {
                  self.errorInfo = true
                  self.errInfo = '该用户不存在'
                  console.log('该用户不存在')
                } else if (response.data === 0) {
                  console.log('密码错误')
                  self.errorInfo = true
                  self.errInfo = '密码错误'
                } else if (response.status === 200) {
                  self.$router.push('/readme')
                }
              }).then((error) => {
                console.log(error)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      debounceAjax() {
        debounce(submitDebounce, 1000)
      },
      changeType () {
        this.textType = (this.textType === 'password' ? 'text' : 'password')
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #20222A;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 20px;
    font-family:Arial, Helvetica, sans-serif;
    color: #fff;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 240px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    background-clip: padding-box;
    border: 1px soild #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
  }

  .ms-login span {
    color: red;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }

  .code {
    width: 112px;
    height: 35px;
    border: 1px solid #ccc;
    float: right;
    border-radius: 2px;
  }

  .validate-code {
    width: 136px;
    float: left;
  }

  .register {
    font-size: 14px;
    line-height: 30px;
    color: #999;
    cursor: pointer;
    float: right;
  }

  .ms-tips{
    position:absolute;
    margin-top:18px; 
    margin-left:80px;
  }
</style>
