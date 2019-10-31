<template>
  <div class="register-box">
    <div class="crumbs crumbs-register">
      <el-breadcrumb separator="/" class="register-title">
        <el-breadcrumb-item><i class="el-icon-setting"></i>注 册</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="userContent">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="userName" label="账号名">
          <el-input v-model="form.userName" placeholder="请输入账号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-star-on"></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword" label="确认密码">
          <el-input v-model="form.checkPassword" type="password" placeholder="请再次输入密码" prefix-icon="el-icon-s-check"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">确定</el-button>
          <el-button @click="onCancle()">取消</el-button>
        </el-form-item>
        <div v-if="infoShow" class="ms-tips">
          <span>{{info}}</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.form.checkPassword !== '') {
            this.$refs.form.validateField('checkPassword')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
      return {
        infoShow: false,
        form: {
          userName: '',
          password: '',
          checkPassword: ''
        },
        rules: {
          userName: [{
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }],
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPassword: [{
            validator: validatePass2,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      onSubmit(formName) {
        const self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/api/registe',{
              params: {
                userName: this.form.userName,
                password: this.form.password
              } 
            })
            .then(function(response) {
              if(response.data.state===1){
                self.$router.push('/register-success')
              }else{
                self.infoShow = true
                self.info = '注册失败：该账号已存在'
              }
            }).then(function(error) {
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onCancle() {
        this.$router.push('/login')
      },
      getDateTimes(str) {
        var strs = new Date(str)
        return strs
      }
    }
  }
</script>

<style scoped>
  .register-box{
    width: 100%;
    height: 100%;
    background-color: #20222A;
  }

  .crumbs-register {
    background-color: #324157;
    height: 50px;
    line-height: 50px;
  }

  .register-title {
    line-height: 50px;
    margin: 0 auto;
    width: 100px;
    font-size: 16px;
  }

  .userContent {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 200px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    background-clip: padding-box;
    border: 1px soild #eaeaea;
    box-shadow: 0 0 5px #cac6c6;
  }

  .select-sex {
    width: 320px;
  }

  .ms-tips{
    position:absolute;
    margin-top:18px; 
    margin-left:80px;
    color: red;
  }
</style>
