// ==UserScript==
// @name         111
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  111
// @author       111
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
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = unsafeWindow.$, layui, layer, courseList, cpi, clazzid, uid, uname, uschoolname, ua_str = str_z("32"), script_info = GM_info.script;
    //请求封装
    function requests(url, data = "", type = "get") {
        return new Promise((resolve, reject) => {


            var headers = {
                "User-Agent": "User-Agent: Dalvik/2.1.0 (Linux; U; Android 11; M3121K1AB Build/SKQ1.211006.001) (device:M3121K1AB) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74 (@Kalimdor)_" + ua_str,
                'X-Requested-With': 'XMLHttpRequest',
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            };

            GM_xmlhttpRequest({
                method: type,
                url: url,
                data: data,
                headers: headers,
                onload: function (xhr) {
                    try {
                        let obj = $.parseJSON(xhr.responseText) || {};
                        if (obj.error) {
                            layer.msg("请输入验证码");
                            layer.open({
                                type: 1,
                                title: "请输入验证码",
                                skin: 'layui-layer-rim',
                                area: ['420px', '240px'],
                                content: '<img src="' + obj.verify_png_path + '"/> <input type="text" class="code_input" placeholder="请输入图中的验证码" /><button id="code_btn">验证</button>'
                            });
                            $("#code_btn").on('click', function () {
                                let code = $(".code_input").val();
                                if (code.length !== 4) {
                                    layer.msg("输入错误！");
                                } else {
                                    let url = obj.verify_path + "&ucode=" + code;
                                    console.log(url);
                                    window.open(url);
                                }
                            });
                        }
                        resolve(obj);
                    }
                    catch (err) {
                        resolve(xhr.responseText);
                    }
                }
            });
        })
    }
    function sleep(time) {
        return new Promise(resolve =>
            setTimeout(resolve, time)
        )
    }
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
    //刷视频用的
    async function video_s(objectId, knowledgeId, cpi, clazzid, jobid, uid, otherInfo, rt = "0.9") {
        console.log("开始");
        let url = "https://mooc1-1.chaoxing.com/ananas/status/" + objectId + "?k=&flag=normal&"
        let obj = await requests(url);
        let duration = obj.duration;//视频总长度
        let dtoken = obj.dtoken;
        let clipTime = "0_" + duration;
        let timer;
        $("body").append('<div id="jdf" style="style="font-size: 38px; width:500px" class="layui-progress layui-progress-big" lay-filter="demo" lay-showPercent="true">当前播放视频进度<div id="jd" class="layui-progress-bar layui-bg-blue" lay-percent="0%"></div></div>');
        let beisu = $("#beisu").val() || 1;
        let num = 0;
        for (let playingTime = 0; playingTime <= duration; playingTime = playingTime + ~~beisu) {
            beisu = $("#beisu").val() || 1;
            layui.element.progress('demo', ~~(playingTime / duration * 100) + "%");
            add_log("视频已刷" + playingTime + " ,共 " + duration + "s");
            console.log($("#beisu").val() || 1, playingTime);
            let out = await sleep(1000);
            num = num + 1;
        }

        let req = await video_p(clazzid, uid, jobid, objectId, duration, duration, cpi, dtoken, otherInfo, rt);
        console.log(123, req);
        while (!req && $("#pattern").val() !== "2") {
            let req = await video_p(clazzid, uid, jobid, objectId, duration, duration, cpi, dtoken, otherInfo, rt);
            add_log("进度提交中...");
            let out = await sleep(1000);
        }
        $("#jdf").remove();
    }
    async function video_p(clazzid, uid, jobid, objectId, playingTime, duration, cpi, dtoken, otherInfo, rt) {
        let parms = "clazzid=" + clazzid + "&uid=" + uid + "&jobid=" + jobid + "&objectId=" + objectId + "&playingTime=" + playingTime + "&duration=" + duration;
        let enc = await requests("http://81.70.99.74/get_enc?" + parms);
        let url = "https://mooc1-api.chaoxing.com/multimedia/log/a/" + cpi + "/" + dtoken + "?otherInfo=" + otherInfo + "&playingTime=" + playingTime + "&duration=" + duration + "&akid=null&jobid=" + jobid + "&clipTime=0_" + duration + "&clazzId=" + clazzid + "&objectId=" + objectId + "&userid=" + uid + "&isdrag=4&enc=" + enc + "&rt=" + rt + "&dtype=Video&view=json";
        let obj = await requests(url);
        console.log(obj);
        if (obj.isPassed === undefined) {
            add_log("进度保存失败！", "err");
        }
        return obj.isPassed;
    }
    //刷直播用的
    async function live_s(streamName, vdoid, jobid, uid, knowledgeId, clazzid, courseid) {
        let url = 'https://live.chaoxing.com/courseLive/newpclive?streamName=' + streamName + '&vdoid=' + vdoid + '&width=630&height=530&jobid=' + jobid + '&userId=' + uid + '&knowledgeid=' + knowledgeId + '&ut=s&clazzid=' + clazzid + '&courseid=' + courseid;
        let obj = await requests(url);
        console.log(obj);
    }
    //刷文档
    async function document_s(jobid, knowledgeId, courseid, clazzid, jtoken) {
        let url = 'https://mooc1-2.chaoxing.com/ananas/job/document?jobid=' + jobid + '&knowledgeid=' + knowledgeId + '&courseid=' + courseid + '&clazzid=' + clazzid + '&jtoken=' + jtoken + '&_dc=1607066762782';
        let obj = await requests(url);
        console.log(obj);
        if (obj.status === true) {
            add_log("文档-" + obj.msg);
        } else {
            console.log(url);
            add_log("文档-" + obj.msg, "err");
        }
    }
    //学习次数
    async function log_s(courseid, clazzid, cpi) {
        let url = "https://mooc1-2.chaoxing.com/visit/stucoursemiddle?courseid=" + courseid + "&clazzid=" + clazzid + "&vc=1&cpi=" + cpi;
        let obj = await requests(url);
        url = "https://fystat-ans.chaoxing.com/log/setlog" + obj.split("/log/setlog")[1].split('">')[0];
        obj = await requests(url);
        console.log(url);
    }
    //章节
    async function task(workId, courseId, clazzId, knowledgeId, jobId, enc, cpi) {
        let url = "https://mooc1-api.chaoxing.com/work/phone/work?workId=" + workId + "&courseId=" + courseId + "&clazzId=" + clazzId + "&knowledgeId=" + knowledgeId + "&jobId=" + jobId + "&enc=" + enc + "&cpi=" + cpi;
        console.log(url);
        let obj = await requests(url);
        console.log(obj);
    }
    async function know_start(courseStartData) {
        //获取课程知识点
        let courseKnowData = {};
        for (let courseData of courseStartData) {
            add_log("【" + courseData[0] + "】课程正在读取");
            let debug = true;
            let url = "https://mooc1-api.chaoxing.com/gas/clazz?id=" + courseData[2] + "&personid=" + courseData[3] + "&fields=id,bbsid,classscore,isstart,allowdownload,chatid,name,state,isthirdaq,isfiled,information,discuss,visiblescore,begindate,coursesetting.fields(id,courseid,hiddencoursecover,hiddenwrongset,coursefacecheck),course.fields(id,name,infocontent,objectid,app,bulletformat,mappingcourseid,imageurl,teacherfactor,jobcount,expandreadstate,knowledge.fields(id,name,indexOrder,parentnodeid,status,layer,label,jobcount,begintime,endtime,attachment.fields(id,type,objectid,extension).type(video)))&view=json"
            let obj = await requests(url);
            debug && console.log(obj);
            let knowlist = obj.data[0].course.data[0].knowledge.data.filter(function (value) {
                if (value.parentnodeid === 0) {
                    courseKnowData[value.id] = [];
                } else {
                    if (courseKnowData[value.parentnodeid] === undefined) {
                        courseKnowData[value.parentnodeid] = []
                    }
                    courseKnowData[value.parentnodeid].push(value)
                }
                return true;
                return value.status === "open";
            });
            let knowlistId = [];
            for (let keys in courseKnowData) {
                for (let ids in courseKnowData[keys]) {
                    knowlistId.push(courseKnowData[keys][ids].id);
                }
            }
            let data = "courseid=" + courseData[1] + "&clazzid=" + courseData[2] + "&cpi=" + courseData[3] + "&nodes=" + knowlistId.join(",") + "&time=" + (new Date()).valueOf() + "&userid=" + uid + "&view=json";
            //筛选未完成知识点
            obj = await requests("https://mooc1-api.chaoxing.com/job/myjobsnodesmap", data, "post");
            debug && console.log(obj);
            let unfinishlist = knowlist.filter(function (value) {
                if ((value.jobcount !== 0 && obj[value.id].unfinishcount !== 0) || $("#pattern").val() === "2") {
                    return true;
                }
            });
            debug && console.log(unfinishlist);
            let unfinishlists = unfinishlist.map(function (value) {
                return value.id;
            });
            //开整
            for (let val of knowlistId) {
                //取章节内的知识点
                if (!unfinishlists.includes(val)) {
                    continue;
                }
                url = "https://mooc1-api.chaoxing.com/gas/knowledge?id=" + val + "&courseid=" + courseData[1] + "&fields=id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)&view=json";
                obj = await requests(url);
                let out = await sleep(1000);
                let cardData = obj.data[0].card.data.map(function (value) {
                    try {
                        return [value.cardorder, value.knowledgeid, $(value.description).find("iframe").attr("module")];
                    } catch (err) {
                        add_log("module不存在!", "err");
                        return [];
                    }
                });
                log_s(courseData[1], courseData[2], courseData[3]);
                for (let cardData1 of cardData) {
                    url = "https://mooc1-api.chaoxing.com/knowledge/cards?clazzid=" + courseData[2] + "&courseid=" + courseData[1] + "&knowledgeid=" + cardData1[1] + "&num=" + cardData1[0] + "&isPhone=0&control=true&cpi=" + courseData[3];
                    let text = await requests(url);
                    let out = await sleep(1000);
                    let result_json;
                    try {
                        result_json = $.parseJSON("{" + text.split("mArg = {")[1].split("};")[0] + "}").attachments;
                    } catch (err) {
                        add_log("章节未开放");
                        break;
                    }
                    debug && console.log(result_json);
                    for (let val1 of result_json) {
                        debug && console.log(val1);
                        let objectid, enc, workid, streamName, vdoid, jtoken, jobid, workenc;

                        switch (val1.type) {
                            case "video"://视频
                                add_log("刷视频 : " + val1.property.name);
                                objectid = val1.objectId;
                                jobid = val1.jobid;
                                await video_s(objectid, cardData1[1], courseData[3], courseData[2], jobid, uid, val1.otherInfo, val1.property.rt || "0.9");
                                break;
                            case "live"://直播
                                streamName = val1.property.streamName;
                                vdoid = val1.property.vdoid;
                                break;
                            case "document"://文档
                                add_log("刷文档: " + val1.property.name);
                                jtoken = val1.jtoken
                                jobid = val1.jobid || val1.property._jobid;
                                document_s(jobid, cardData1[1], courseData[1], courseData[2], jtoken)
                                break;
                            case "bookname"://阅读
                                jtoken = val1.jtoken
                                break;
                            case "workid"://章节作业
                                workenc = val1.enc;
                                workid = val1.property.workid;
                                jobid = val1.jobid;
                                break;
                            default:
                                break;
                        }
                        debug && console.log(val1);
                    }
                }
            }
        };
        add_log("任务已完成！");

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
    function add_log(text, type = "succ") {
        if ($("#log").find("div").length > 12) {
            $("#log").find("div")[0].remove()
        }
        let date = new Date();
        if (type === "succ") {
            $("#log").append('<div>' + dateFormat("YYYY-mm-dd HH:MM", date) + "  " + text + '</div>');
        } else {
            $("#log").append('<div style="color:red;">' + dateFormat("YYYY-mm-dd HH:MM", date) + "  " + text + '</div>');
        }
    }
    async function init() {
        //获取用户个人信息
        $("body").append('<a href="https://imgtu.com/i/XQ1TeJ"><img src="https://s1.ax1x.com/2022/05/29/XQ1TeJ.png" alt="XQ1TeJ.png" border="0" /></a>');
        $("#pattern").val() == "1";
        $("#beisu").val() == "1";
        $("body").append('<div style="color: red; font-size: 50px; "><select id="course_choose"><option value="0">全部课程</option></select><button id="start_btn">开始</button></div>');
        $("body").append('<div id="log" style="color: green; font-size: 50px; "></div>');
        let debug = true;
        add_log("长时间无法选课请重新登录学习通");
        try {
            let obj = await requests('https://sso.chaoxing.com/apis/login/userLogin.do');
            uid = obj.msg.puid;
            uname = obj.msg.name;
            uschoolname = obj.msg.schoolname;
        } catch (err) {
            let obj = await requests('https://sso.chaoxing.com/apis/login/userLogin4Uname.do');
            uid = obj.msg.puid;
            uname = obj.msg.name;
            uschoolname = obj.msg.schoolname;
        }
        //获取课程列表
        let obj = await requests('https://mooc1-api.chaoxing.com/mycourse/backclazzdata?view=json&mcode=');
        console.log(obj);
        courseList = obj.channelList.map(function (value, index) {
            if (value.content.course) {
                $("#course_choose").append('<option value="' + value.content.course.data[0].id + '">' + value.content.course.data[0].name + '</option>');
                return [value.content.course.data[0].name, value.content.course.data[0].id, value.key, value.cpi];
            } else {
                return [0, 0, 0, 0];
            }
        });
        debug && console.log(courseList);
        add_log("共获取" + courseList.length + "门课程");
        $("body").append("<h3 id='msg'></h3>");
        $("#start_btn").on('click', function () {
            let courseStartData = courseList.filter(function (value) {
                if (value[0] === 0) {
                    return false;
                }
                if (value[1].toString() === $("#course_choose").val() || $("#course_choose").val() === "0") {
                    return true;
                }
                return false;
            })

            know_start(courseStartData);
        });

    }
    $('head').append('<link href="https://lib.baomitu.com/layui/2.6.8/css/layui.css" rel="stylesheet" type="text/css" />');
    $.getScript("https://lib.baomitu.com/layui/2.6.8/layui.js", function (data, status, jqxhr) {
        layui = unsafeWindow.layui;
        layer = unsafeWindow.layer;
    });
    $(".root").remove();
    if (location.href.indexOf("base/settings") != -1) {
        init();
    } else if (location.href.indexOf("visit/interaction") != -1) {
        $(".btn_group").append('<a id="addCourse" class="jb_btn jb_btn_104 fs14" href="https://i.chaoxing.com/base/settings" target="_top">刷课页面</a>');
    }
})();