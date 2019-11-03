<template>
  <el-menu
    class="menu-nav"
    router
    :default-active="currentPath"
    background-color="#20222A"
    text-color="rgba(255,255,255,.8)"
    active-text-color="#ffd04b"
    :collapse="isCollapse">
    <el-menu-item index="/home">
      <i class="el-icon-s-home"></i>
      <span slot="title">主页</span>
    </el-menu-item>

    <el-submenu index="/3d-tiles-tools">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>三维工具</span>
      </template>
      <el-menu-item index="/compressGltf">压缩glTF</el-menu-item>
       <el-menu-item index="/gltf2glb">glTF转glb</el-menu-item>
      <el-menu-item index="/glb2gltf">glb转glTF</el-menu-item>
      <el-menu-item index="/compress-glb">提取glTF纹理</el-menu-item>
    </el-submenu>

    <el-menu-item index="/presentation">
      <i class="el-icon-s-platform"></i>
      <span slot="title">成果展示</span>
    </el-menu-item>

    <el-menu-item index="">
      <i class="el-icon-s-order"></i>
      <span slot="title">学习笔记</span>
    </el-menu-item>

    <el-menu-item index="/history">
      <i class="el-icon-info"></i>
      <span slot="title">版本历史</span>
    </el-menu-item>

    <el-submenu index="/setting">
      <template slot="title">
        <i class="el-icon-s-tools"></i>
        <span>基本设置</span>
      </template>
      <el-menu-item index="/asd">个人信息</el-menu-item>
      <el-menu-item index="">系统设置</el-menu-item>
    </el-submenu>

    <el-menu-item index="">
      <i class="el-icon-s-help"></i>
      <span slot="title">操作记录</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: ['isCollapse'],
  data () {
    return {
      currentPath: location.pathname
    }
  }
}
</script>

<style scoped>
  .el-menu {
    border: none;
  }
  .menu-nav:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
