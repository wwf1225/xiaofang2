webpackJsonp([18],{"9RjI":function(a,t){},HSJB:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n={name:"BizInspectionRecordSub",data:function(){return{advanced:!1,dataSource:[],dataSource2:[],params:{facilityNo:"",facilityLocation:"",patrolName:"",patrolDate:"",remark:""},visible:!1,loading:!1}},computed:{columns:function(){return[{title:"序号",width:80,customRender:function(a,t,e){return""+(e+1)},align:"center"},{title:"设备名称",dataIndex:"equipmentName",width:200,align:"center"},{title:"设备编号",dataIndex:"equipmentNo",width:300,align:"center"},{title:"生产/维修日期",dataIndex:"startTime",width:300,align:"center"},{title:"到期日",dataIndex:"endTime",width:300,align:"center"},{title:"巡检结果",dataIndex:"patrolResult",width:300,align:"center"},{title:"操作",dataIndex:"operation",scopedSlots:{customRender:"operation"},width:100,align:"center"}]},columns2:function(){return[{title:"序号",width:80,customRender:function(a,t,e){return""+(e+1)},align:"center"},{title:"检查项",dataIndex:"checkItem",align:"center"},{title:"检查结果",dataIndex:"answerResult",width:200,scopedSlots:{customRender:"answerResult"},align:"center"},{title:"备注",dataIndex:"remark",width:200,align:"center"}]}},mounted:function(){if(this.flag=this.$route.query.flag,"2"===this.flag){var a=JSON.parse(this.$route.query.data);this.params.id=a.id,this.params.facilityNo=a.facilityNo,this.params.facilityLocation=a.facilityLocation,this.params.facilityName=a.facilityName,this.params.patrolDate=a.patrolDate,this.params.patrolName=a.patrolName,this.params.remark=a.remark,this.dataSource=a.extBizInspectionRecordSub}},methods:{btnCancel:function(){this.$router.push("/business/bizInspectionRecord")},btnDetail:function(a){var t=this;this.loading=!0,this.visible=!0;var e=this.dataSource[a].id;this.$get("/business/inspection-record-sub/findInspectionRecordDetails/"+e).then(function(a){200===a.data.code?t.dataSource2=a.data.data:t.$message.warning(a.data.msg),t.loading=!1}).catch(function(){t.loading=!1})},handleOk:function(){this.visible=!1},onChange:function(a){}}},i={render:function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("a-card",{staticClass:"card-area",attrs:{bordered:!1}},[e("div",{class:a.advanced?"search":null},[e("a-form",[e("a-row",[e("a-col",{attrs:{span:8,offset:2}},[e("a-form-item",{attrs:{label:"设施编号",labelCol:{span:5},wrapperCol:{span:14}}},[e("a-input",{attrs:{disabled:""},model:{value:a.params.facilityNo,callback:function(t){a.$set(a.params,"facilityNo",t)},expression:"params.facilityNo"}})],1)],1),a._v(" "),e("a-col",{attrs:{span:8,offset:4}},[e("a-form-item",{attrs:{label:"设施位置",labelCol:{span:6,offset:4},wrapperCol:{span:14}}},[e("a-input",{attrs:{disabled:""},model:{value:a.params.facilityLocation,callback:function(t){a.$set(a.params,"facilityLocation",t)},expression:"params.facilityLocation"}})],1)],1)],1),a._v(" "),e("a-row",[e("a-col",{attrs:{span:8,offset:2}},[e("a-form-item",{attrs:{label:"设施名称",labelCol:{span:5},wrapperCol:{span:14}}},[e("a-input",{attrs:{disabled:""},model:{value:a.params.facilityName,callback:function(t){a.$set(a.params,"facilityName",t)},expression:"params.facilityName"}})],1)],1)],1),a._v(" "),e("a-row",[e("a-col",{attrs:{span:20,offset:2}},[e("a-form-item",{attrs:{label:"包含设备",labelCol:{span:2},wrapperCol:{span:22}}},[e("a-table",{attrs:{columns:a.columns,dataSource:a.dataSource,pagination:!1,loading:a.loading,bordered:""},scopedSlots:a._u([{key:"operation",fn:function(t,n,i){return[e("a",{on:{click:function(t){a.btnDetail(i)}}},[a._v("详情")])]}}])})],1)],1)],1),a._v(" "),e("br"),a._v(" "),e("a-modal",{attrs:{title:"详情",width:"70%"},on:{ok:a.handleOk},model:{value:a.visible,callback:function(t){a.visible=t},expression:"visible"}},[e("a-table",{attrs:{columns:a.columns2,dataSource:a.dataSource2,pagination:!1,loading:a.loading,bordered:""},scopedSlots:a._u([{key:"checkInput",fn:function(a,t){return[e("a-input",{attrs:{disabled:""}})]}},{key:"statusRadio",fn:function(t,n){return[e("a-switch",{attrs:{defaultChecked:""},on:{change:a.onChange}})]}}])})],1),a._v(" "),e("a-row",[e("a-col",{attrs:{span:8,offset:2}},[e("a-form-item",{attrs:{label:"巡检日期",labelCol:{span:5},wrapperCol:{span:14}}},[e("a-input",{attrs:{disabled:""},model:{value:a.params.patrolDate,callback:function(t){a.$set(a.params,"patrolDate",t)},expression:"params.patrolDate"}})],1)],1),a._v(" "),e("a-col",{attrs:{span:8,offset:4}},[e("a-form-item",{attrs:{label:"巡检人",labelCol:{span:6,offset:4},wrapperCol:{span:14}}},[e("a-input",{attrs:{disabled:""},model:{value:a.params.patrolName,callback:function(t){a.$set(a.params,"patrolName",t)},expression:"params.patrolName"}})],1)],1)],1),a._v(" "),e("br"),a._v(" "),e("a-row",{staticStyle:{"text-align":"center"}},[e("a-col",[e("a-button",{on:{click:a.btnCancel}},[a._v("返回")])],1)],1)],1)],1)])},staticRenderFns:[]},o=e("VU/8")(n,i,!1,function(a){e("9RjI")},"data-v-6cef583d",null);t.default=o.exports}});