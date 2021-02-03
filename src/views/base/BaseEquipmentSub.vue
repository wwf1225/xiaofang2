<template>
    <!-- 消防设备子页面 -->
    <a-card :bordered="false" class="card-area">
        <!-- 输入框部分 -->
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal" :form="form">
                <a-row style="margin-top: 20px">
                    <div :class="advanced ? null: 'fold'">
                        <a-col :span="8" :offset="4">
                            <a-form-item label="设备名称" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                                <a-input v-model="params.equipmentName"
                                         v-decorator="[ 'equipmentName', rule.equipmentName]">
                                    <!--                                    <a-icon slot="suffix" type="close-circle" @click="emitEmpty"/>-->
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="提醒间隔(天)" :labelCol="{span: 7, offset: 3}" :wrapperCol="{span: 14}">
                                <a-input v-model="params.remindInterval"
                                         v-decorator="[ 'remindInterval',rule.remindInterval]"/>
                            </a-form-item>
                        </a-col>
                    </div>
                </a-row>
            </a-form>
        </div>
        <!-- 表格检查项部分 -->
        <div>
            <a-row style="margin-top: 50px">
                <a-col :span="20" :offset="4">
                    <span><img src="../../../static/img/nav-bottomlfte.png" height="24" width="5"/></span>
                    <span style="margin-left: 10px;font-weight: bold;font-family: 微软雅黑">检查项</span>
                    <span style="margin-left: 10px"><a @click="addRow"><a-icon type="plus-circle"></a-icon>添加</a></span>
                </a-col>
            </a-row>
            <a-row style="margin-top: 10px">
                <a-col :span="16" :offset="4">
                    <a-table :columns="columns"
                             :dataSource="dataSource"
                             :pagination="false"
                             :loading="loading" bordered>
                        <template slot="checkInput" slot-scope="text, record">
                            <a-input v-model="record.checkItem" v-decorator="[ 'checkItem',rule.checkItem]"/>
                        </template>
                        <template slot="statusRadio" slot-scope="text, record">
                            <a-RadioGroup v-model="record.normalStatus">
                                <a-Radio value="是">是</a-Radio>
                                <span style="margin-left: 10px"></span>
                                <a-Radio value="否">否</a-Radio>
                            </a-RadioGroup>
                        </template>
                        <template slot="operation" slot-scope="text, record, index">
                            <a @click="delRow(index,record)">
                                <a-icon type="delete" theme="twoTone" title="删除"/>
                            </a>
                            <span style="margin: 0px 15px">|</span><a @click="aMoveUp(index)"
                                                                      :disabled="index === 0">上移</a>
                            <span style="margin: 0px 15px">|</span><a @click="aMoveDown(index)"
                                                                      :disabled="index === dataSource.length-1">下移</a>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
            <a-row style="margin-top: 10px">
                <a-col :span="16" :offset="4" style="text-align: center">
                    <a-button type="primary" @click="btnSave" htmlType="submit">保存</a-button>
                    <span style="margin: 0px 10px"/>
                    <a-button @click="btnCancel">取消</a-button>
                </a-col>
            </a-row>
        </div>
    </a-card>
</template>

<script>
import store from '../../store/index.js'

export default {
  name: 'BaseEquipmentSub',
  data () {
    return {
      advanced: false,
      form: this.$form.createForm(this),
      dataSource: [],
      params: {
        id: '',
        createId: '',
        modifyId: '',
        equipmentName: '',
        remindInterval: '',
        baseEquipmentSub: []
      },
      rule: {
        equipmentName: {
          rules: [
            {required: true, message: '请输入设备名称'},
            {max: 20, message: '长度不能超过20'}
          ]
        },
        remindInterval: {
          rules: [
            {required: true, message: '请输入提醒间隔'},
            {pattern: '^(?!0)(?!00)(?:[0-9]{1,3}|1000)$', message: '请输入小于1000且大于0的正整数'}
          ]
        },
        checkItem: {
          rules: [
            {required: true, message: '请输入设备名称'},
            {max: 20, message: '长度不能超过20'}
          ]
        }
      },
      loading: false,
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
        title: '检查项',
        dataIndex: 'checkItem',
        scopedSlots: {customRender: 'checkInput'},
        align: 'center'
      }, {
        title: '正常状态',
        dataIndex: 'normalStatus',
        width: 200,
        scopedSlots: {customRender: 'statusRadio'},
        align: 'center'
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 200,
        scopedSlots: {customRender: 'operation'},
        align: 'center'
      }]
    }
  },
  mounted () {
    this.flag = this.$route.query.flag
    // flag为1表示添加,2为编辑
    if (this.flag === '1') {
      this.addRow()
    }
    if (this.flag === '2') {
      const data = JSON.parse(this.$route.query.data)
      this.params.id = data.id
      this.params.equipmentName = data.equipmentName
      this.params.remindInterval = data.remindInterval
      this.form.setFieldsValue({
        equipmentName: data.equipmentName,
        remindInterval: data.remindInterval.toString().trim()
      })
      this.dataSource = data.baseEquipmentSub
    }
  },
  methods: {
    // 添加行
    addRow () {
      let item = {
        checkItem: '',
        normalStatus: '是'
      }
      this.dataSource.push(item)
    },
    // 删除行
    delRow (index) {
      this.dataSource.splice(index, 1)
    },
    // 上移
    aMoveUp (index) {
      // const data = [this.dataSource[index], this.dataSource[index - 1]]
      // this.$set(this.dataSource, index, data[1])
      // this.$set(this.dataSource, index - 1, data[0])
      this.$set(this.dataSource, index, [this.dataSource[index - 1], this.dataSource[index - 1] = this.dataSource[index]][0])
    },
    // 下移
    aMoveDown (index) {
      // const data = [this.dataSource[index], this.dataSource[index + 1]]
      // this.$set(this.dataSource, index, data[1])
      // this.$set(this.dataSource, index + 1, data[0])
      this.$set(this.dataSource, index, [this.dataSource[index + 1], this.dataSource[index + 1] = this.dataSource[index]][0])
    },
    // 保存
    btnSave () {
      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          const equipmentSubData = []
          this.dataSource.forEach(v => {
            if (v.checkItem !== '') {
              equipmentSubData.push(v)
            }
          })
          if (equipmentSubData.length === 0 || equipmentSubData === []) {
            this.loading = false
            return this.$message.warning('请至少添加一条检查项内容')
          }
          this.params.baseEquipmentSub = equipmentSubData
          // 添加
          if (this.flag === '1') {
            this.params.createId = store.state.account.user.userId
            this.$axios('/base/equipment/addPageBaseEquipment', JSON.stringify(this.params)).then((r) => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/base/baseEquipment', query: {flag: '1'}})
              } else {
                this.$message.warning(r.data.msg)
              }
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
          // 编辑
          if (this.flag === '2') {
            this.params.modifyId = store.state.account.user.userId
            this.$axios('/base/equipment/updateBaseEquipment', JSON.stringify(this.params)).then((r) => {
              if (r.data.code === 200) {
                this.$message.success(r.data.msg)
                this.$router.push({path: '/base/baseEquipment', query: {flag: '2'}})
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
    },
    // 取消
    btnCancel () {
      this.$router.push({path: '/base/baseEquipment'})
    },
    // 清空Input输入框
    emitEmpty () {
      this.params.equipmentName = ''
    }
  }
}
</script>

<style scoped>

</style>
