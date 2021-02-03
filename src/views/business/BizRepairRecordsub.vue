<template>
    <!--    报修记录子页面-->
    <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal" :form="form">
                <a-row>
                    <a-col :span="8" :offset="2">
                        <a-form-item label="设施编号" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-select placeholder="请选择" size="default" :disabled="flag === '2'"
                                      v-model="params.facilityId"
                                      style="width: 100%" @change="loadFacilityData">
                                <a-select-option v-for="item in facilityNoList" :disabled="disabledSelect1(item.id)"
                                                 :key="item.id" :value="item.id">{{item.facilityNo}}
                                </a-select-option>
                            </a-select>
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
                        <a-form-item label="设备编号" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-select placeholder="请选择" size="default"
                                      v-model="params.facilitySubId"
                                      style="width: 100%" @change="getEquipmentNo"
                                      :disabled="params.facilityId === undefined || flag === '2'">
                                <a-select-option v-for="item in baseEquipmentSub"
                                                 :disabled="disabledSelect2(item.facilitySubId)"
                                                 :key="item.facilitySubId" :value="item.facilitySubId">
                                    {{item.equipmentNo}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :offset="4">
                        <a-form-item label="设备名称" :labelCol="{span: 6, offset: 4}" :wrapperCol="{span: 14}">
                            <a-input v-model="params.equipmentName" disabled></a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="8" :offset="2">
                        <a-form-item label="报修日期" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-input v-model="params.repairDate" disabled></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :offset="4">
                        <a-form-item label="处理日期" :labelCol="{span: 6, offset: 4}" :wrapperCol="{span: 14}">
                            <a-date-picker v-model="params.disposeDate"
                                           style="width: 100%;"></a-date-picker>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="8" :offset="2">
                        <a-form-item label="处理状态" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-select placeholder="请选择" style="width: 100%" v-model="params.statusId"
                                      :disabled="flag === '1' || params.statusId === 36">
                                <a-select-option v-for="item in statusIdList"
                                                 :key="item.dictId" :value="item.dictId">
                                    {{item.valuee}}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" :offset="4">
                        <a-form-item label="备注" :labelCol="{span: 6,offset: 4}" :wrapperCol="{span: 14}">
                            <a-textarea v-model="params.remark" :rows="3"></a-textarea>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="20" :offset="2">
                        <a-form-item label="报修原因" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
                            <a-table :columns="columns"
                                     :dataSource="dataSource"
                                     :pagination="false"
                                     :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                                     :loading="loading" bordered>
                            </a-table>
                        </a-form-item>
                    </a-col>
                </a-row>
                <br/>
                <a-row>
                    <a-col style="text-align: center">
                        <a-button @click="btnCancel">返回</a-button>
                        <a-button @click="btnSave" style="margin-left: 8px;">提交</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </a-card>
</template>

<script>
import moment from 'moment'
import store from '../../store/index.js'

export default {
  name: 'BizRepairRecordsub',
  data () {
    return {
      advanced: false,
      form: this.$form.createForm(this),
      dataSource: [],
      params: {
        id: '',
        createId: '',
        modifyId: '',
        facilityId: undefined,
        facilityLocation: '',
        facilitySubId: undefined,
        equipmentNo: '',
        equipmentName: '',
        statusId: undefined,
        repairDate: '',
        disposeDate: undefined,
        remark: '',
        repairReason: ''
      },
      flag: '',
      statusIdList: [],
      baseEquipmentSub: [],
      facilityNoList: [],
      selectedRowKeys: [],
      newSelectedRowKeys: [],
      facilityIds: [],
      facilitySubIds: [],
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
        title: '报修内容',
        dataIndex: 'checkItem',
        width: 300,
        align: 'center'
      }]
    }
  },
  created () {
    // flag为1表示添加,2为编辑
    this.flag = this.$route.query.flag
    this.getFacilityNoList()
    this.getstatusIdList()
    this.findRepairEquipmentList()
    if (this.flag === '1') {
      this.params.repairDate = moment(new Date()).add('year', 0).format('YYYY-MM-DD')
      this.form.setFieldsValue({
        repairDate: this.params.repairDate
      })
    }

    if (this.flag === '2') {
      const data = JSON.parse(this.$route.query.data)
      this.newSelectedRowKeys = this.selectedRowKeys
      this.params.id = data.id
      this.params.facilityId = data.facilityId
      this.params.facilitySubId = data.facilitySubId
      if (data.disposeDate !== undefined) {
        this.params.disposeDate = moment(data.disposeDate, 'YYYY-MM-DD')
        this.form.setFieldsValue({
          disposeDate: this.params.disposeDate
        })
      }
      let item = {
        facilitySubId: data.facilitySubId,
        equipmentId: data.equipmentId,
        equipmentName: data.equipmentName,
        equipmentNo: data.equipmentNo
      }
      this.baseEquipmentSub.push(item)
      this.params.remark = data.remark
      this.params.repairDate = data.repairDate
      this.params.statusId = data.statusId
      this.params.equipmentName = data.equipmentName
      this.params.facilityLocation = data.facilityLocation
      this.contentSearch(data.equipmentId, data.repairRecord)
    }
  },
  methods: {
    // 获取复选框序号
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 该设施的所有设备都在报修列表中禁止选中
    disabledSelect1 (facilityId) {
      if (this.flag === '2') {
        const index = this.facilityIds.indexOf(this.$route.query.data.facilityId)
        if (index !== -1) {
          this.facilityIds.splice(index, 1)
        }
      }
      return this.facilityIds.indexOf(facilityId) === -1 ? false : true
    },
    // 禁止选中已报修的设备
    disabledSelect2 (facilitySubId) {
      if (this.flag === '2') {
        const index = this.facilitySubIds.indexOf(this.$route.query.data.facilitySubId)
        if (index !== -1) {
          this.facilitySubIds.splice(index, 1)
        }
      }
      return this.facilitySubIds.indexOf(facilitySubId) === -1 ? false : true
    },
    // 查询已存在报修的设备
    findRepairEquipmentList () {
      this.$get('/business/repair-record/findRepairEquipmentList').then(r => {
        if (r.data.code === 200) {
          const list = r.data.data
          this.facilityIds = list.facilityIds
          this.facilitySubIds = list.facilitySubIds
        }
      })
    },
    // 获取处理状态列表
    getstatusIdList () {
      this.loading = true
      let paramss = {
        tableName: 'biz_repair_record',
        fieldName: 'status'
      }
      this.$post('/dict/findDictByTableNameAndFieldName', {...paramss}).then(r => {
        if (r.data.code === 200) {
          this.statusIdList = r.data.data
          this.flag === '1' ? this.params.statusId = this.statusIdList[0].dictId : ''
        }
        this.loading = false
      }).catch(r => {
        this.loading = false
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
    // 点击下拉加载消防设施信息
    loadFacilityData (facilityId) {
      this.loading = true
      this.selectedRowKeys = []
      this.params.facilityId = facilityId
      this.statusId = this.statusIdList[0].dictId
      this.$get('/base/facility-sub/findBaseFacilitySub/' + this.params.facilityId).then((r) => {
        if (r.data.code === 200) {
          this.params.facilityLocation = r.data.data.facilityLocation
          this.baseEquipmentSub = []
          let items = []
          r.data.data.baseFacilitySub.forEach(list => {
            let item = {
              facilitySubId: list.id,
              equipmentId: list.equipmentId,
              equipmentName: list.equipmentName,
              equipmentNo: list.equipmentNo
            }
            items.push(item)
          })
          this.baseEquipmentSub = items
          this.params.facilitySubId = undefined
          this.params.equipmentName = ''
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 通过选择的设备给设备编号赋值
    getEquipmentNo (facilitySubId) {
      this.params.facilitySubId = facilitySubId
      this.baseEquipmentSub.forEach(list => {
        if (list.facilitySubId === this.params.facilitySubId) {
          this.params.equipmentName = list.equipmentName
          // 通过equipmentId查询报修内容列
          this.contentSearch(list.equipmentId)
        }
      })
    },
    // 返回
    btnCancel () {
      this.$router.push('/business/bizRepairRecord')
    },
    // 报修内容查询
    contentSearch (equipmentId, repairRecord) {
      this.loading = true
      this.dataSource = []
      if (equipmentId === '' || equipmentId === undefined) {
        this.loading = false
        return this.$message.warning('equipmentId为null')
      }
      this.$get('/base/equipment-sub/findBaseEquipmentSub/' + equipmentId).then(r => {
        if (r.data.code === 200) {
          this.dataSource = r.data.data.baseEquipmentSub
          if (repairRecord.length !== 0 && repairRecord !== '') {
            this.dataSource.forEach((v, i) => {
              repairRecord.forEach(ll => {
                if (v.id === ll.equipmentSubid) {
                  this.selectedRowKeys.push(i)
                }
              })
            })
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    btnSave () {
      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.params.facilityId === '' || this.params.facilityId === undefined) {
            this.loading = false
            return this.$message.warning('请选择设施编号！')
          }
          if (this.params.facilitySubId === '' || this.params.facilitySubId === undefined) {
            this.loading = false
            return this.$message.warning('请选择设备编号！')
          }
          if (new Date(this.params.repairDate).getTime() > new Date(this.params.disposeDate).getTime()) {
            this.loading = false
            return this.$message.warning('报修日期不能大于处理日期！')
          }
          if (this.params.statusId === 36 && (this.params.disposeDate === undefined || this.params.disposeDate === '')) {
            this.loading = false
            return this.$message.warning('请选择处理日期！')
          }
          if (this.selectedRowKeys.length === 0 || this.selectedRowKeys === []) {
            this.loading = false
            return this.$message.warning('请选择报修原因！')
          }
          const createId = store.state.account.user.userId
          const array = []
          this.dataSource.forEach((v, i) => {
            this.selectedRowKeys.indexOf(i) !== -1 ? array.push(1) : array.push(0)
          })
          this.params.repairReason = parseInt(array.reverse().join(''), 2)
          // 新增提交
          if (this.flag === '1') {
            this.params.createId = createId
            this.$axios('/business/repair-record/addRepairRecord', JSON.stringify(this.params)).then(r => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/business/bizRepairRecord', query: {flag: '1'}})
              } else {
                this.$message.warning(r.data.msg)
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
          // 编辑提交
          if (this.flag === '2') {
            this.params.modifyId = createId
            this.$axios('/business/repair-record/updateRepairRecord', JSON.stringify(this.params)).then(r => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/business/bizRepairRecord', query: {flag: '2'}})
              } else {
                this.$message.warning(r.data.msg)
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

<style scoped>
</style>
