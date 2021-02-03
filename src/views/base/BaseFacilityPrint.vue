<template>
    <!-- 消防设备子页面 -->
    <a-card :bordered="false" class="card-area">
      <section ref="print">
        <div class="page">
          <div style="font-size:16px;color: #333333;padding-bottom: 5px;padding-left: 25px;padding-right:25px;">{{params.facilityLocation}}</div>
          <qrcode :url="params.facilityNo" :wid="150" :hei="150" :imgwid="100" :imghei="100"></qrcode>
          <div style="font-size: 14px;color: #666666;padding-top: 5px;">{{params.facilityNo}}</div>
        </div>
        <div class="page" v-for="item in dataSource">
          <div style="font-size: 16px;color: #333333;padding-bottom: 5px;">{{item.equipmentId}}</div>
          <qrcode :url="item.equipmentNo" :wid="150" :hei="150" :imgwid="100" :imghei="100"></qrcode>
          <div  style="font-size: 14px;color: #666666;padding-top: 5px;">{{item.equipmentNo}}</div>
        </div>
      </section>
      <a-row style="margin-top: 20px">
          <a-col :span="20" :offset="2" style="text-align: center">
            <a-button @click="btnPrint">打印</a-button>
          </a-col>
      </a-row>
    </a-card>
</template>

<script>
import store from '../../store/index.js'
import moment from 'moment'
import qrcode from 'vue_qrcodes'
import index from '../../store/index'
export default {
  name: 'BaseFacilityPrint',
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
  },
  mounted () {
    this.getEquipmentList()
    const data = this.$route.query.data
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
    this.dataSource = data.baseFacilitySub
  },
  methods: {
    btnPrint() {
      this.$print(this.$refs.print)
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
    }
  },
  components: {
    qrcode
  }
}
</script>
<style scoped>
    .operator {
        margin-bottom: 18px;
    }
  .page{
    float: left;
    text-align: center;
    padding-top: 15px;
    width: 200px;
    height: 250px;
  }
</style>
