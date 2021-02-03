<template>
    <!-- 消防设备子页面 -->
    <a-card :bordered="false" class="card-area">
        <!-- 输入框部分 -->
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal" :form="form">
                <a-row style="margin-top: 20px">
                    <div :class="advanced ? null: 'fold'">
                        <a-col :span="8" :offset="2">
                            <a-form-item label="设施编号" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                                <a-input v-model="params.facilityNo" v-decorator="[ 'facilityNo', rule.facilityNo]"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" :offset="4">
                            <a-form-item label="设施位置" :labelCol="{span: 6,offset: 4}" :wrapperCol="{span: 14}">
                                <a-input v-model="params.facilityLocation"
                                         v-decorator="[ 'facilityLocation', rule.facilityLocation]"/>
                            </a-form-item>
                        </a-col>
                    </div>
                </a-row>
                <a-row>
                    <div :class="advanced ? null: 'fold'">
                        <a-col :span="8" :offset="2">
                            <a-form-item label="设施名称" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                                <a-input v-model="params.facilityName"
                                         v-decorator="[ 'facilityName', rule.facilityName]"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" :offset="4">
                            <a-form-item label="巡检周期(天)" :labelCol="{span: 6,offset: 4}" :wrapperCol="{span: 14}">
                                <a-input v-model="params.patrolPeriod"
                                         v-decorator="[ 'patrolPeriod', rule.patrolPeriod]"/>
                            </a-form-item>
                        </a-col>
                    </div>
                </a-row>
                <a-row>
                    <div :class="advanced ? null: 'fold'">
                        <a-col :span="8" :offset="2">
                            <a-form-item label="巡检人" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                                <a-select placeholder="请选择" size="default" style="width: 100%"
                                          v-model="params.periodId" v-decorator="[ 'periodId', rule.periodId]">
                                    <a-select-option v-for="item in userList" :key="item.userId"
                                                     :value="item.userId">
                                        {{item.username}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" :offset="4">
                            <a-form-item label="维修人" :labelCol="{span: 6,offset: 4}" :wrapperCol="{span: 14}">
                                <a-select placeholder="请选择" size="default" style="width: 100%"
                                          v-model="params.maintainId" v-decorator="[ 'maintainId', rule.maintainId]">
                                    <a-select-option v-for="item in userList" :key="item.userId" :value="item.userId">
                                        {{item.username}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </div>
                </a-row>
            </a-form>
        </div>
        <!-- 按钮 -->
        <div>
            <a-row class="operator">
                <a-col :span="20" :offset="2">
                    <a-button @click="addRow">添加</a-button>
                </a-col>
            </a-row>
        </div>
        <!-- 表格部分 -->
        <div>
            <a-row>
                <a-col :span="20" :offset="2">
                    <a-table :columns="columns"
                             :dataSource="dataSource"
                             :pagination="false"
                             :loading="loading" bordered>
                        <template slot="equipmentName" slot-scope="text, record">
                            <a-select placeholder="请选择" size="default" style="width: 100%"
                                      v-model="record.equipmentId">
                                <a-select-option v-for="item in equipmentList" :key="item.id"
                                                 :value="item.id">{{item.equipmentName}}
                                </a-select-option>
                            </a-select>
                        </template>
                        <template slot="equipmentNo" slot-scope="text, record">
                            <a-input v-model="record.equipmentNo"/>
                        </template>
                        <template slot="startTime" slot-scope="text, record, index">
                            <a-date-picker v-model="record.startTime" @change="startPicker(record.startTime,index)"/>
                        </template>
                        <template slot="endTime" slot-scope="text, record,index">
                            <a-date-picker v-model="record.endTime" @change="endPicker(record.endTime,index)"/>
                        </template>
                        <template slot="operation" slot-scope="text, record,index">
                            <a @click="delRow(index)">刪除</a>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
            <br/>
            <a-row style="margin-top: 10px">
                <a-col :span="20" :offset="2" style="text-align: center">
                    <a-button @click="btnCancel">取消</a-button>
                    <span style="margin: 0px 10px"/>
                    <a-button @click="btnSave">提交</a-button>
                </a-col>
            </a-row>
        </div>
    </a-card>
</template>

<script>
import store from '../../store/index.js'
import moment from 'moment'

export default {
  name: 'BaseFacilitySub',
  data: function () {
    return {
      advanced: false,
      form: this.$form.createForm(this),
      dataSource: [],
      params: {
        facilityNo: '',
        facilityLocation: '',
        facilityName: '',
        patrolPeriod: '',
        createId: '',
        modifyId: '',
        periodId: undefined,
        maintainId: undefined,
        baseFacilitySub: []
      },
      rule: {
        facilityNo: {
          rules: [
            {required: true, message: '请输入设施编号'},
            {max: 30, message: '长度不能超过30'}
          ]
        },
        facilityLocation: {
          rules: [
            {required: true, message: '请输入设施位置'}
          ]
        },
        facilityName: {
          rules: [
            {required: true, message: '请输入设施名称'},
            {max: 20, message: '长度不能超过20'}
          ]
        },
        patrolPeriod: {
          rules: [
            {required: true, message: '请输入巡检周期'}
          ]
        },
        periodId: {
          rules: [
            {required: true, message: '请选择巡检人'}
          ]
        },
        maintainId: {
          rules: [
            {required: true, message: '请选择维修人'}
          ]
        }
      },
      loading: false,
      flag: '',
      userList: [],
      equipmentList: []
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
        scopedSlots: {customRender: 'equipmentName'},
        width: 200,
        align: 'center'
      }, {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        scopedSlots: {customRender: 'equipmentNo'},
        width: 300,
        align: 'center'
      }, {
        title: '生产/维修日期',
        dataIndex: 'startTime',
        scopedSlots: {customRender: 'startTime'},
        width: 300,
        align: 'center'
      }, {
        title: '到期日',
        dataIndex: 'endTime',
        scopedSlots: {customRender: 'endTime'},
        width: 300,
        align: 'center'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'},
        width: 200,
        align: 'center'
      }]
    }
  },
  mounted () {
    this.flag = this.$route.query.flag
    // 初始化加载列表信息
    this.getUserList()
    this.getEquipmentList()
    // flag为1表示添加,2为编辑
    if (this.flag === '1') {
      this.addRow()
    }
    if (this.flag === '2') {
      const data = JSON.parse(this.$route.query.data)
      this.params.id = data.id
      this.params.facilityNo = data.facilityNo
      this.params.facilityLocation = data.facilityLocation
      this.params.facilityName = data.facilityName
      this.params.patrolPeriod = data.patrolPeriod
      this.params.maintainId = data.maintainId
      this.params.periodId = data.periodId
      data.baseFacilitySub.forEach((v, i) => {
        data.baseFacilitySub[i].startTime = moment(v.startTime, 'YYYY-MM-DD')
        data.baseFacilitySub[i].endTime = moment(v.endTime, 'YYYY-MM-DD')
      })
      this.form.setFieldsValue({
        facilityNo: data.facilityNo,
        facilityLocation: data.facilityLocation,
        facilityName: data.facilityName,
        patrolPeriod: data.patrolPeriod,
        periodId: data.periodId,
        maintainId: data.maintainId
      })
      this.dataSource = data.baseFacilitySub
    }
  },
  methods: {
    startPicker (startTime, index) {
      if (startTime === null) {
        this.dataSource[index].startTime = null
      }
    },
    endPicker (endTime, index) {
      if (endTime === null) {
        this.dataSource[index].endTime = null
      }
    },
    // 获取设备名信息
    getEquipmentList () {
      this.loading = true
      this.$get('/base/equipment/findEquipmentName').then(r => {
        if (r.data.code === 200) {
          this.equipmentList = r.data.data
        }
        this.loading = false
      }).catch(() => {
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
    // 删除行
    delRow (index) {
      this.dataSource.splice(index, 1)
    },
    // 添加行
    addRow () {
      let item = {
        equipmentName: undefined,
        equipmentNo: '',
        startTime: '',
        endTime: ''
      }
      this.dataSource.push(item)
    },
    // 保存
    btnSave () {
      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          const facilitySubData = []
          const equipmentNo = []
          const existEquipmentNo = []
          const num = []
          this.dataSource.forEach((v, i) => {
            if (v.equipmentName !== '' && v.equipmentNo !== '' && v.startTime !== '' && v.endTime !== '' && v.startTime !== null && v.endTime !== null) {
              facilitySubData.push(v)
            }
            if (v.equipmentName === '' || v.equipmentNo === '' || v.startTime === '' || v.endTime === '' || v.startTime === null || v.endTime === null) {
              num.push(i)
              this.$message.warning('请填写完整第(' + (i + 1) + ')行内容')
            }
            if (v.startTime >= v.endTime) {
              num.push(i)
              this.$message.warning('生产日期不能大于到期日,错误出现在第(' + (i + 1) + ')行')
            }
            equipmentNo.push(v.equipmentNo)
          })
          if (num.length > 0) return this.loading = false
          if (facilitySubData.length === 0 || facilitySubData === []) {
            this.loading = false
            return this.$message.warning('请至少添加一条检查项内容')
          }
          equipmentNo.forEach(v => {
            if (equipmentNo.indexOf(v) !== equipmentNo.lastIndexOf(v) && existEquipmentNo.indexOf(v) === -1) {
              existEquipmentNo.push(v)
              this.$message.warning('出现重复编号,编号为:' + v)
            }
          })
          if (existEquipmentNo.length > 0) return this.loading = false
          this.params.baseFacilitySub = facilitySubData
          // 添加
          if (this.flag === '1') {
            this.params.createId = store.state.account.user.userId
            this.$axios('/base/facility/addBaseFacility', JSON.stringify(this.params)).then((r) => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/base/baseFacility', query: {flag: '1'}})
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
            this.$axios('/base/facility/updateBaseFacility', JSON.stringify(this.params)).then((r) => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/base/baseFacility', query: {flag: '2'}})
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
    },
    // 取消
    btnCancel () {
      this.$router.push({path: '/base/baseFacility'})
    }
  }
}
</script>

<style scoped>
    .operator {
        margin-bottom: 18px;
    }
</style>
