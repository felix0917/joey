const http = require('http')
const fs = require('fs')
const fsExtra = require('fs-extra')
const gltfPipeline = require('gltf-pipeline')
const processGltf = gltfPipeline.processGltf
const gltfToGlb = gltfPipeline.gltfToGlb
const glbToGltf = gltfPipeline.glbToGltf
const server =  new http.Server()

function sendfile( res, abspath, data ) {
    res.writeHead(
        200,
        {'content-type': 'text/html'}
    )
    res.end( data )
}

function serverStatic(res,abspath) {
    fs.readFile( abspath, function (err,data){
        sendfile( res, abspath, data )
    })
}

var countCompress = 0// 全局变量  记录已经压缩好的gltf数量
var countGltf2glb = 0
var countGlb2gltf = 0
var countSeparateTextures = 0
var firstStartTime// 初始运行时间
var totalTime = 0//总运行时间
server.on( 'request', function (req, res) {
    serverStatic(res,'http://localhost:8080/')
    if( req.method === 'POST' && req.url === '/gltfCompress'){
        let data = ""
        req.on("data",function(chunk){
            data += chunk
        })
        req.on("end",function(){
            res.writeHead(
                200,{'Content-Type':'text/plain'}
            )
            //处理data获取参数
            let dataArr = data.split(",")
            let inPutPath = dataArr[0]
            let outPutPath = dataArr[1]
            let level = dataArr[2]
            let meshes = dataArr[3]
            let positionBits = dataArr[4]
            let normalBits = dataArr[5]
            let texcoordBits = dataArr[6]
            let colorBits = dataArr[7]
            let genericBits = dataArr[8]
            let unified = dataArr[9]
            let i = 10
            function doCompress(){
                let start=new Date()
                let startTime=start.getTime()
                gltfCompress(inPutPath,
                             outPutPath,
                             dataArr[i],
                             level,
                             meshes,
                             positionBits,
                             normalBits,
                             texcoordBits,
                             colorBits,
                             genericBits,
                             unified,
                            dataArr.length-10,
                             startTime)
                i++
                if(i<dataArr.length)
                    doCompress()
            }
            console.log('\n------开始压缩gltf,请耐心等待------')
            //记录压缩时间--开始时间
            let firstStart=new Date()
            firstStartTime=firstStart.getTime()
            //已压缩个数
            countCompress = 0
            doCompress()
            res.end("压缩中......")
        })
    }else if(req.method === 'POST' && req.url === '/gltf2glb'){
      let data = ""
      req.on("data",function(chunk){
        data += chunk
      })
      req.on("end",function(){
        res.writeHead(
          200,{'Content-Type':'text/plain'}
        )
        let dataArr = data.split(",")
        let inPutPath = dataArr[0]
        let outPutPath = dataArr[1]
        let i = 2
        function doGltf2glb() {
          let start=new Date()
          let startTime=start.getTime()
          let modelName = dataArr[i]
          let index = modelName.indexOf(".")
          gltf2glb(inPutPath, outPutPath, modelName.slice(0,index),dataArr.length-2,startTime)
          i++
          if(i<dataArr.length)
            doGltf2glb()
        }
        console.log('\n------开始转换gltf=>glb,请耐心等待------')
        //记录转换时间--开始时间
        let firstStart=new Date()
        firstStartTime=firstStart.getTime()
        //已转换个数
        countGlb2gltf = 0
        doGltf2glb()
        res.end("转换中......")
      })
    }else if(req.method === 'POST' && req.url === '/glb2gltf'){
      let data = ""
      req.on("data",function(chunk){
        data += chunk
      })
      req.on("end",function(){
        res.writeHead(
          200,{'Content-Type':'text/plain'}
        )
        let dataArr = data.split(",")
        let inPutPath = dataArr[0]
        let outPutPath = dataArr[1]
        let i = 2
        function doGlb2gltf() {
          let start=new Date()
          let startTime=start.getTime()
          let modelName = dataArr[i]
          let index = modelName.indexOf(".")
          glb2gltf(inPutPath, outPutPath, modelName.slice(0,index),dataArr.length-2,startTime)
          i++
          if(i<dataArr.length)
            doGlb2gltf()
        }
        console.log('\n------开始转换glb=>gltf,请耐心等待------')
        //记录转换时间--开始时间
        let firstStart=new Date()
        firstStartTime=firstStart.getTime()
        //已转换个数
        countGlb2gltf = 0
        doGlb2gltf()
        res.end("转换中......")
      })
    }else if(req.method === 'POST' && req.url === '/separateTextures'){
      let data = ""
      req.on("data",function(chunk){
        data += chunk
      })
      req.on("end",function(){
        res.writeHead(
          200,{'Content-Type':'text/plain'}
        )
        let dataArr = data.split(",")
        let inPutPath = dataArr[0]
        let outPutPath = dataArr[1]
        let i = 2
        function doSeparateTextures() {
          let start=new Date()
          let startTime=start.getTime()
          separateTextures(inPutPath, outPutPath, dataArr[i],dataArr.length-2,startTime)
          i++
          if(i<dataArr.length)
            doSeparateTextures()
        }
        console.log('\n------开始转换处理gltf纹理,请耐心等待------')
        //记录转换时间--开始时间
        let firstStart=new Date()
        firstStartTime=firstStart.getTime()
        //已转换个数
        countSeparateTextures = 0
        doSeparateTextures()
        res.end("处理中......")
      })
    }else{
      //doing nothing
    }
})

