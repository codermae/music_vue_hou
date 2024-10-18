<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-row :gutter="20">
      <el-col :span="8">
        <div>
          <el-statistic
            group-separator=","
            :precision="0"
            :value="initData.userCount"
            title="用户数量"
          ></el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <el-statistic
            title="歌曲数量"
            :value="initData.songCount"
          ></el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <el-statistic
            group-separator=","
            :precision="0"
            decimal-separator="."
            :value="initData.artistCount"
            title="歌手数量"
          >
            <template slot="prefix">
              <i class="el-icon-s-flag" style="color: red"></i>
            </template>
            <template slot="suffix">
              <i class="el-icon-s-flag" style="color: blue"></i>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
    </div>
    <div class="charts-row">
      <div id="songsChart" class="echarts1" style="width: 500px; height: 400px"></div>
      <div id="artistsChart" class="echarts2" style="width: 500px; height: 400px"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getData,getLine,getGenre } from "@/api/dashboard";


export default {
  name: "Dashboard",
  data() {
    return {
      // 临时数据，用于展示

      //1. 歌曲类型分布-饼图  2. 用户活跃度-折线图图
      // 用户1、音乐1、歌手1、视频的总数
      initData:{
        artistCount:100,
        songCount:500,
        userCount:300,
      },

      songsData: [
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ],
      lineData: {
        labels: ['张三', '李四', '王五'],
        values: [20, 15, 5]
      },
      like: true,
        value1: 4154.564,
        value2: 1314,
        title: "增长人数",
    };
  },
  created() {
    //
    getData().then(response => {
      // console.log(response)
      this.initData = response.data;
    }).catch(error => {
      console.error('GET FAILED',error)
    })
    //
    getLine().then(response => {
      this.lineData.labels = []
      this.lineData.values = []
      response.data.map(item => {
        this.lineData.labels.push(item.date)
        this.lineData.values.push(item.count)
      })
      // console.log(this.lineData)
      this.drawArtistsChart()
    }).catch(error => {
      console.error('GET LINE FAILED',error)
    })
    //
    getGenre().then(response => {
      this.songsData = []
      response.data.map(item => {
        this.songsData.push({name:item.genre,value:item.numberOfSongs})
      })
      // console.log(this.songsData)
      this.drawSongsChart()
    }).catch(error => {
      console.error('GET GENRE FAILED',error)
    })

  },
  methods: {
    drawSongsChart() {
      const chart = echarts.init(document.getElementById('songsChart'));
      chart.setOption({
      title:{text:'歌曲类别统计',
        left:'center'
      },
        tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: this.songsData
    }
  ]
      });
    },
    drawArtistsChart() {
      const chart = echarts.init(document.getElementById('artistsChart'));
      chart.setOption({
        title: { text: '用户活跃度',
          left: 'center'
         },
        tooltip: {},
        xAxis: { data: this.lineData.labels },
        yAxis: {},
        series: [{
          name: '在线人数',
          type: 'line',
          data: this.lineData.values
        }]
      });
    }
  },
  mounted() {
    // this.drawUsersChart();
    // this.drawSongsChart();
    // this.drawArtistsChart();
    // this.drawVideosChart();
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  // margin: 30px;

  .charts-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 100px;
  }

  .dashboard-text {
    position: absolute;
    top: -1px; /* 调整这个值来控制文本的位置 */
    // height: 300px;
    width: 100%;
    text-align: center;
    font-size: 30px;
    line-height: 46px;
    z-index: 1; /* 确保文本在图表之上 */
    background-color: #ECEFF1;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
}
</style>
