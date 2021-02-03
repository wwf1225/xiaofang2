<template>
    <!--    报修记录页面-->
    <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
            <!--   查询区域-->
            <a-form>
                <a-row>
                    <a-col :span="6">
                        <a-form-item label="设施编号" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-input v-model="queryParams.facilityNo"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="设施位置" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-input v-model="queryParams.facilityLocation"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="维修人" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
                            <a-input v-model="queryParams.maintainName"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6" style="text-align: right;">
                        <a-form-item :wrapperCol="{span: 24}">
                            <a-button type="primary" @click="btnSearch">查询</a-button>
                            <a-button style="margin-left: 8px;" @click="btnReset">重置</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
                <br/>
                <a-row>
                    <a-col :span="24">
                        <a-checkbox @change="onChange">不显示‘已维修’的记录</a-checkbox>
                    </a-col>
                </a-row>
            </a-form>
            <br/>
            <!--    功能按钮-->
            <div>
                <a-row>
                    <a-col>
                        <a-button @click="btnAdd">新增</a-button>
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
                    <template slot="repairCause" slot-scope="text, record">
                        <a-button @click="showModal(record)">详情</a-button>
                    </template>
                    <template slot="operation" slot-scope="text, record">
                        <a-icon type="edit" theme="twoTone" twoToneColor="#4a9ff5" @click="iconEdit(record)"
                                title="编辑"></a-icon>
                    </template>
                </a-table>
            </div>
            <!-- 详情弹出对话框-->
            <a-modal
                    title="详情"
                    v-model="visibleDetail"
                    width="60%"
                    @ok="handleOk">
                <a-row>
                    <a-col :span="24">
                        <a-table :columns="columnsDetail"
                                 :dataSource="dataSourceDetail"
                                 :pagination="paginationDetail"
                                 :rowSelection="{selectedRowKeys: selectedRowKeysDetail, onChange: onSelectChangeDetail}"
                                 :loading="loadingDetail" bordered>
                        </a-table>
                    </a-col>
                </a-row>
            </a-modal>
        </div>
    </a-card>
</template>

<script>
export default {
  name: 'BizRepairRecord',
  data () {
    return {
      advanced: false,
      dataSource: [],
      dataSourceDetail: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      paginationDetail: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      queryParams: {
        facilityNo: '',
        facilityLocation: '',
        maintainName: '',
        pageSize: '',
        pageNum: '',
        statusList: []
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      selectedRowKeys: [],
      selectedRowKeysDetail: [],
      loading: false,
      visibleDetail: false,
      loadingDetail: false,
      id: ''
    }
  },
  computed: {
    columns () {
      return [{
        title: '序号',
        customRender: (value, row, index) => {
          return this.pagination.current !== undefined ? (this.pagination.current - 1) * 10 + index + 1 : index + 1
        },
        width: 150,
        align: 'center'
      }, {
        title: '消防设施编号',
        dataIndex: 'facilityNo',
        width: 360,
        align: 'center'
      }, {
        title: '消防设施位置',
        dataIndex: 'facilityLocation',
        width: 380,
        align: 'center'
      }, {
        title: '设施名称',
        dataIndex: 'equipmentName',
        width: 220,
        align: 'center'
      }, {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        width: 300,
        align: 'center'
      }, {
        title: '报修原因',
        dataIndex: 'repairCause',
        scopedSlots: {customRender: 'repairCause'},
        width: 350,
        align: 'center'
      }, {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        align: 'center'
      }, {
        title: '报修日期',
        dataIndex: 'repairDate',
        width: 150,
        align: 'center'
      }, {
        title: '维修人',
        dataIndex: 'maintainName',
        width: 150,
        align: 'center'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'},
        width: 100,
        align: 'center'
      }]
    },
    columnsDetail () {
      return [{
        title: '序号',
        customRender: (value, row, index) => `${index + 1}`,
        width: 150,
        align: 'center'
      }, {
        title: '报修内容',
        dataIndex: 'checkItem',
        width: 360,
        align: 'center'
      }, {
        title: '维修进展',
        dataIndex: 'status',
        width: 380,
        align: 'center'
      }
      ]
    }
  },
  created () {
    this.btnSearch()
  },
  methods: {
    onChange (e) {
      e.target.checked === true ? (this.queryParams.statusList[0] = 34, this.queryParams.statusList[1] = 35) : this.queryParams.statusList = []
    },
    // 报修原因 详情
    showModal (record) {
      this.visibleDetail = true
      this.id = record.id
      this.getDetailList()
    },
    // 详情 确定按钮
    handleOk () {
      this.visibleDetail = false
    },
    // 获取复选框序号
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取详情复选框序号
    onSelectChangeDetail (selectedRowKeysDetail) {
      this.selectedRowKeysDetail = selectedRowKeysDetail
    },
    // 重置
    btnReset () {
      this.queryParams.facilityNo = ''
      this.queryParams.facilityLocation = ''
      this.queryParams.maintainName = ''
    },
    // 新增
    btnAdd () {
      this.$router.push({path: '/business/bizRepairRecordsub', query: {flag: '1'}})
    },
    // tabel分页
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
      this.$post('/business/repair-record/findPageRepairRecord', {...this.queryParams}).then((r) => {
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
    // 编辑
    iconEdit (record) {
      this.loading = true
      this.$get('/business/repair-record/findRepairRecordById/' + record.id).then(r => {
        if (r.data.code === 200) {
          this.$router.push({path: '/business/bizRepairRecordsub', query: {flag: '2', data: JSON.stringify(r.data.data)}})
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    btnDelete () {
      const that = this
      that.loading = true
      if (that.selectedRowKeys === undefined || that.selectedRowKeys.length === 0) {
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
          that.$delete('/business/repair-record/delRepairRecord/' + ids).then(r => {
            if (r.data.code === 200) {
              // 解决删除第2至N页中的所有数据，导致数据序号错误问题
              if (that.selectedRowKeys.length === that.dataSource.length && that.pagination.current !== 1) {
                const pagination = {...that.pagination}
                pagination.current = that.pagination.current - 1
                that.pagination = pagination
              }
              that.btnSearch()
              that.$message.success(r.data.msg)
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
    // 获取报修原因详情列表
    getDetailList () {
      this.loadingDetail = true
      this.dataSourceDetail = []
      this.$get('/business/repair-record/getRepairDetails/' + this.id).then(r => {
        if (r.data.code === 200) {
          this.dataSourceDetail = r.data.data
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loadingDetail = false
      }).catch(r => {
        this.loadingDetail = false
      })
    }
  }
}
</script>

<style scoped>

</style>
