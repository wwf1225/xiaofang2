<template>
    <!--  效期提醒页面  -->
    <a-card :bordered="false" class="card-area">
        <div :class="advanced ? 'search' : null">
            <!--    查询区域    -->
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
                    <a-col :span="6" style="text-align: right">
                        <a-form-item>
                            <a-button type="primary" @click="btnSearch">查询</a-button>
                            <a-button style="margin-left: 8px;" @click="btnReset">重置</a-button>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <br/>
            <!--  tabel表格区域   -->
            <div>
                <a-table ref="TableInfo"
                         :columns="columns"
                         :dataSource="dataSource"
                         :pagination="pagination"
                         :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                         :loading="loading"
                         @change="handleTableChange" bordered>
                    <template slot="endTime" slot-scope="text, record,index">
<!--                      <span :v-if="endTimeColor(text)" :style="fontColor">{{text}}</span>-->
                      <span  :style="endTimeColor(text)">{{text}}</span>
                    </template>
                </a-table>
            </div>
        </div>
    </a-card>
</template>

<script>

export default {
  name: 'BizValidityRemind',
  data () {
    return {
      advanced: false,
      indeterminate: true,
      checkAll: false,
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
        facilityNo: '',
        facilityLocation: '',
        maintainName: '',
        pageSize: '',
        pageNum: ''
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      selectedRowKeys: [],
      loading: false,
      fontColor: {
        color: 'blue'
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
        title: '设备名称',
        dataIndex: 'equipmentName',
        width: 220,
        align: 'center'
      }, {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        width: 360,
        align: 'center'
      }, {
        title: '到期日',
        dataIndex: 'endTime',
        width: 350,
        scopedSlots: {customRender: 'endTime'},
        align: 'center'
      }, {
        title: '维修人',
        dataIndex: 'maintainName',
        width: 150,
        align: 'center'
      }]
    }
  },
  created () {
    this.btnSearch()
  },
  methods: {
    // 获取复选框序号
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 重置
    btnReset () {
      this.queryParams.facilityNo = ''
      this.queryParams.facilityLocation = ''
      this.queryParams.maintainName = ''
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
      this.$post('/business/validity-remind/findPageValidityRemind', {...this.queryParams}).then((r) => {
        if (r.data.code === 200) {
          const pagination = {...this.pagination}
          pagination.total = r.data.data.total
          this.dataSource = r.data.data.list
          this.pagination = pagination
        } else {
          this.$message.warning(r.data.msg)
        }
        this.loading = false
      }).catch(r => {
        this.loading = false
      })
    },
    // 根据添加动态改变到期日的颜色，已到期为红色，提醒日期为蓝色
    endTimeColor (text) {
      // new Date(Date.parse(text)) <= new Date(Date.parse(new Date())) ? this.fontColor.color = 'red' : this.fontColor.color = 'blue'
      // new Date(text).getTime() <= new Date().getTime() ? this.fontColor.color = 'red' : this.fontColor.color = 'blue'
      let fontColor = {
        color: 'blue'
      }
      new Date(text).getTime() <= new Date().getTime() ? fontColor.color = 'red' : fontColor.color = 'blue'
      return fontColor
    }
  }
}
</script>

<style scoped>

</style>
