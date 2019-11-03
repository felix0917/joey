<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="输入">
            <el-input v-model="form.inputAbPath" placeholder="glb输入文件夹绝对路径"></el-input>
        </el-form-item>

        <el-form-item label="输出">
            <el-input v-model="form.outputAbPath" placeholder="gltf文件输出绝对路径"></el-input>
        </el-form-item>

        <el-form-item label="选取文件"> 
            <el-upload 
                multiple = "multiple" 
                action=""
                :on-preview="handlePreview" 
                :on-remove="handleRemove" 
                :auto-upload="false" 
                :on-change="onChange"
                :glbList = "glbList"
                drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
                <div slot="tip" class="el-upload__tip">*只能转换glb文件</div>
            </el-upload>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="startGlb2gltf">开始转换</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import utils from '../../utils/utils'
    export default {
        data(){
            return{
                form: {
                    inputAbPath:'',
                    outputAbPath:''     
                },
                glbList:''
            }
        },
        methods: {
            startGlb2gltf(){
                let self = this
                let list = self.glbList
                let inPutVal = self.form.inputAbPath
                let outPutVal = self.form.outputAbPath

                let gltfInfoArrStr = ''
                gltfInfoArrStr = inPutVal + ',' + 
                                 outPutVal + ',' 

                for(let i = 0;i<list.length;i++){
                    if(i<list.length-1)
                        gltfInfoArrStr += list[i].name + ','
                    else
                        gltfInfoArrStr += list[i].name
                }

                 //输入正确性检测
                let reg = utils.windowsPath//正则检测windows绝对路径
                if(inPutVal===''){
                    self.$message.error('请输入：glb输入文件夹绝对路径')
                    return
                }else if(!reg.test(inPutVal)){
                    self.$message.error('请正确输入：glb输入文件夹绝对路径')
                    return
                }else if(outPutVal===''){
                    self.$message.error('请输入：gltf文件输出绝对路径')
                    return 
                }else if(!reg.test(outPutVal)){
                    self.$message.error('请正确输入：gltf文件输出绝对路径')
                    return 
                }else if(list===''){
                    self.$message.error('请选择：glb文件')
                    return 
                }

                let xhr = new XMLHttpRequest();
                //监听响应
                xhr.onreadystatechange = function () {
                    if( xhr.readyState == 4  ){//已经接收全部响应数据
                        if( (xhr.status>=200 && xhr.status<300) || xhr.status==304 ){
                            // console.log( '-----请求并响应成功------' )
                            console.log('-----'+xhr.responseText+'-----')
                            //console.log( '-----请求并响应成功------' )
                        }else{
                            console.log( "请求未成功： " + xhr.status )
                        }
                    }
                }
                xhr.onready

                //调用后台压缩程序
                xhr.open('post','/glb2gltf',true)
                xhr.send(gltfInfoArrStr)
            },

            handleRemove(file, fileList) {
            },

            handlePreview(file) {
            },

            onChange(file,fileList) {
                const isGLB = file.name.substr(file.name.length-3) === 'glb'
                if (!isGLB) {
                    this.$message.error('转换文件只能是glb格式!')
                    fileList.pop()
                }else{
                    this.glbList = fileList
                }
                return isGLB
            },

            handleCancel(){
                while(this.glbList.length>=1){
                    this.glbList.pop()
                }
            }
        }
    }
</script>

<style scoped>

</style>