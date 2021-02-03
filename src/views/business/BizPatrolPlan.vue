<template>
    <!--  巡检计划页面-->
    <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
            <!--   查询区域：查询和重置-->
            <a-form>
                <a-row>
                    <a-col :span="8">
                        <a-form-item label="计划名称" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-input v-model="queryParams.planName"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item label="每月巡检日" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <!-- <a-date-picker style="width: 100%;" format="D" v-model="queryParams.patrolDate"
                                            :disabledDate="disabledDate"/>-->
                            <a-input placeholder="请输入1-28数字" type="number" min=1 max=28
                                     v-model="queryParams.patrolDate"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" style="text-align: right;">
                        <a-form-item :wrapperCol="{span: 24}">
                            <a-button type="primary" @click="btnSearch()">查询</a-button>
                            <a-button style="margin-left: 8px;" @click="btnReset">重置</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
                <br/>
            </a-form>
            <!--    功能按钮新增和删除-->
            <div>
                <a-row>
                    <a-col>
                        <a-button @click="showModalAdd">新增</a-button>
                        <!--  新增按钮弹出层对话框   -->
                        <a-modal
                                title="新增巡检计划"
                                v-model="visible"
                                width="60%"
                                @cancel="btnCancel"
                                @ok="handleOkAdd">
                            <a-form :form="form" >
                                <a-row>
                                    <a-col :span="24">
                                        <a-form-item label="计划名称" :labelCol="{span: 6, offset: 3}"
                                                     :wrapperCol="{span: 7}">
                                            <a-input v-model="paramsAdd.planName"
                                                     v-decorator="[ 'planName', rule.planName]"></a-input>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="24">
                                        <a-form-item label="每月巡检日" :labelCol="{span: 6, offset: 3}"
                                                     :wrapperCol="{span: 7}">
                                            <a-input placeholder="请输入1-28数字" type="number" min=1 max=28
                                                     v-model="paramsAdd.patrolDate"
                                                     v-decorator="[ 'patrolDate', rule.patrolDate]"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="24">
                                        <a-form-item label="巡检人" :labelCol="{span: 6, offset: 3}"
                                                     :wrapperCol="{span: 7}">
                                            <a-select placeholder="请选择" style="width: 100%"
                                                      v-model="paramsAdd.patrolId"
                                                      v-decorator="[ 'patrolId', rule.patrolId]">
                                                <a-select-option v-for="item in userList" :key="item.userId"
                                                                 :value="item.userId">
                                                    {{item.username}}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-form>
                        </a-modal>
                        <a-button style="margin-left: 8px;" @click="btnDelete">删除</a-button>
                    </a-col>
                </a-row>
            </div>
            <br/>
            <!--     tabel表格区域       -->
            <div>
                <a-table ref="TableInfo"
                         :columns="columns"
                         :dataSource="dataSource"
                         :pagination="pagination"
                         :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                         :loading="loading"
                         @change="handleTableChange" bordered>
                    <template slot="scope" slot-scope="text, record">
                        <a-button @click="showModal(record)">详情</a-button>
                    </template>
                    <template slot="operation" slot-scope="text, record">
                        <a-icon style="margin-right: 16px;" type="edit" theme="twoTone" twoToneColor="#4a9ff5"
                                @click="iconUpdate(record)"
                                title="修改"></a-icon>
                        <a-button @click="btnStop(record)" v-if="record.status==='启用'">停用</a-button>
                        <a-button @click="btnStart(record)" v-if="record.status==='停用'">启用</a-button>
                        <a-button @click="btnNow(record)" :disabled="record.status==='停用'">立即执行</a-button>
                    </template>
                </a-table>
            </div>
            <!--    修改弹框       -->
            <a-modal
                    title="修改巡检计划"
                    v-model="visibleUpdate"
                    width="60%"
                    @cancel="btnCancel"
                    @ok="handleOkUpdate">
                <a-form :form="form">
                    <a-row>
                        <a-col :span="24">
                            <a-form-item label="计划名称" :labelCol="{span: 6, offset: 3}" :wrapperCol="{span: 7}">
                                <a-input v-model="paramsAdd.planName"></a-input>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            <a-form-item label="每月巡检日" :labelCol="{span: 6, offset: 3}" :wrapperCol="{span: 7}">
                                <a-input placeholder="请输入1-28数字" type="number" min=1 max=28
                                         v-model="paramsAdd.patrolDate"/>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="24">
                            <a-form-item label="巡检人" :labelCol="{span: 6, offset: 3}" :wrapperCol="{span: 7}">
                                <a-select placeholder="请选择" style="width: 100%"
                                          v-model="paramsAdd.patrolId">
                                    <a-select-option v-for="item in userList" :key="item.userId"
                                                     :value="item.userId">
                                        {{item.username}}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </a-modal>
            <!-- 巡检范围详情弹出层对话框 -->
            <div>
                <a-modal
                        title="详情"
                        v-model="visibleDetail"
                        width="70%"
                        :footer="null"
                        @ok="handleOk">
                    <a-tabs @change="callback" :activeKey="tabsKey">
                        <a-tab-pane tab="编辑" key="1">
                            <a-card :bordered="false" class="card-area">
                                <a-form>
                                    <a-row>
                                        <a-col :span="6">
                                            <a-form-item label="设施编号" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                                                <a-input v-model="queryParamsEdit.facilityNo"></a-input>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-form-item label="设施位置" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                                                <a-input v-model="queryParamsEdit.facilityLocation"></a-input>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-form-item label="设施名称" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                                                <a-input v-model="queryParamsEdit.facilityName"></a-input>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6" style="text-align: right">
                                            <a-form-item :wrapperCol="{span: 24}">
                                                <a-button type="primary" @click="btnDetailEdit">查询</a-button>
                                                <a-button style="margin-left: 8px" @click="btnDetailEditReset">重置
                                                </a-button>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                </a-form>
                                <a-row>
                                    <a-col :span="24">
                                        <a-button @click="btnDetailDelete">删除</a-button>
                                    </a-col>
                                </a-row>
                                <br/>
                                <a-row>
                                    <a-col :span="24">
                                        <a-table ref="TableInfoEdit"
                                                 :columns="columnsDetail"
                                                 :dataSource="dataSourceDetailEdit"
                                                 :pagination="paginationEdit"
                                                 :rowSelection="{selectedRowKeys: selectedRowKeysEdit, onChange: onSelectChangeEdit}"
                                                 :loading="loadingEdit"
                                                 @change="handleTableChangeEdit" bordered>
                                        </a-table>
                                    </a-col>
                                </a-row>
                            </a-card>
                        </a-tab-pane>
                        <a-tab-pane tab="新增" key="2" forceRender>
                            <a-card :bordered="false" class="card-area">
                                <a-form>
                                    <a-row>
                                        <a-col :span="6">
                                            <a-form-item label="设施编号" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                                                <a-input v-model="queryParamsAdd.facilityNo"></a-input>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-form-item label="设施位置" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                                                <a-input v-model="queryParamsAdd.facilityLocation"></a-input>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6">
                                            <a-form-item label="设施名称" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                                                <a-input v-model="queryParamsAdd.facilityName"></a-input>
                                            </a-form-item>
                                        </a-col>
                                        <a-col :span="6" style="text-align: right">
                                            <a-form-item :wrapperCol="{span: 24}">
                                                <a-button type="primary" @click="btnDetailAdd">查询</a-button>
                                                <a-button style="margin-left: 8px" @click="btnDetailAddReset">重置
                                                </a-button>
                                            </a-form-item>
                                        </a-col>
                                    </a-row>
                                </a-form>
                                <a-row>
                                    <a-col :span="24">
                                        <a-table ref="TableInfoAdd"
                                                 :columns="columnsDetail"
                                                 :dataSource="dataSourceDetailAdd"
                                                 :pagination="paginationAdd"
                                                 :rowSelection="{selectedRowKeys: selectedRowKeysAdd, onChange: onSelectChangeAdd}"
                                                 :loading="loadingAdd"
                                                 @change="handleTableChangeAdd" bordered>
                                        </a-table>
                                    </a-col>
                                </a-row>
                            </a-card>
                            <a-row>
                                <a-col :span="24" style="text-align: center">
                                    <a-button @click="btnAddCancel">取消</a-button>
                                    <span style="margin: 0px 10px"></span>
                                    <a-button @click="btnAddSave">保存</a-button>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                    </a-tabs>
                </a-modal>
            </div>
        </div>
    </a-card>
