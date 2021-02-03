webpackJsonp([54],{H3jX:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Dd8w"),d=a.n(r),s=a("g4PW"),i=a.n(s),o=a("+6Bu"),n=a.n(o),c={labelCol:{span:3},wrapperCol:{span:18}},l={name:"DeptEdit",props:{deptEditVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:c,form:this.$form.createForm(this),deptTreeKey:+new Date,dept:{},checkedKeys:[],expandedKeys:[],defaultCheckedKeys:[],deptTreeData:[]}},methods:{reset:function(){this.loading=!1,this.deptTreeKey=+new Date,this.expandedKeys=this.checkedKeys=this.defaultCheckedKeys=[],this.button={},this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleCheck:function(e){this.checkedKeys=e},handleExpand:function(e){this.expandedKeys=e},setFormValues:function(e){var t=n()(e,[]);this.form.getFieldDecorator("deptName"),this.form.setFieldsValue({deptName:t.text}),this.form.getFieldDecorator("orderNum"),this.form.setFieldsValue({orderNum:t.order}),"0"!==t.parentId&&(this.defaultCheckedKeys.push(t.parentId),this.checkedKeys=this.defaultCheckedKeys,this.expandedKeys=this.checkedKeys),this.dept.deptId=t.id},handleSubmit:function(){var e=this,t=i()(this.checkedKeys.checked,void 0)?this.checkedKeys:this.checkedKeys.checked;return t.length>1?void this.$message.error("最多只能选择一个上级部门，请修改"):t[0]===this.dept.deptId?void this.$message.error("不能选择自己作为上级部门，请修改"):void this.form.validateFields(function(a,r){if(!a){e.loading=!0;var s=e.form.getFieldsValue();s.parentId=t[0],i()(s.parentId,void 0)&&(s.parentId=0),s.deptId=e.dept.deptId,e.$put("dept",d()({},s)).then(function(){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1})}})}},watch:{deptEditVisiable:function(){var e=this;this.deptEditVisiable&&this.$get("dept").then(function(t){e.deptTreeData=t.data.rows.children,e.deptTreeKey=+new Date})}}},h={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"修改按钮",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.deptEditVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",e._b({attrs:{label:"部门名称"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["deptName",{rules:[{required:!0,message:"部门名称不能为空"},{max:20,message:"长度不能超过20个字符"}]}],expression:"['deptName',\n                 {rules: [\n                  { required: true, message: '部门名称不能为空'},\n                  { max: 20, message: '长度不能超过20个字符'}\n                ]}]"}]})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"部门排序"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["orderNum"],expression:"['orderNum']"}],staticStyle:{width:"100%"}})],1),e._v(" "),a("a-form-item",e._b({staticStyle:{"margin-bottom":"2rem"},attrs:{label:"上级部门"}},"a-form-item",e.formItemLayout,!1),[a("a-tree",{key:e.deptTreeKey,attrs:{checkable:!0,checkStrictly:!0,expandedKeys:e.expandedKeys,defaultCheckedKeys:e.defaultCheckedKeys,treeData:e.deptTreeData},on:{check:e.handleCheck,expand:e.handleExpand}})],1)],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},m=a("VU/8")(l,h,!1,null,null,null);t.default=m.exports}});