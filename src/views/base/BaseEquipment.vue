<template>
    <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
            <!-- 搜索区域 -->
            <a-form layout="horizontal" :form="queryParams">
                <a-row>
                    <div :class="advanced ? null: 'fold'">
                        <a-col :span="8">
                            <a-form-item
                                    label="设备名称"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 14}">
                                <a-input v-model="queryParams.equipmentName"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item
                                    label="提醒间隔(天)"
                                    :labelCol="{span: 5}"
                                    :wrapperCol="{span: 14}">
                                <a-input v-model="queryParams.remindInterval"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8" style="text-align: right">
                            <a-form-item :wrapperCol="{span: 24}">
                                <a-button type="primary" @click="btnSearch">查询</a-button>
                                <a-button style="margin-left: 8px" @click="btnReset">重置</a-button>
                            </a-form-item>
                        </a-col>
                    </div>
                </a-row>
            </a-form>
        </div>
        <!-- 功能按钮 -->
        <div class="operator">
            <a-row>
                <a-button type="primary" ghost @click="btnAdd" v-hasPermission="['user:add']">新增</a-button>
                <a-button style="margin-left: 8px" @click="batchDelete" v-hasPermission="['user:delete']">删除</a-button>
            </a-row>
        </div>
        <!-- 表格 -->
        <div>
            <a-row>
                <a-table ref="TableInfo"
                         :columns="columns"
                         :dataSource="dataSource"
                         :pagination="pagination"
                         :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                         :loading="loading"
                         @change="handleTableChange" bordered>
                    <template slot="operation" slot-scope="text, record">
                        <a-icon type="edit" theme="twoTone" twoToneColor="#4a9ff5" @click="iconEdit(record)"
                                title="编辑"></a-icon>
                    </template>
                </a-table>
            </a-row>
        </div>
    </a-card>
</template>

<script>
export default {
  name: 'BaseEquipment',
  data () {
    return {
      advanced: false,
      dataSource: [],
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      queryParams: {
        equipmentName: '',
        remindInterval: '',
        pageSize: '',
        pageNum: ''
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      selectedRowKeys: [],
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '序号',
        customRender: (value, row, index) => {
          return this.pagination.current !== undefined ? (this.pagination.current - 1) * 10 + index + 1 : index + 1
        },
        align: 'center'
      }, {
        title: '设备名称',
        dataIndex: 'equipmentName',
        align: 'center'
      }, {
        title: '提醒间隔(天)',
        dataIndex: 'remindInterval',
        align: 'center'
      }, {
        title: '巡检项目',
        dataIndex: 'countNum',
        align: 'center'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'},
        align: 'center'
      }]
    }
  },
  created () {
    // 初始化查询方法
    this.btnSearch()
  },
  methods: {
    // 获取复选框序号
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
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
    btnSearch (params = {}) {
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
      this.$post('/base/equipment/findPageBaseEquipment', {...this.queryParams}).then((r) => {
        if (r.data.code === 200) {
          const pagination = {...this.pagination}
          pagination.total = r.data.data.total
          this.dataSource = r.data.data.list
          this.pagination = pagination
        } else {
          this.$message.info(r.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    btnAdd () {
      this.$router.push({path: '/base/baseEquipmentSub', query: {flag: '1'}})
    },
    // 重置
    btnReset () {
      this.queryParams.equipmentName = ''
      this.queryParams.remindInterval = ''
    },
    // 编辑
    iconEdit (record) {
      this.loading = true
      this.$get('/base/equipment-sub/findBaseEquipmentSub/' + record.id).then(r => {
        if (r.data.code === 200) {
          this.$router.push({path: '/base/baseEquipmentSub', query: {flag: '2', data: JSON.stringify(r.data.data)}})
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    batchDelete () {
      const that = this
      that.loading = true
      if (that.selectedRowKeys.length === 0 || that.selectedRowKeys === undefined) {
        that.loading = false
        return that.$message.warning('请先选择要删除的设备！')
      }
      const ids = []
      for (let i = 0; i < that.selectedRowKeys.length; i++) {
        ids.push(that.dataSource[that.selectedRowKeys[i]].id)
      }
      that.$confirm({
        class: 'test',
        title: '确认要删除吗？',
        onOk () {
          that.$delete('/base/equipment/delBaseEquipment/' + ids).then(r => {
            if (r.data.code === 200) {
              that.$message.success(r.data.msg)
              // 解决删除第2至N页中的所有数据，导致数据序号错误问题
              if (that.selectedRowKeys.length === that.dataSource.length && that.pagination.current !== 1) {
                const pagination = {...that.pagination}
                pagination.current = that.pagination.current - 1
                that.pagination = pagination
              }
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
    }
  }
}
</script>

<style scoped>
    .operator {
        margin-bottom: 18px;
    }
</style>
