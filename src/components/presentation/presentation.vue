<template>
    <el-row>
        <el-col :span="8" v-for="(o,index) in 2" :key="o" :offset="index>0?2:0">
            <el-card :body-style="{ padding: '0px'}">
                <img src="static/img/presentation/screenshot1.jpg" width="100%" class="image">
                <div style="padding: 14px;">
                    <span>船舶动态三维场景</span>
                    <div>
                        <time class="time">{{ currentDate }}</time>
                        <el-button type="text" class="button">操作按钮</el-button>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data(){
        return {
            currentDate: new Date()
        };
    }
}
</script>

<style scoped>
.el-card{
    padding: 0;
}
</style>