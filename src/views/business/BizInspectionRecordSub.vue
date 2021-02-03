<template>
    <!-- 巡检记录子页面-->
    <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
            <a-form>
                <a-row>
                    <a-col :span="8" :offset="2">
                        <a-form-item label="设施编号" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                            <a-input v-model="params.facilityNo" disabled></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :offset="4">
                        <a-form-item label="设施位置" :labelCol="{span: 6, offset: 4}" :wrapperCol="{span: 14}">
                            <a-input v-model="params.facilityLocation" disabled></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="8" :offset="2">
                        <a-form-item label="设施名称" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                            <a-input v-model="params.facilityName" disabled></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
            <!--    tabel 表格区域-->
            <a-row>
                <a-col :span="20" :offset="2">
                   <a-form-item label="包含设备" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
                       <a-table :columns="columns"
                                :dataSource="dataSource"
                                :pagination="false"
                                :loading="loading" bordered>
                           <template slot="operation" slot-scope="text, record,index">
                               <a @click="btnDetail(index)">详情</a>
                           </template>
                       </a-table>
                   </a-form-item>
                </a-col>
            </a-row>
            <br />
<!--      详情弹框-->
                <a-modal
                        title= "详情"
                        width="70%"
                        v-model="visible"
                        @ok="handleOk">
                    <a-table :columns="columns2"
                             :dataSource="dataSource2"
                             :pagination="false"
                             :loading="loading" bordered>
                        <template slot="checkInput" slot-scope="text, record">
                            <a-input disabled/>
                        </template>
                        <template slot="statusRadio" slot-scope="text, record">
                            <a-switch defaultChecked @change='onChange'/>
                        </template>
                    </a-table>
                </a-modal>
                <!--   巡检日期       -->
                <a-row>
                    <a-col :span="8" :offset="2">
                        <a-form-item label="巡检日期" :labelCol="{span: 5}" :wrapperCol="{span: 14}">
                            <a-input v-model="params.patrolDate" disabled></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :offset="4">
                        <a-form-item label="巡检人" :labelCol="{span: 6, offset: 4}" :wrapperCol="{span: 14}">
                            <a-input v-model="params.patrolName" disabled></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <br/>
        <!--   备注        -->
               <!-- <a-row>
                    <a-col :span="20" :offset="2">
                        <a-form-item label="备注" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
                            <a-textarea v-model="params.remark"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>-->
        <!--    底部提交按钮      -->
                <a-row style="text-align: center;">
                    <a-col>
                        <a-button @click="btnCancel">返回</a-button>
<!--                        <a-button style="margin-left: 8px;">提交</a-button>-->
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </a-card>
</template>

<script>
export default {
  name: 'BizInspectionRecordSub',
  data () {
    return {
      advanced: false,
      dataSource: [],
      dataSource2: [],
      params: {
        facilityNo: '',
        facilityLocation: '',
        patrolName: '',
        patrolDate: '',
        remark: ''
      },
      visible: false,
      loading: false
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
      }, {
        title: '巡检结果',
        dataIndex: 'patrolResult',
        width: 300,
        align: 'center'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'},
        width: 100,
        align: 'center'
      }]
    },
    columns2 () {
      return [{
        title: '序号',
        width: 80,
        customRender: (value, row, index) => `${index + 1}`,
        align: 'center'
      }, {
        title: '检查项',
        dataIndex: 'checkItem',
        align: 'center'
      }, {
        title: '检查结果',
        dataIndex: 'answerResult',
        width: 200,
        scopedSlots: {customRender: 'answerResult'},
        align: 'center'
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        align: 'center'
      }]
    }
  },
  mounted () {
    // flag为1表示添加,2为编辑
    this.flag = this.$route.query.flag

    if (this.flag === '2') {
      const data = JSON.parse(this.$route.query.data)
      this.params.id = data.id
      this.params.facilityNo = data.facilityNo
      this.params.facilityLocation = data.facilityLocation
      this.params.facilityName = data.facilityName
      this.params.patrolDate = data.patrolDate
      this.params.patrolName = data.patrolName
      this.params.remark = data.remark
      this.dataSource = data.extBizInspectionRecordSub
    }
  },
  methods: {
    // 返回
    btnCancel () {
      this.$router.push('/business/bizInspectionRecord')
    },
    // 详情
    btnDetail (index) {
      this.loading = true
      this.visible = true
      const id = this.dataSource[index].id
      this.$get('/business/inspection-record-sub/findInspectionRecordDetails/' + id).then((r) => {
        if (r.data.code === 200) {
          this.dataSource2 = r.data.data
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 详情弹框中确定按钮
    handleOk () {
      this.visible = false
    },
    // switch开关
    onChange (checked) {
      console.log(`a-switch to ${checked}`)
    }
  }
}
</script>

<style scoped>
</style>
