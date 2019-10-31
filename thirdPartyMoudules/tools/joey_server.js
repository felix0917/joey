const http = require('http');
const fs = require('fs');
const server =  new http.Server();

function sendfile( res, abspath, data ) {
    res.writeHead(
        200,
        {'content-type': 'text/html'}
    );
    res.end( data );
}

function serverStatic(res,abspath) {
    fs.readFile( abspath, function (err,data){
        sendfile( res, abspath, data )
    })
}

var count = 0;// 全局变量  记录已经压缩好的gltf数量
var firstStartTime;// 初始运行时间
var totalTime = 0;//总运行时间
server.on( 'request', function (req, res) {
    serverStatic(res,'http://localhost:8082/');
    if( req.method == 'POST' ){
        var data = "";
        req.on("data",function(chunk){
            data += chunk;
        })
        req.on("end",function(){
            res.writeHead(
                200,{'Content-Type':'text/plain'}
            )
            //处理data获取参数
            let dataArr = data.split(",");
            let inPutPath = dataArr[0];
            let outPutPath = dataArr[1];
            let level = dataArr[2];
            let i=3;
            function doCompress(){
                let start=new Date();
                let startTime=start.getTime();
                gltfPipeline(inPutPath,outPutPath,dataArr[i],level,dataArr.length-3,startTime);
                i++;
                if(i<dataArr.length)
                    doCompress();
            }
            console.log('\n------开始压缩gltf,请耐心等待------');
            //记录压缩时间--开始时间
            let firstStart=new Date();
            firstStartTime=firstStart.getTime();
            //已压缩个数
            count=0;
            doCompress();
            res.end("压缩中......");
        })
    }
})

function gltfPipeline(inPutPath,outPutPath,gltfName,compressionLevel,gltfTotalNum,startTime){
    let level = arguments[2]!=null ? parseInt(compressionLevel) : 10;
    const gltfPipeline = require('gltf-pipeline');
    const fsExtra = require('fs-extra');
    const processGltf = gltfPipeline.processGltf;
    const gltf = fsExtra.readJsonSync(inPutPath+"\\"+gltfName);
    const options = {
        dracoOptions: {
            compressionLevel: level
        }
    };
    processGltf(gltf, options)
        .then(function(results) {
            fsExtra.writeJsonSync(outPutPath+"\\"+"compressed_"+gltfName, results.gltf);
            count++;
            let end=new Date();
            let endTime = end.getTime();
            console.log(gltfName+" :压缩成功" + " 用时 "+(endTime-startTime) + "ms");
            if(count==gltfTotalNum){
                endTime = end.getTime();
                totalTime = endTime-firstStartTime;
                console.log("------全部 gltf 压缩成功！"+"输出文件夹为："+outPutPath+"共用时："+totalTime+"ms------\n");
            }
        });
}
server.listen(2500);
console.log('success listen at port:2500......');