</template>

<script>
import store from '../../store/index.js'
import moment from 'moment'

export default {
  name: 'BizPatrolPlan',
  data () {
    return {
      advanced: false,
      form: this.$form.createForm(this),
      flag: '',
      value: '',
      visibleDetail: false,
      visible: false,
      visibleUpdate: false,
      dataSource: [],
      dataSourceDetailEdit: [],
      dataSourceDetailAdd: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      paginationEdit: {
        pageSizeOptions: ['50', '100'],
        defaultCurrent: 1,
        defaultPageSize: 50,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      paginationAdd: {
        pageSizeOptions: ['50', '100'],
        defaultCurrent: 1,
        defaultPageSize: 50,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      paramsAdd: {
        id: '',
        planName: '',
        patrolPeriod: '',
        patrolId: '',
        createId: '',
        patrolDate: '',
        modifyId: ''
      },
      queryParams: {
        planName: '',
        patrolDate: '',
        pageSize: '',
        pageNum: '',
        patrolNameList: []
      },
      queryParamsAdd: {
        facilityNo: '',
        facilityLocation: '',
        facilityName: '',
        pageSize: '',
        pageNum: ''
      },
      queryParamsEdit: {
        facilityNo: '',
        facilityLocation: '',
        facilityName: '',
        planId: '',
        pageSize: '',
        pageNum: ''
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      filteredInfoEdit: null,
      sortedInfoEdit: null,
      paginationInfoEdit: null,
      filteredInfoAdd: null,
      sortedInfoAdd: null,
      paginationInfoAdd: null,
      paramsDetailAdd: {
        ids: [],
        createId: '',
        planId: ''
      },
      paramsStop: {},
      paramsStart: {},
      selectedRowKeys: [],
      selectedRowKeysEdit: [],
      selectedRowKeysAdd: [],
      userList: [],
      loading: false,
      loadingEdit: false,
      loadingAdd: false,
      planId: '',
      tabsKey: '1',
      rule: {
        planName: {
          rules: [
            {required: true, message: '请输入计划名称'},
            {max: 30, message: '长度不能超过30'}
          ]
        },
        patrolDate: {
          rules: [
            {required: true, message: '请输入每月巡检日'},
            {pattern: '^[1-9]$|^[1][0-9]$|^[2][0-8]$', message: '请输入1~28正整数'}
          ]
        },
        patrolId: {
          rules: [
            {required: true, message: '请选择巡检人'}
          ]
        }
      }
    }
  },
  computed: {
    columns () {
      return [{
        title: '序号',
        customRender: (value, row, index) => {
          return this.pagination.current !== undefined ? (this.pagination.current - 1) * 10 + index + 1 : index + 1
        },
        width: 100,
        align: 'center'
      }, {
        title: '计划名称',
        dataIndex: 'planName',
        width: 200,
        align: 'center'
      }, {
        title: '每月巡检日',
        dataIndex: 'patrolDate',
        width: 200,
        align: 'center'
      }, {
        title: '巡检人',
        dataIndex: 'patrolName',
        width: 150,
        align: 'center'
      }, {
        title: '计划状态',
        dataIndex: 'status',
        width: 150,
        align: 'center'
      }, {
        title: '巡检范围',
        dataIndex: 'scope',
        scopedSlots: {customRender: 'scope'},
        width: 200,
        align: 'center'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'},
        width: 300,
        align: 'center'
      }]
    },
    columnsDetail () {
      return [{
        title: '序号',
        customRender: (value, row, index) => `${index + 1}`,
        width: 100,
        align: 'center'
      }, {
        title: '设施编号',
        dataIndex: 'facilityNo',
        width: 200,
        align: 'center'
      }, {
        title: '设施位置',
        dataIndex: 'facilityLocation',
        width: 200,
        align: 'center'
      }, {
        title: '设施名称',
        dataIndex: 'facilityName',
        width: 150,
        align: 'center'
      }]
    }
  },
  created () {
    this.btnSearch()
    // 初始化获取巡检人用户下拉列表
    this.getUserList()
  },
  methods: {
    // 修改
    iconUpdate (record) {
      // console.log(record)
      this.visibleUpdate = true
      this.paramsAdd.planName = record.planName
      // this.$set(this.paramsAdd, 'planName', record.planName)
      this.paramsAdd.patrolDate = record.patrolDate
      this.$set(this.paramsAdd, 'patrolId', record.patrolId)
      this.paramsAdd.patrolId = record.patrolId
      this.paramsAdd.id = record.id
    },
    // 修改弹框中的确定按钮
    handleOkUpdate () {
      this.loadingAdd = true
      this.paramsAdd.modifyId = store.state.account.user.userId
      // console.log(store)
      this.$post('/business/patrol-plan/updatePatrolPlan', {...this.paramsAdd}).then(r => {
        if (r.data.code === 200) {
          this.$message.success(r.data.msg)
          this.visibleUpdate = false
          this.btnSearch()
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loadingAdd = false
      }).catch(r => {
        this.loadingAdd = false
      })
    },
    // 巡检计划表格分页
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter
      this.btnSearch({
        sortField: sorter.field,
        sortOrder: sorter.order
      })
    },
    // 禁用日期
    disabledDate (current) {
      return current && current > moment().date('28').add(0, 'M')
    },
    // 获取巡检人用户下拉列表
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
    // 新增按钮对话框
    showModalAdd () {
      this.visible = true
      this.form.resetFields()
    },
    // 新增按钮取消
    btnCancel () {
      this.paramsAdd.planName = ''
      this.paramsAdd.patrolDate = ''
      this.paramsAdd.patrolId = ''
    },
    // 新增按钮确定保存
    handleOkAdd () {
      this.loading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.paramsAdd.createId = store.state.account.user.userId
          this.$post('/business/patrol-plan/addPatrolPlan', {...this.paramsAdd}).then(r => {
            if (r.data.code === 200) {
              this.$message.success(r.data.msg)
              this.btnSearch()
            } else {
              this.$message.error(r.data.msg)
            }
            this.loading = false
            this.visible = false
          }).catch(r => {
            this.loading = false
          })
        }
        this.loading = false
      })
    },
    // 巡检范围详情对话框
    showModal (record) {
      this.visibleDetail = true
      this.planId = record.id
      this.btnDetailEdit()
    },
    handleOk (e) {
      console.log(e)
      this.visibleDetail = false
    },
    // 巡检范围详情 新增中取消按钮
    btnAddCancel () {
      this.visibleDetail = false
    },
    // 巡检范围详情对话框里tab栏
    callback (key) {
      this.tabsKey = key
      // 如果key === 1 执行编辑查询  key === 2 执行新增查询
      if (key === '1') {
        this.btnDetailEdit()
      }
      if (key === '2') {
        this.btnDetailAdd()
      }
    },
    // 获取复选框序号
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取编辑复选框序号
    onSelectChangeEdit (selectedRowKeysEdit) {
      this.selectedRowKeysEdit = selectedRowKeysEdit
    },
    // 获取新增复选框序号
    onSelectChangeAdd (selectedRowKeysAdd) {
      this.selectedRowKeysAdd = selectedRowKeysAdd
    },
    // 重置
    btnReset () {
      this.queryParams.planName = ''
      this.queryParams.patrolPeriod = ''
    },
    // 查询
    btnSearch () {
      this.loading = true
      this.dataSource = []
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        this.queryParams.pageSize = this.paginationInfo.pageSize
        this.queryParams.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        this.queryParams.pageSize = this.pagination.defaultPageSize
        this.queryParams.pageNum = this.pagination.defaultCurrent
      }
      this.$post('/business/patrol-plan/findPagePatrolPlan', {...this.queryParams}).then((r) => {
        const pagination = {...this.pagination}
        if (r.data.code === 200) {
          pagination.total = r.data.data.total
          this.dataSource = r.data.data.list
          this.pagination = pagination
        } else {
          // 同一页面多个Table，如果查询没数据，分页控件统计总记录数不能清零，需手动清空
          if (r.data.data === null) {
            pagination.total = 0
            this.pagination = pagination
          }
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(r => {
        this.loading = false
      })
    },
    // 删除
    btnDelete () {
      const that = this
      that.loading = true
      if (that.selectedRowKeys.length === 0 || that.selectedRowKeys === undefined) {
        that.loading = false
        return that.$message.warning('请选择要删除的巡检记录')
      }
      const ids = []
      for (let i = 0; i < that.selectedRowKeys.length; i++) {
        ids.push(this.dataSource[that.selectedRowKeys[i]].id)
      }
      that.$confirm({
        class: 'test',
        title: '确认要删除吗？',
        onOk () {
          that.$delete('/business/patrol-plan/delPatrolPlan/' + ids).then(r => {
            if (r.data.code === 200) {
              // 解决删除第2至N页中的所有数据，导致数据序号错误问题
              if (that.selectedRowKeys.length === that.dataSource.length && that.pagination.current !== 1) {
                const pagination = {...that.pagination}
                pagination.current = that.pagination.current - 1
                that.pagination = pagination
              }
              that.$message.success(r.data.msg)
              that.btnSearch()
            } else {
              that.$message.warning(r.data.msg)
            }
            that.selectedRowKeys = []
            that.loading = false
          }).catch(() => {
            that.loading = false
          })
        },
        onCancel () {
          that.loading = false
        }
      })
    },
    // 巡检范围详情对话框 编辑重置
    btnDetailEditReset () {
      this.queryParamsEdit.facilityName = ''
      this.queryParamsEdit.facilityLocation = ''
      this.queryParamsEdit.facilityNo = ''
    },
    // 巡检范围详情对话框 新增重置
    btnDetailAddReset () {
      this.queryParamsAdd.facilityName = ''
      this.queryParamsAdd.facilityLocation = ''
      this.queryParamsAdd.facilityNo = ''
    },
    // 巡检范围详情对话框 编辑中分页
    handleTableChangeEdit (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfoEdit = pagination
      this.filteredInfoEdit = filters
      this.sortedInfoEdit = sorter
      this.btnDetailEdit({
        sortField: sorter.field,
        sortOrder: sorter.order
      })
    },
    // 巡检范围详情对话框 新增中分页
    handleTableChangeAdd (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfoAdd = pagination
      this.filteredInfoAdd = filters
      this.sortedInfoAdd = sorter
      this.btnDetailAdd({
        sortField: sorter.field,
        sortOrder: sorter.order
      })
    },
    // 巡检范围详情对话框 编辑查询
    btnDetailEdit () {
      this.loadingEdit = true
      this.dataSourceDetailEdit = []
      this.queryParamsEdit.planId = this.planId
      if (this.paginationInfoEdit) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfoEdit.paginationEdit.current = this.paginationInfoEdit.current
        this.$refs.TableInfoEdit.paginationEdit.pageSize = this.paginationInfoEdit.pageSize
        this.queryParamsEdit.pageSize = this.paginationInfoEdit.pageSize
        this.queryParamsEdit.pageNum = this.paginationInfoEdit.current
      } else {
        // 如果分页信息为空，则设置为默认值
        this.queryParamsEdit.pageSize = this.paginationEdit.defaultPageSize
        this.queryParamsEdit.pageNum = this.paginationEdit.defaultCurrent
      }
      this.$post('/business/patrol-plan-sub/findPlanDetailsEdit', {...this.queryParamsEdit}).then(r => {
        const paginationEdit = {...this.paginationEdit}
        if (r.data.code === 200) {
          paginationEdit.total = r.data.data.total
          this.dataSourceDetailEdit = r.data.data.list
          this.paginationEdit = paginationEdit
        } else {
          // 同一页面多个Table，如果查询没数据，分页控件统计总记录数不能清零，需手动清空
          if (r.data.data === null) {
            paginationEdit.total = 0
            this.paginationEdit = paginationEdit
          }
          this.$message.warning(r.data.msg)
        }
        this.loadingEdit = false
      }).catch(r => {
        this.loadingEdit = false
      })
    },
    // 巡检范围详情对话框 新增查询
    btnDetailAdd () {
      this.loadingAdd = true
      this.dataSourceDetailAdd = []
      const paginationAdd = {...this.paginationAdd}
      if (this.paginationInfoAdd) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfoAdd.paginationAdd.current = this.paginationInfoAdd.current
        this.$refs.TableInfoAdd.paginationAdd.pageSize = this.paginationInfoAdd.pageSize
        this.queryParamsAdd.pageSize = this.paginationInfoAdd.pageSize
        this.queryParamsAdd.pageNum = this.paginationInfoAdd.current
      } else {
        // 如果分页信息为空，则设置为默认值
        this.queryParamsAdd.pageSize = this.paginationAdd.defaultPageSize
        this.queryParamsAdd.pageNum = this.paginationAdd.defaultCurrent
      }
      this.$post('/business/patrol-plan-sub/findPlanDetailsAdd', {...this.queryParamsAdd}).then(r => {
        if (r.data.code === 200) {
          paginationAdd.total = r.data.data.total
          this.dataSourceDetailAdd = r.data.data.list
          this.paginationAdd = paginationAdd
        } else {
          // 同一页面多个Table，如果查询没数据，分页控件统计总记录数不能清零，需手动清空
          if (r.data.data === null) {
            paginationAdd.total = 0
            this.paginationAdd = paginationAdd
          }
          this.$message.warning(r.data.msg)
        }
        this.loadingAdd = false
      }).catch(r => {
        this.loadingAdd = false
      })
    },
    // 巡检范围详情里的新增保存
    btnAddSave () {
      const that = this
      that.loadingAdd = true
      if (that.selectedRowKeysAdd === undefined || that.selectedRowKeysAdd.length === 0) {
        that.loadingAdd = false
        return that.$message.warning('请选择您要添加的设施点')
      }
      const ids = []
      for (let i = 0; i < that.selectedRowKeysAdd.length; i++) {
        ids.push(this.dataSourceDetailAdd[that.selectedRowKeysAdd[i]].facilityId)
      }
      that.paramsDetailAdd.ids = ids
      that.paramsDetailAdd.planId = that.planId
      that.paramsDetailAdd.createId = store.state.account.user.userId
      that.$confirm({
        class: 'test',
        title: '确定要保存吗？',
        onOk () {
          that.$post('/business/patrol-plan-sub/addPlanDetails', {...that.paramsDetailAdd}).then(r => {
            if (r.data.code === 200) {
              // 解决删除第2至N页中的所有数据，导致数据序号错误问题
              if (that.selectedRowKeysAdd.length === that.dataSource.length && that.paginationAdd.current !== 1) {
                const paginationAdd = {...that.paginationAdd}
                paginationAdd.current = that.paginationAdd.current - 1
                that.paginationAdd = paginationAdd
              }
              that.tabsKey = '1'
              that.btnDetailEdit()
              that.$message.success(r.data.msg)
            } else {
              that.$message.warning(r.data.msg)
            }
            that.selectedRowKeys = []
            that.loadingAdd = false
          }).catch(() => {
            that.loadingAdd = false
          })
        },
        onCancel () {
          that.loadingAdd = false
        }
      })
    },
    // 巡检计划范围设施详情 编辑中的删除
    btnDetailDelete () {
      const that = this
      that.loadingEdit = true
      if (that.selectedRowKeysEdit === undefined || that.selectedRowKeysEdit.length === 0) {
        that.loadingEdit = false
        return that.$message.warning('请选择要删除的设施点')
      }
      const ids = []
      for (let i = 0; i < that.selectedRowKeysEdit.length; i++) {
        ids.push(this.dataSourceDetailEdit[that.selectedRowKeysEdit[i]].id)
      }
      that.$confirm({
        class: 'test',
        title: '确认要删除吗？',
        onOk () {
          that.$delete('/business/patrol-plan-sub/delPlanDetails/' + ids).then(r => {
            if (r.data.code === 200) {
              // 解决删除第2至N页中的所有数据，导致数据序号错误问题
              if (that.selectedRowKeysEdit.length === that.dataSource.length && that.paginationEdit.current !== 1) {
                const paginationEdit = {...that.paginationEdit}
                paginationEdit.current = that.paginationEdit.current - 1
                that.paginationEdit = paginationEdit
              }
              that.btnDetailEdit()
              that.$message.success(r.data.msg)
            } else {
              that.$message.warning(r.data.msg)
            }
            that.selectedRowKeysEdit = []
            that.loadingEdit = false
          }).catch(() => {
            that.loadingEdit = false
          })
        },
        onCancel () {
          that.loadingEdit = false
        }
      })
    },
    // 停用
    btnStop (record) {
      this.loading = true
      let params = {
        id: record.id,
        modifyId: store.state.account.user.userId
      }
      this.$post('/business/patrol-plan/stopPatrolPlan', {...params}).then(r => {
        if (r.data.code === 200) {
          this.$message.success(r.data.msg)
          this.btnSearch()
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(r => {
        this.loading = false
      })
    },
    // 启用
    btnStart (record) {
      this.loading = true
      let params = {
        id: record.id,
        modifyId: store.state.account.user.userId
      }
      this.$post('/business/patrol-plan/startPatrolPlan', {...params}).then(r => {
        if (r.data.code === 200) {
          this.$message.success(r.data.msg)
          this.btnSearch()
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(r => {
        this.loading = false
      })
    },
    // 立即执行
    btnNow (record) {
      this.loading = true
      let params = {
        id: record.id,
        createId: store.state.account.user.userId
      }
      this.$post('/business/patrol-plan/nowPatrolPlan', {...params}).then(r => {
        if (r.data.code === 200) {
          this.$message.success(r.data.msg)
          this.btnSearch()
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(r => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