function gltfCompress(inPutPath,
                      outPutPath,
                      gltfName,
                      compressionLevel,
                      compressMeshes,
                      quantizePositionBits,
                      quantizeNormalBits,
                      quantizeTexcoordBits,
                      quantizeColorBits,
                      quantizeGenericBits,
                      unifiedQuantization,
                      gltfTotalNum,
                      startTime )
{
    let level = arguments[2] != null ? parseInt(compressionLevel) : 10
    let meshes = arguments[4] != null ? eval(compressMeshes.toLowerCase()): false
    let positionBits = arguments[5] !=null ? parseInt(quantizePositionBits) : 14
    let normalBits = arguments[6] !=null ? parseInt(quantizeNormalBits) : 10
    let texcoordBits = arguments[7] !=null ? parseInt(quantizeTexcoordBits) : 12
    let colorBits = arguments[8] !=null ? parseInt(quantizeColorBits) : 8
    let genericBits = arguments[9] !=null ? parseInt(quantizeGenericBits) : 12
    let unified = arguments[10] !=null ? eval(unifiedQuantization.toLowerCase()) : false

    const gltf = fsExtra.readJsonSync(inPutPath + "\\" + gltfName)
    const options = {
        dracoOptions: {
            compressionLevel:level,
            compressMeshes:meshes,
            quantizePositionBits:positionBits,
            quantizeNormalBits:normalBits,
            quantizeTexcoordBits:texcoordBits,
            quantizeColorBits:colorBits,
            quantizeGenericBits:genericBits,
            unifiedQuantization:unified
        }
    }
    processGltf(gltf, options)
        .then(function(results) {
           try{
             // fsExtra.writeJsonSync(outPutPath+"\\"+"compressed_"+gltfName, results.gltf)
             fsExtra.writeJsonSync(outPutPath+"\\" + gltfName, results.gltf)
             countCompress++
             let end=new Date()
             let endTime = end.getTime()
             console.log(gltfName + " :压缩成功" + " 用时 " + (endTime - startTime) + "ms")
             if(countCompress === gltfTotalNum){
               endTime = end.getTime()
               totalTime = endTime-firstStartTime
               console.log("------全部 gltf 压缩成功！" + "输出文件夹为：" + outPutPath+"共用时：" + totalTime + "ms------\n")
             }
           }catch (e) {
             console.log(e)
           }
        })
}

function gltf2glb(inPutPath, outPutPath,gltfName,gltfTotalNum, startTime) {
  const gltf = fsExtra.readJsonSync(inPutPath  + "\\" + gltfName + ".gltf")
  gltfToGlb(gltf)
    .then(function(results) {
      try {
        fsExtra.writeJsonSync(outPutPath + "\\" + gltfName  + ".glb" , results.glb)
        countGltf2glb++
        let end=new Date()
        let endTime = end.getTime()
        console.log(gltfName + + ".glb" + " :转换成功" + " 用时 " + (endTime - startTime) + "ms")
        if(countGltf2glb === gltfTotalNum){
          endTime = end.getTime()
          totalTime = endTime-firstStartTime
          console.log("------全部 gltf 转换成功！" + "输出文件夹为：" + outPutPath+"共用时：" + totalTime + "ms------\n")
        }
      }catch (e) {
        console.log(e)
      }
    })
}

function glb2gltf(inPutPath, outPutPath,glbName,glbTotalNum, startTime) {
  const glb = fsExtra.readJsonSync(inPutPath + "\\" + glbName + ".glb" )
  glbToGltf(glb)
    .then(function(results) {
      try {
        fsExtra.writeJsonSync(outPutPath + "\\" + glbName + ".gltf" , results.gltf)
        countGlb2gltf++
        let end=new Date()
        let endTime = end.getTime()
        console.log(glbName + ".glb" + " :转换成功" + " 用时 " + (endTime - startTime) + "ms")
        if(countGlb2gltf === glbTotalNum){
          endTime = end.getTime()
          totalTime = endTime-firstStartTime
          console.log("------全部 glb 转换成功！" + "输出文件夹为：" + outPutPath+"共用时：" + totalTime + "ms------\n")
        }
      }catch (e) {
        console.log(e)
      }
    })
}

function separateTextures(inPutPath,outPutPath,gltfName,gltfTotalNum, startTime) {
  const gltf = fsExtra.readJsonSync(inPutPath + "\\" + gltfName)
  const options = {
    separateTextures: true
  }
  processGltf(gltf, options)
    .then(function(results) {
      try {
        let randomStr = getRandom(6)
        let path = outPutPath + "\\" + gltfName + "_" + randomStr
        fs.mkdir(path,err=>{
          if(err)throw err
        })
        fsExtra.writeJsonSync(path + "\\" + gltfName, results.gltf)

        //Save separate resources
        const separateResources = results.separateResources;
        for (const relativePath in separateResources) {
          console.log(relativePath)
          if (separateResources.hasOwnProperty(relativePath)) {
            const resource = separateResources[relativePath];
            fsExtra.writeFileSync(path + "\\"  +  relativePath, resource);
          }
        }

        countSeparateTextures++
        let end=new Date()
        let endTime = end.getTime()
        console.log(gltfName + " :分离纹理成功" + " 用时 " + (endTime - startTime) + "ms")
        if(countSeparateTextures === gltfTotalNum){
          endTime = end.getTime()
          totalTime = endTime-firstStartTime
          console.log("------全部 gltf 分离纹理成功！" + "输出文件夹为：" + outPutPath +"共用时：" + totalTime + "ms------\n")
        }
      }catch (e) {
        console.log(e)
      }
    })
}

//生成n位随机小写字母
function  getRandom(n) {
  let res = ''
  for (; res.length < n; res += Math.random().toString(36).substr(2).toLowerCase()) {}
  return res.substr(0, n)
}

server.listen(2500)
console.log('success listen at port:2500......')




