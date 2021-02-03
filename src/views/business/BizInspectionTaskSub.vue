<template>
    <!-- 巡检任务子页面-->
    <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
            <!-- 查询部分       -->
            <a-form layout="horizontal" :form="form">
                <a-row>
                    <div :class="advanced ? null: 'fold'">
                        <a-col :span="8" offset="2">
                            <!--    v-decorator="['facilityId', rule.facilityId]"         -->
                            <a-form-item label="设施编号" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                                <a-select placeholder="请选择" size="default" v-model="params.facilityId"
                                          style="width: 100%" @change="loadFacilityData">
                                    <a-select-option v-for="item in facilityNoList" :disabled="disabledSelect(item.id)"
                                                     :key="item.id" :value="item.id">{{item.facilityNo}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" offset="4">
                            <a-form-item label="设施位置" :labelCol="{span: 6, offset:4}" :wrapperCol="{span: 14}">
                                <a-input disabled v-model="params.facilityLocation"/>
                            </a-form-item>
                        </a-col>
                    </div>
                </a-row>
                <a-row>
                    <a-col :span="8" offset="2">
                        <a-form-item label="设施名称" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                            <a-input disabled v-model="params.facilityName"/>
                        </a-form-item>
                    </a-col>
                </a-row>
                <!--  table表格区域-->
                <a-row>
                    <a-col :span="20" offset="2">
                        <a-form-item label="包含设备" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
                            <a-table :columns="columns"
                                     :dataSource="dataSource"
                                     :pagination="false"
                                     :loading="loading" bordered>
                                <template slot="operation" slot-scope="text, record,index">
                                    <a @click="delRow(index)">刪除</a>
                                </template>
                            </a-table>
                        </a-form-item>
                    </a-col>
                </a-row>
                <br/>
                <!--     底部查询区域       -->
                <div>
                    <a-row>
                        <a-col :span="8" offset="2">
                            <a-form-item label="计划巡检日期" :labelCol="{span: 10}" :wrapperCol="{span: 14}">
                                <!--                                <a-input placeholder="请输入1~28计划巡检日" v-model="params.patrolDate"-->
                                <!--                                         v-decorator="['patrolDate', rule.patrolDate]"></a-input>-->
                                <a-date-picker style="width: 100%;" v-model="params.patrolDate"
                                               v-decorator="['patrolDate', rule.patrolDate]" format="YYYY-MM-DD"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" offset="4">
                            <a-form-item label="巡检人" :labelCol="{span: 6,offset: 4}" :wrapperCol="{span: 14}">
                                <a-select placeholder="请选择" style="width: 100%" v-model="params.patrolId"
                                          v-decorator="['patrolId', rule.patrolId]">
                                    <a-select-option v-for="item in userList" :key="item.userId"
                                                     :value="item.userId">
                                        {{item.username}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <br/>
                <!-- 底部按钮-->
                <div>
                    <a-row style="text-align: center">
                        <a-button @click="btnCancel">返回</a-button>
                        <a-button @click="btnSave" style="margin-left: 8px;">提交</a-button>
                    </a-row>
                </div>
            </a-form>
        </div>
    </a-card>
</template>
<script>
import moment from 'moment'
import store from '../../store/index.js'

export default {
  name: 'BizInspectionTaskSub',
  data () {
    return {
      advanced: false,
      form: this.$form.createForm(this),
      dataSource: [],
      loading: false,
      params: {
        id: '',
        facilityId: undefined,
        facilityLocation: '',
        facilityName: '',
        patrolId: undefined,
        patrolDate: undefined,
        createId: '',
        modifyId: ''
      },
      rule: {
        facilityId: {
          rules: [
            {required: true, message: '请选择设施编号'}
          ]
        },
        patrolDate: {
          rules: [
            {required: true, message: '请选择计划巡检日期'}
            // {pattern: '^([1-9]|1[0-9]|2[0-8])$', message: '请输入1~28正整数'}
          ]
        },
        patrolId: {
          rules: [
            {required: true, message: '请选择巡检人'}
          ]
        }
      },
      facilityNoList: [],
      facilityIdTask: [],
      userList: [],
      flag: ''
    }
  },
  computed: {
    columns () {
      return [{
        title: '序号',
        width: 80,
        customRender: (value, row, index) => `${index + 1}`,
        align: 'center'
      }, {
        title: '设备名称',
        dataIndex: 'equipmentName',
        width: 200,
        align: 'center'
      }, {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        width: 300,
        align: 'center'
      }, {
        title: '生产/维修日期',
        dataIndex: 'startTime',
        width: 300,
        align: 'center'
      }, {
        title: '到期日',
        dataIndex: 'endTime',
        width: 300,
        align: 'center'
      }]
    }
  },
  mounted () {
    // flag为1表示添加,2为编辑
    this.flag = this.$route.query.flag
    // 初始化获取设施编号列表
    this.getFacilityNoList()
    // 初始化获取用户下拉列表
    this.getUserList()
    // 初始化获取已存在任务中的设施
    this.findTaskFacilityList()
    // 初始化加载编辑数据
    if (this.flag === '2') {
      const data = JSON.parse(this.$route.query.data)
      this.params.id = data.id
      this.params.facilityId = data.facilityId
      this.params.facilityLocation = data.facilityLocation
      this.params.facilityName = data.facilityName
      this.params.patrolDate = data.patrolDate.toString()
      this.params.patrolId = data.patrolId
      this.dataSource = data.baseFacilitySub
      this.form.setFieldsValue({
        facilityId: data.facilityId,
        patrolDate: this.params.patrolDate,
        patrolId: data.patrolId
      })
    }
  },
  methods: {
    // 禁用已经存在任务列表的设施
    disabledSelect (id) {
      if (this.flag === '2') {
        const index = this.facilityIdTask.indexOf(this.$route.query.data.facilityId)
        if (index !== -1) {
          this.facilityIdTask.splice(index, 1)
        }
      }
      return this.facilityIdTask.indexOf(id) === -1 ? false : true
    },
    // 查询存在的任务设施列表
    findTaskFacilityList () {
      this.$get('/business/inspection-task/findTaskFacilityList').then(r => {
        if (r.data.code === 200) {
          this.facilityIdTask = r.data.data
        }
      })
    },
    // 获取设施编号列表
    getFacilityNoList () {
      this.loading = true
      this.$get('/base/facility/findBaseFacilityList').then((r) => {
        if (r.data.code === 200) {
          this.facilityNoList = r.data.data
        }
        this.loading = false
      }).catch(r => {
        this.loading = false
      })
    },
    // 获取用户下拉列表
    getUserList () {
      this.loading = true
      this.$get('/user/getUserNameList').then(r => {
        if (r.data.code === 200) {
          this.userList = r.data.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击下拉加载消防设施信息
    loadFacilityData () {
      this.loading = true
      this.$get('/base/facility-sub/findBaseFacilitySub/' + this.params.facilityId).then((r) => {
        if (r.data.code === 200) {
          this.params.facilityLocation = r.data.data.facilityLocation
          this.params.facilityName = r.data.data.facilityName
          this.dataSource = r.data.data.baseFacilitySub
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 返回
    btnCancel () {
      this.$router.push({path: '/business/bizInspectionTask'})
    },
    // 提交
    btnSave () {
      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          // 新增
          if (this.flag === '1') {
            this.params.createId = store.state.account.user.userId
            this.$axios('/business/inspection-task/addInspectionTask', {...this.params}).then((r) => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/business/bizInspectionTask', query: {flag: '2'}})
              } else {
                this.$message.error(r.data.msg)
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
          // 编辑
          if (this.flag === '2') {
            this.params.modifyId = store.state.account.user.userId
            this.$axios('/business/inspection-task/updateInspectionTask', this.params).then((r) => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/business/bizInspectionTask', query: {flag: '2'}})
              } else {
                this.$message.error(r.data.msg)
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        }
        this.loading = false
      })
    }
  }
}
</script>
<style>
</style>
