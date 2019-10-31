<template>
  <div class="header-box">
    <el-row type="flex" justify="space-between">
      <el-col :span="6">
        <button class="btn-tool"  title="折叠" @click="collapse" >
            <i :class="collapseIcon" @click="changeIcon"></i>
        </button>
        <button class="btn-tool" title="刷新" @click="refresh">
            <i class="el-icon-refresh"></i>
        </button>
        <button class="btn-tool" title="全屏" @click="utils2.fullScreen">
            <i class="el-icon-rank"></i>
        </button>
        <button class="btn-tool" title="备忘录" @click="dialogVisible = true" >
          <i class="el-icon-edit"></i>
        </button>
      </el-col>
      <el-col :span="7" align="right">
        <span>{{ time }}</span>
        <el-dropdown trigger="click" class="user-name" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile" disabled>个人资料</el-dropdown-item>
            <el-dropdown-item command="updatepwd" disabled>修改密码</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-dialog width="500px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      @closed="saveNotes">
      <el-input
        type="textarea"
        :rows="7"
        placeholder="记录点什么："
        v-model="notes">
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
  import utils2 from '../../utils/utils2'
  export default {
    inject: ['reload'],
    data () {
      return {
        isCollapse: false,
        dialogVisible: false,
        notes: localStorage.getItem('notes') || '',
        collapseIcon:"el-icon-d-arrow-left",
        time:utils2.todayDate() + " " + new Date().getHours() + ":" + new Date().getMinutes()
      }
    },

    methods: {
      collapse () {
        this.$store.commit('switchCollapse')
      },
      refresh () {
        this.reload()
      },
      saveNotes () {
        localStorage.setItem('notes', this.notes)
      },
      handleCommand (command) {
        switch (command) {
          case 'logout':
            this.$router.replace({ path: '/login' })
            break
        }
      },
      changeIcon() {
        this.collapseIcon = this.collapseIcon == "el-icon-d-arrow-left" ? "el-icon-d-arrow-right" : "el-icon-d-arrow-left"
      }
    },

    computed: {
      username () {
        let username = sessionStorage.getItem('username')
        return username.toUpperCase()
      }
    },

    mounted(){
      setInterval(() => {
        let myTime = new Date()
        this.time = utils2.todayDate() + " " + myTime.getHours() + ":" + myTime.getMinutes()
      }, 6000);
    }
  }
</script>

<style scoped>
  .btn-tool {
    border: none;
    background: transparent;
    font-size: 18px;
    padding: 5px 10px;
    cursor: pointer;
    outline: none;
    text-align: left;
  }

  .user-name {
    margin-left: 20px;
  }

</style>
