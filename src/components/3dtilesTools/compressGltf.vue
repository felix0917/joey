<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="输入">
            <el-input v-model="form.inputAbPath" placeholder="gltf输入文件夹绝对路径"></el-input>
        </el-form-item>

        <el-form-item label="输出">
            <el-input v-model="form.outputAbPath" placeholder="gltf压缩文件输出绝对路径"></el-input>
        </el-form-item>

        <el-form-item label="压缩级别">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        
       <el-form-item label="选取文件"> 
            <el-upload 
                multiple = "multiple" 
                action=""
                :on-preview="handlePreview" 
                :on-remove="handleRemove" 
                :auto-upload="false" 
                :on-change="onChange"
                :gltfList = "gltfList"
                drag
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
                <!-- <el-button slot="trigger" type="primary" size="middle">选取文件</el-button> -->
                <div slot="tip" class="el-upload__tip">*只能上传gltf文件</div>
            </el-upload>
       </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="startCompress">开始压缩</el-button>
            <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import utils from '../../utils/utils'
    //   import axios from 'axios'
    export default {
        data() {
        return {
            form: {
                inputAbPath:'',
                outputAbPath:''
            },
            options:[
                {
                    value:1,
                    label:'1级'
                },
                {
                    value:2,
                    label:'2级'
                },
                {
                    value:3,
                    label:'3级'
                },
                {
                    value:4,
                    label:'4级'
                },
                {
                    value:5,
                    label:'5级'
                },
                {
                    value:6,
                    label:'6级'
                },
                {
                    value:7,
                    label:'7级'
                },
                {
                    value:8,
                    label:'8级'
                },
                {
                    value:9,
                    label:'9级'
                },
                {
                    value:10,
                    label:'10级'
                }
            ],
            value:'',
            gltfList:''
        }
        },
        methods: {
            startCompress() {
                let self = this
                let list = self.gltfList
                let level = self.value
                let inPutVal = self.form.inputAbPath
                let outPutVal = self.form.outputAbPath
                let gltfInfoArrStr = ''
                gltfInfoArrStr = inPutVal + ',' + outPutVal + ',' + level + ','
                for(var i = 0;i<list.length;i++){
                    if(i<list.length-1)
                        gltfInfoArrStr += list[i].name + ','
                    else
                        gltfInfoArrStr += list[i].name
                }

                //输入正确性检测
                let reg = utils.windowsPath//正则检测windows绝对路径
                if(inPutVal===''){
                    self.$message.error('请输入：gltf输入文件夹绝对路径')
                    return
                }else if(!reg.test(inPutVal)){
                    self.$message.error('请正确输入：gltf输入文件夹绝对路径')
                    return
                }else if(outPutVal===''){
                    self.$message.error('请输入：gltf压缩文件输出绝对路径')
                    return 
                }else if(!reg.test(outPutVal)){
                    self.$message.error('请正确输入：gltf压缩文件输出绝对路径')
                    return 
                }else if(level===''){
                    self.$message.error('请选择：压缩等级')
                    return 
                }else if(list===''){
                    self.$message.error('请选择：gltf文件')
                    return 
                }
                
                let xhr = new XMLHttpRequest();
                //监听响应
                xhr.onreadystatechange = function () {
                    if( xhr.readyState == 4  ){//已经接收全部响应数据
                        if( (xhr.status>=200 && xhr.status<300) || xhr.status==304 ){
                            // console.log( '-----请求并响应成功------' );
                            console.log('-----'+xhr.responseText+'-----');
                            //console.log( '-----请求并响应成功------' );
                        }else{
                            console.log( "请求未成功： " + xhr.status );
                        }
                    }
                }
                xhr.onready;

                //调用后台压缩程序
                xhr.open('post','/tools',true)
                xhr.send(gltfInfoArrStr);

                self.initWebSocket()
                self.websocketonopen("nihao")
            },

            handleRemove(file, fileList) {
            },

            handlePreview(file) {
            },

            onChange(file,fileList) {
                const isGLTF = file.name.substr(file.name.length-4)=== 'gltf'
                if (!isGLTF) {
                    this.$message.error('上传文件只能是gltf格式!')
                    fileList.pop()
                }else{
                    this.gltfList = fileList
                }
                return isGLTF
            },

            handleCancel(){
                while(this.gltfList.length>=1){
                    this.gltfList.pop()
                }
            },

            //websocket
            initWebSocket() {//初始化weosocket
                const wsuri = 'localhost:2500'//ws地址
                this.websock = new WebSocket(wsuri)
                this.websock.onmessage = this.websocketonmessage
                this.websock.onopen = this.websocketonopen
                this.websock.onerror = this.websocketonerror
                this.websock.onclose = this.websocketclose
            },
            websocketonopen(data) {//连接建立之后执行send方法发送数据
                this.websocketsend(data)
                console.log('WebSocket连接成功')
            },
            websocketonerror(e) {//连接建立失败重连
                this.initWebSocket()
            },
            websocketonmessage(e) {//数据接收
                const redata = JSON.parse(e.data)
                console.log(redata.value)
            },
            websocketsend(Data) {//数据发送
                this.websock.send(Data)
            },
            websocketclose(e) {//关闭连接
                console.log('断开连接', e)
            }
        }
    }
</script>