// ==UserScript==
// @name         勇志帮你刷学习通网课
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  勇志帮你刷学习通视频和文档
// @author       勇志先生
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @run-at       document-end
// @connect      sso.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      fystat-ans.chaoxing.com
// @connect      81.70.99.74
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    var menu_ALL = [
        ['menu_runDuringTheDay', '白天保持开启 (比晚上更亮一点)', '白天保持开启', true],
        ['menu_darkModeType', '点击切换模式', '点击切换模式', 3]
    ], menu_ID = [];
    for (let i=0;i<menu_ALL.length;i++){ // 如果读取到的值为 null 就写入默认值
        if (GM_getValue(menu_ALL[i][0]) == null){GM_setValue(menu_ALL[i][0], menu_ALL[i][3])};
    }
    registerMenuCommand();
    addStyle();
    // 注册脚本菜单
    function registerMenuCommand() {
        if (menu_ID.length > menu_ALL.length){ // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
            for (let i=0;i<menu_ID.length;i++){
                GM_unregisterMenuCommand(menu_ID[i]);
            }
        }
        for (let i=0;i<menu_ALL.length;i++){ // 循环注册脚本菜单
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
            if (menu_ALL[i][0] === 'menu_darkModeType') {
                if (menu_ALL[i][3] > 3){ // 避免在减少 raw 数组后，用户储存的数据大于数组而报错
                    menu_ALL[i][3] = 1;
                    GM_setValue('menu_darkModeType', menu_ALL[i][3]);
                }
                menu_ID[i] = GM_registerMenuCommand(`🔄 [ ${menu_ALL[i][3]} ] ${menu_ALL[i][1]}`, function(){menu_toggle(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`)});
            } else {
                menu_ID[i] = GM_registerMenuCommand(`🌝 [ ${menu_ALL[i][3]?'√':'×'} ] ${menu_ALL[i][1]}`, function(){menu_switch(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`,`${menu_ALL[i][2]}`)});
            }
        }
    }
    // 切换暗黑模式
    function menu_toggle(menu_status, Name) {
        menu_status = parseInt(menu_status)
        if (menu_status >= 3){
            menu_status = 1;
        } else {
            menu_status += 1;
        }
        GM_setValue(`${Name}`, menu_status);
        location.reload(); // 刷新网页
    };
    // 菜单开关
    function menu_switch(menu_status, Name, Tips) {
        if (menu_status == 'true'){
            GM_setValue(`${Name}`, false);
            GM_notification({text: `已关闭 [${Tips}] 功能\n（刷新网页后生效）`, timeout: 3500});
        }else{
            GM_setValue(`${Name}`, true);
            GM_notification({text: `已开启 [${Tips}] 功能\n（刷新网页后生效）`, timeout: 3500});
        }
        registerMenuCommand(); // 重新注册脚本菜单
    };
    // 返回菜单值
    function menu_value(menuName) {
        for (let menu of menu_ALL) {
            if (menu[0] == menuName) {
                return menu[3]
            }
        }
    }


    // 添加样式
    function addStyle() {
        let grayLevel,rgbValueArry,
            style_Add = document.createElement('style'),
            hours = new Date().getHours(),
            style = ``,
            style_00 = `body {background-color: #ffffff !important;}`,
            style_11 = `html {filter: brightness(80%) !important;}`,
            style_12 = `html {filter: brightness(70%) !important;}`,
            style_21 = `html {filter: brightness(85%) sepia(20%) !important;}`,
            style_22 = `html {filter: brightness(70%) sepia(30%) !important;}`,
            style_31 = `html {filter: invert(80%) !important;} img, video {filter: invert(1) !important;}`;

        // 判断网页是否没有设置背景颜色（没有背景颜色会导致滤镜对背景颜色无效）
        if (document.body) {
            rgbValueArry = window.getComputedStyle(document.body).backgroundColor.replace ('rgb(', '').replace ('rgba(', '').replace (')', '').split (', ');
            grayLevel = rgbValueArry [0] + rgbValueArry [1] + rgbValueArry [2];
            if (grayLevel === "000") style += style_00
        }

        switch(menu_value('menu_darkModeType')) {
            case 1:
                style += style_12;
                break;
            case 2:
                style += style_22;
                break;
            case 3:
                style += style_31;
                break;
        }
        style_Add.innerHTML = style;
        if (document.head) {
                document.head.appendChild(style_Add);
        } else { // 为了避免脚本运行的时候 head 还没加载导致报错
            let timer = setInterval(function(){
                if (document.head) {
                    document.head.appendChild(style_Add);
                    clearInterval(timer);
                }
            }, 1);
        }

        // 为了避免 body 还没加载导致无法检查是否设置背景颜色的备用措施
        if (!grayLevel) {
            let timer2 = setInterval(function(){
                if (document.body) {
                    let rgbValueArry = window.getComputedStyle(document.body).backgroundColor.replace ('rgb(', '').replace ('rgba(', '').replace (')', '').split (', '),
                        style_Add1 = document.createElement('style');
                    if (rgbValueArry [0] + rgbValueArry [1] + rgbValueArry [2] === "000") {
                        style_Add1.innerHTML = 'body {background-color: #ffffff !important;}';
                        document.head.appendChild(style_Add1);
                    }
                    clearInterval(timer2);
                }
            }, 1);
        }
    }
    var $=unsafeWindow.$,layui,layer,courseList,cpi,clazzid,uid,uname,uschoolname,ua_str=str_z("32"),script_info=GM_info.script;
    function requests(url,data="",type="get"){
        return new Promise((resolve, reject) => {
            var headers={
                    "User-Agent": "User-Agent: Dalvik/2.1.0 (Linux; U; Android 11; M3121K1AB Build/SKQ1.211006.001) (device:M3121K1AB) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74 (@Kalimdor)_"+ua_str,
                    'X-Requested-With': 'XMLHttpRequest',
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"
                };
            GM_xmlhttpRequest({
                method: type,
                url: url,
                data:data,
                headers: headers,
                onload: function (xhr) {
                    try {
                        let obj=$.parseJSON(xhr.responseText) || {};
                        if(obj.error){
                            layer.msg("请输入验证码");
                            layer.open({
                                type: 1,
                                title:"[勇志]被系统检测，请输入验证码",
                                skin: 'layui-layer-rim',
                                area: ['420px', '240px'],
                                content: '<img src="'+obj.verify_png_path+'"/> <input type="text" class="code_input" placeholder="请输入图中的验证码" /><button id="code_btn">验证</button>'
                            });
                            $("#code_btn").on('click',function(){
                                let code=$(".code_input").val();
                                if(code.length!==4){
                                    layer.msg("[勇志]验证码错误");
                                }else{
                                    let url=obj.verify_path+"&ucode="+code;
                                    console.log(url);
                                    window.open(url);
                                }
                            });
                        }
                        resolve(obj);
                    }
                    catch(err){
                        resolve(xhr.responseText);
                    }
                }
            });
        })
    }
    function sleep(time) {
        return new Promise(resolve =>
                           setTimeout(resolve,time)
                          ) }
    function str_z(len) {
        len = len || 32;
        let $chars = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    async function video_s(objectId,knowledgeId,cpi,clazzid, jobid,uid,otherInfo,rt="0.9"){
        console.log("我开始帮你刷课啦~");
        let url = "https://mooc1-1.chaoxing.com/ananas/status/" + objectId + "?k=&flag=normal&"
        let obj=await requests(url);
        let duration=obj.duration;//视频总长度
        let dtoken=obj.dtoken;
        let clipTime = "0_" + duration;
        let timer;
        $("body").append('<div id="jdf" style="width:500px" class="layui-progress layui-progress-big" lay-filter="demo" lay-showPercent="true">当前视频进度<div id="jd" class="layui-progress-bar layui-bg-blue" lay-percent="0%"></div></div>');
        let beisu=$("#beisu").val()||1;
        let num =0;
        for(let playingTime=0;playingTime<=duration;playingTime=playingTime+~~beisu){
            beisu=$("#beisu").val()||1;
            layui.element.progress('demo', ~~(playingTime/duration*100)+"%");
            add_log("这个视频已经看了"+playingTime+" - "+duration+"s");
            console.log($("#beisu").val()||1,playingTime);
            let out = await sleep(1000);
            if(num%~~(60/beisu)==0){
                let req=await video_p(clazzid,uid,jobid,objectId,playingTime,duration,cpi,dtoken,otherInfo,rt);
                if(req&&$("#pattern").val()!=="2"){
                    add_log("我刷完这节课了， 刷下一节课吧~");
                    break;
                }
            }
            num=num+1
        }
        let req=await video_p(clazzid,uid,jobid,objectId,duration,duration,cpi,dtoken,otherInfo,rt);
        console.log(123,req);
        while(!req&&$("#pattern").val()!=="2"){
            let req=await video_p(clazzid,uid,jobid,objectId,duration,duration,cpi,dtoken,otherInfo,rt);
            add_log("马上提交进度啦~");
            let out = await sleep(1000);
        }
        if(req){
            add_log("我刷完这节课了， 刷下一节课吧~");
        }
        $("#jdf").remove();
    }
    async function video_p(clazzid,uid,jobid,objectId,playingTime,duration,cpi,dtoken,otherInfo,rt){
        let parms="clazzid="+clazzid+"&uid="+uid+"&jobid="+jobid+"&objectId="+objectId+"&playingTime="+playingTime+"&duration="+duration;
        let enc=await requests("http://81.70.99.74/get_enc?"+parms);
        let url = "https://mooc1-api.chaoxing.com/multimedia/log/a/"+cpi+"/"+dtoken+"?otherInfo="+otherInfo+"&playingTime="+playingTime+"&duration="+duration+"&akid=null&jobid="+jobid+"&clipTime=0_"+duration+"&clazzId="+clazzid+"&objectId="+objectId+"&userid="+uid+"&isdrag=4&enc="+enc+"&rt="+rt+"&dtype=Video&view=json";
        let obj=await requests(url);
        console.log(obj);
        if(obj.isPassed===undefined){
            add_log("进度保存失败！联系勇志反馈一下","err");
        }
        return obj.isPassed;
    }
    async function live_s(streamName,vdoid,jobid,uid,knowledgeId,clazzid,courseid){
        let url='https://live.chaoxing.com/courseLive/newpclive?streamName=' + streamName + '&vdoid=' + vdoid + '&width=630&height=530&jobid=' + jobid + '&userId='+uid+'&knowledgeid='+knowledgeId+'&ut=s&clazzid='+clazzid+'&courseid='+courseid;
        let obj=await requests(url);
        console.log(obj);
    }
    async function document_s(jobid,knowledgeId,courseid,clazzid,jtoken){
        let url='https://mooc1-2.chaoxing.com/ananas/job/document?jobid='+jobid+'&knowledgeid='+knowledgeId+'&courseid='+courseid+'&clazzid='+clazzid+'&jtoken='+jtoken+'&_dc=1607066762782';
        let obj=await requests(url);
        console.log(obj);
        if(obj.status===true){
            add_log("文档-"+obj.msg);
        }else{
            console.log(url);
            add_log("文档-"+obj.msg,"err");
        }
    }
    async function log_s(courseid,clazzid,cpi){
        let url = "https://mooc1-2.chaoxing.com/visit/stucoursemiddle?courseid="+courseid+"&clazzid="+clazzid+"&vc=1&cpi="+cpi;
        let obj=await requests(url);
        url="https://fystat-ans.chaoxing.com/log/setlog"+obj.split("/log/setlog")[1].split('">')[0];
        obj=await requests(url);
        console.log(url);
        if(obj=="'success'"){
            add_log("我又学习了一次哦~");
        }
    }
    async function task(workId,courseId,clazzId,knowledgeId,jobId,enc,cpi){
        let url="https://mooc1-api.chaoxing.com/work/phone/work?workId="+workId+"&courseId="+courseId+"&clazzId="+clazzId+"&knowledgeId="+knowledgeId+"&jobId="+jobId+"&enc="+enc+"&cpi="+cpi;
        console.log(url);
        let obj=await requests(url);
        console.log(obj);
    }
    async function know_start(courseStartData){
        let courseKnowData={};
        for(let courseData of courseStartData){
            add_log("正在获取【"+courseData[0]+"】课程任务点了哦~");
            let debug=true;
            let url="https://mooc1-api.chaoxing.com/gas/clazz?id="+courseData[2]+"&personid="+courseData[3]+"&fields=id,bbsid,classscore,isstart,allowdownload,chatid,name,state,isthirdaq,isfiled,information,discuss,visiblescore,begindate,coursesetting.fields(id,courseid,hiddencoursecover,hiddenwrongset,coursefacecheck),course.fields(id,name,infocontent,objectid,app,bulletformat,mappingcourseid,imageurl,teacherfactor,jobcount,expandreadstate,knowledge.fields(id,name,indexOrder,parentnodeid,status,layer,label,jobcount,begintime,endtime,attachment.fields(id,type,objectid,extension).type(video)))&view=json"
            let obj=await requests(url);
            debug&&console.log(obj);
            let knowlist=obj.data[0].course.data[0].knowledge.data.filter(function(value){
                if(value.parentnodeid===0){
                    courseKnowData[value.id]=[];
                }else{
                    if(courseKnowData[value.parentnodeid]===undefined){
                        courseKnowData[value.parentnodeid]=[]
                    }
                    courseKnowData[value.parentnodeid].push(value)
                }
                return true;
            });
            let knowlistId=[];
            for(let keys in courseKnowData){
                for(let ids in courseKnowData[keys]){
                    knowlistId.push(courseKnowData[keys][ids].id);
                }
            }
            let data ="courseid="+courseData[1]+"&clazzid="+courseData[2]+"&cpi="+courseData[3]+"&nodes="+knowlistId.join(",")+"&time="+(new Date()).valueOf()+"&userid="+uid+"&view=json";
            $("#pattern").val()==="2"?add_log("已选择复习模式，开始补时长"):add_log("正在过滤已完成和未解锁的任务点..");
            obj=await requests("https://mooc1-api.chaoxing.com/job/myjobsnodesmap",data,"post");
            debug&&console.log(obj);
            let unfinishlist=knowlist.filter(function(value){
                if((value.jobcount!==0&&obj[value.id].unfinishcount!==0)||$("#pattern").val()==="2"){
                    return true;
                }
            });
            debug&&console.log(unfinishlist);
            let unfinishlists=unfinishlist.map(function(value){
                return value.id;
            });
            for(let val of knowlistId){
                if(!unfinishlists.includes(val)){
                    continue;
                }
                add_log("正在调取任务点中的视频哦~");
                url = "https://mooc1-api.chaoxing.com/gas/knowledge?id="+val+"&courseid="+courseData[1]+"&fields=id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)&view=json";
                obj=await requests(url);
                let out = await sleep(1000);
                let cardData=obj.data[0].card.data.map(function(value){
                    try {
                        return [value.cardorder,value.knowledgeid,$(value.description).find("iframe").attr("module")];
                    } catch(err){
                        add_log("module不存在!","err");
                        return [];
                    }
                });
                log_s(courseData[1],courseData[2],courseData[3]);
                for(let cardData1 of cardData){
                    url = "https://mooc1-api.chaoxing.com/knowledge/cards?clazzid="+courseData[2]+"&courseid="+courseData[1]+"&knowledgeid="+cardData1[1]+"&num="+cardData1[0]+"&isPhone=0&control=true&cpi="+courseData[3];
                    let text=await requests(url);
                    let out = await sleep(1000);
                    let result_json;
                    try {
                        result_json=$.parseJSON("{" + text.split("mArg = {")[1].split("};")[0] + "}").attachments;
                    } catch(err){
                        add_log("章节未开放");
                        break;
                    }
                    debug&&console.log(result_json);
                    for(let val1 of result_json){
                        debug&&console.log(val1);
                        let objectid,enc,workid,streamName,vdoid,jtoken,jobid,workenc;

                        switch(val1.type){
                            case "video":
                                add_log("我正在看 : "+val1.property.name);
                                objectid=val1.objectId;
                                jobid=val1.jobid;
                                await video_s(objectid,cardData1[1],courseData[3],courseData[2], jobid,uid,val1.otherInfo,val1.property.rt||"0.9");
                                break;
                            case "live":
                                add_log("","err");
                                streamName=val1.property.streamName;
                                vdoid=val1.property.vdoid;
                                break;
                            case "document":
                                add_log("我正在看: "+val1.property.name);
                                jtoken=val1.jtoken
                                jobid=val1.jobid||val1.property._jobid;
                                document_s(jobid,cardData1[1],courseData[1],courseData[2],jtoken)
                                break;
                            case "bookname":
                                add_log("","err");
                                jtoken=val1.jtoken
                                break;
                            case "workid":
                                workenc = val1.enc;
                                workid = val1.property.workid;
                                jobid=val1.jobid;
                                add_log("我不会做的章节测验- "+val1.property.title+" ","err");
                                break
                            default:
                                break
                        }
                        debug&&console.log(val1);
                    }
                }
            }
        };
        add_log("任务完成了哦~");

    }
    function dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),
            "m+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "M+": date.getMinutes().toString(),
            "S+": date.getSeconds().toString()
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
    function add_log(text,type="succ"){
        if($("#log").find("div").length>12){
            $("#log").find("div")[0].remove()
        }
        let date = new Date();
        if(type==="succ"){
            $("#log").append('<div>'+"[勇志]"+text+'</div>');
        }else{
            $("#log").append('<div style="color:red;">'+dateFormat("YYYY-mm-dd HH:MM", date)+"  "+text+'</div>');
        }
    }
    async function init(){
        $("body").append('<a href="https://imgtu.com/i/X8rYYq"><img src="https://s1.ax1x.com/2022/05/31/X8rYYq.png" alt="X8rYYq.png" border="0" /></a>');
        $("body").append('<div style="font-size: 50px; "><select id="pattern""><option value="1">刷任务点</option><option value="2">补时间</option></select><select id="beisu"><option value="1">1倍速</option><option value="2">2倍速</option><option value="4">4倍速</option><option value="8">8倍速</option><option value="16">16倍速</option><option value="99">99倍速</option></select><select id="course_choose"><option value="0">全部课程</option></select><button id="start_btn">开始</button></div>');
        $("body").append('<div id="log" style="color: green; font-size: 40px; "></div>');
        let debug=true;
        add_log("我在帮你获取课程信息哦~");
        try {
            let obj=await requests('https://sso.chaoxing.com/apis/login/userLogin.do');
            uid=obj.msg.puid;
            uname=obj.msg.name;
            uschoolname=obj.msg.schoolname;
        } catch(err){
            let obj=await requests('https://sso.chaoxing.com/apis/login/userLogin4Uname.do');
            uid=obj.msg.puid;
            uname=obj.msg.name;
            uschoolname=obj.msg.schoolname;
        }
        let obj=await requests('https://mooc1-api.chaoxing.com/mycourse/backclazzdata?view=json&mcode=');
        console.log(obj);
        courseList=obj.channelList.map( function(value,index){
            if(value.content.course){
                $("#course_choose").append('<option value="'+value.content.course.data[0].id+'">'+value.content.course.data[0].name+'</option>');
                return [value.content.course.data[0].name,value.content.course.data[0].id,value.key,value.cpi];
            }else{
                return [0,0,0,0];
            }
        });
        debug&&console.log(courseList);
        add_log("一共有"+courseList.length+"门课程");
        $("body").append("<h3 id='msg'></h3>");
        $("#start_btn").on('click',function(){
            let courseStartData=courseList.filter(function (value){
                if(value[0]===0){
                    return false;
                }
                if(value[1].toString()===$("#course_choose").val()||$("#course_choose").val()==="0"){
                    return true;
                }
                return false;
            })

            know_start(courseStartData);
        });
    }
    $('head').append('<link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');
    $.getScript("https://lib.baomitu.com/layui/2.6.8/layui.js", function(data, status, jqxhr) {
        layui=unsafeWindow.layui;
        layer=unsafeWindow.layer;
    });
    $(".root").remove();
    if(location.href.indexOf("base/settings")!=-1){
        init();
    }else if(location.href.indexOf("visit/interaction")!=-1){
        $(".btn_group").append('<a id="addCourse" class="jb_btn jb_btn_104 fs14" href="https://i.chaoxing.com/base/settings" target="_top">勇志帮你刷</a>');
    }
})();