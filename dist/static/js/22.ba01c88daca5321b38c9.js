webpackJsonp([22],{drNb:function(t,e){},"oV/+":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("mtWM"),r=a.n(s),o=a("PJh5"),c=a.n(o);c.a.locale("zh-cn");var m={data:function(){return{time:"",loading:!0,tomcat:{sessions:{created:0,expired:0,active:{current:0,max:0},rejected:0},global:{sent:0,request:{count:0,max:0,totalTime:0}},servlet:{request:{count:0,totalTime:0,max:0}},threads:{current:0,configMax:0}}}},mounted:function(){this.create()},methods:{create:function(){var t=this;this.time=c()().format("YYYY年MM月DD日 HH时mm分ss秒"),r.a.all([this.$get("actuator/metrics/tomcat.sessions.created"),this.$get("actuator/metrics/tomcat.sessions.expired"),this.$get("actuator/metrics/tomcat.sessions.active.current"),this.$get("actuator/metrics/tomcat.sessions.active.max"),this.$get("actuator/metrics/tomcat.sessions.rejected"),this.$get("actuator/metrics/tomcat.global.sent"),this.$get("actuator/metrics/tomcat.global.request.max"),this.$get("actuator/metrics/tomcat.global.request"),this.$get("actuator/metrics/tomcat.servlet.request"),this.$get("actuator/metrics/tomcat.servlet.request.max"),this.$get("actuator/metrics/tomcat.threads.current"),this.$get("actuator/metrics/tomcat.threads.config.max")]).then(function(e){t.tomcat.sessions.created=e[0].data.measurements[0].value,t.tomcat.sessions.expired=e[1].data.measurements[0].value,t.tomcat.sessions.active.current=e[2].data.measurements[0].value,t.tomcat.sessions.active.max=e[3].data.measurements[0].value,t.tomcat.sessions.rejected=e[4].data.measurements[0].value,t.tomcat.global.sent=e[5].data.measurements[0].value,t.tomcat.global.request.max=e[6].data.measurements[0].value,t.tomcat.global.request.count=e[7].data.measurements[0].value,t.tomcat.global.request.totalTime=e[7].data.measurements[1].value,t.tomcat.servlet.request.count=e[8].data.measurements[0].value,t.tomcat.servlet.request.totalTime=e[8].data.measurements[1].value,t.tomcat.servlet.request.max=e[9].data.measurements[0].value,t.tomcat.threads.current=e[10].data.measurements[0].value,t.tomcat.threads.configMax=e[11].data.measurements[0].value,t.loading=!1}).catch(function(e){t.$message.error("获取Tomcat信息失败")})}}},v={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-skeleton",{attrs:{active:"",loading:t.loading,paragraph:{rows:17}}},[a("div",{staticClass:"jvm-info"},[a("div",{staticClass:"alert"},[a("a-alert",{attrs:{type:"success","show-icon":!0}},[a("div",{attrs:{slot:"message"},slot:"message"},[t._v("\n          数据获取时间 "+t._s(this.time)+"\n          "),a("a",{staticStyle:{"margin-left":"24px"},on:{click:t.create}},[t._v("点击刷新")])])])],1),t._v(" "),a("table",[a("tr",[a("th",[t._v("参数")]),t._v(" "),a("th",[t._v("描述")]),t._v(" "),a("th",[t._v("当前值")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"green"}},[t._v("tomcat.sessions.created")])],1),t._v(" "),a("td",[t._v("tomcat 已创建 session 数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.sessions.created)+" 个")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"green"}},[t._v("tomcat.sessions.expired")])],1),t._v(" "),a("td",[t._v("tomcat 已过期 session 数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.sessions.expired)+" 个")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"green"}},[t._v("tomcat.sessions.active.current")])],1),t._v(" "),a("td",[t._v("tomcat 当前活跃 session 数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.sessions.active.current)+" 个")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"green"}},[t._v("tomcat.sessions.active.max")])],1),t._v(" "),a("td",[t._v("tomcat 活跃 session 数峰值")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.sessions.active.max)+" 个")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"green"}},[t._v("tomcat.sessions.rejected")])],1),t._v(" "),a("td",[t._v("超过session 最大配置后，拒绝的 session 个数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.sessions.rejected)+" 个")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"purple"}},[t._v("tomcat.global.sent")])],1),t._v(" "),a("td",[t._v("发送的字节数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.global.sent)+" bytes")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"purple"}},[t._v("tomcat.global.request.max")])],1),t._v(" "),a("td",[t._v("request 请求最长耗时")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.global.request.max)+" 秒")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"purple"}},[t._v("tomcat.global.request.count")])],1),t._v(" "),a("td",[t._v("全局 request 请求次数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.global.request.count)+" 次")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"purple"}},[t._v("tomcat.global.request.totalTime")])],1),t._v(" "),a("td",[t._v("全局 request 请求总耗时")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.global.request.totalTime)+" 秒")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"cyan"}},[t._v("tomcat.servlet.request.max")])],1),t._v(" "),a("td",[t._v("servlet 请求最长耗时")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.servlet.request.max)+" 秒")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"cyan"}},[t._v("tomcat.servlet.request.count")])],1),t._v(" "),a("td",[t._v("servlet 总请求次数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.servlet.request.count)+" 次")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"cyan"}},[t._v("tomcat.servlet.request.totalTime")])],1),t._v(" "),a("td",[t._v("servlet 请求总耗时")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.servlet.request.totalTime)+" 秒")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"pink"}},[t._v("tomcat.threads.current")])],1),t._v(" "),a("td",[t._v("tomcat 当前线程数（包括守护线程）")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.threads.current)+" 个")])]),t._v(" "),a("tr",[a("td",[a("a-tag",{attrs:{color:"pink"}},[t._v("tomcat.threads.configMax")])],1),t._v(" "),a("td",[t._v("tomcat 配置的线程最大数")]),t._v(" "),a("td",[t._v(t._s(t.tomcat.threads.configMax)+" 个")])])])])])},staticRenderFns:[]},n=a("VU/8")(m,v,!1,function(t){a("drNb")},null,null);e.default=n.exports}});