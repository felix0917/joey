const http = require('http')
const fs = require('fs')
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

var count = 0// 全局变量  记录已经压缩好的gltf数量
var firstStartTime// 初始运行时间
var totalTime = 0//总运行时间
server.on( 'request', function (req, res) {
    serverStatic(res,'http://localhost:8080/')
    if( req.method == 'POST' ){
        var data = ""
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
                gltfPipeline(inPutPath,
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
            count = 0
            doCompress()
            res.end("压缩中......")
        })
    }
})

function gltfPipeline(inPutPath,
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

    const gltfPipeline = require('gltf-pipeline')
    const fsExtra = require('fs-extra')
    const processGltf = gltfPipeline.processGltf
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
            // fsExtra.writeJsonSync(outPutPath+"\\"+"compressed_"+gltfName, results.gltf)
            fsExtra.writeJsonSync(outPutPath+"\\" + gltfName, results.gltf)
            console.log(gltfName)
            count++
            let end=new Date()
            let endTime = end.getTime()
            console.log(gltfName + " :压缩成功" + " 用时 " + (endTime - startTime) + "ms")
            if(count === gltfTotalNum){
                endTime = end.getTime()
                totalTime = endTime-firstStartTime
                console.log("------全部 gltf 压缩成功！" + "输出文件夹为：" + outPutPath+"共用时：" + totalTime + "ms------\n")
            }
        })
}
server.listen(2500)
console.log('success listen at port:2500......')



