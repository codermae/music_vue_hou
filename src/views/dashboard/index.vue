<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div id="usersChart" style="width: 600px; height: 400px"></div>
    <div id="songsChart" style="width: 600px; height: 400px"></div>
    <div id="artistsChart" style="width: 600px; height: 400px"></div>
    <div id="videosChart" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts";

export default {
  name: "Dashboard",
  data() {
    return {
      // 临时数据，用于展示

      //1. 歌曲类型分布-饼图  2. 用户活跃度-折线图图
      // 用户1、音乐1、歌手1、视频的总数
      usersData: {
        labels: ['活跃', '新注册', '注销'],
        values: [500, 300, 100]
      },
      songsData: {
        labels: ['流行', '摇滚', '古典'],
        values: [75, 15, 10]
      },
      artistsData: {
        labels: ['张三', '李四', '王五'],
        values: [20, 15, 5]
      },
      videosData: {
        labels: ['教育', '娱乐', '科技'],
        values: [30, 50, 20]
      }
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  methods: {
    drawUsersChart() {
      const chart = echarts.init(document.getElementById('usersChart'));
      chart.setOption({
        title: { text: '用户数据' },
        tooltip: {},
        series: [{
          name: '用户统计',
          type: 'pie',
          data: this.usersData.labels.map((label, index) => ({ name: label, value: this.usersData.values[index] }))
        }]
      });
    },
    drawSongsChart() {
      const chart = echarts.init(document.getElementById('songsChart'));
      chart.setOption({
        title: { text: '歌曲分类' },
        tooltip: {},
        xAxis: { data: this.songsData.labels },
        yAxis: {},
        series: [{
          name: '歌曲数量',
          type: 'bar',
          data: this.songsData.values
        }]
      });
    },
    drawArtistsChart() {
      const chart = echarts.init(document.getElementById('artistsChart'));
      chart.setOption({
        title: { text: '艺术家排名' },
        tooltip: {},
        xAxis: { data: this.artistsData.labels },
        yAxis: {},
        series: [{
          name: '作品数量',
          type: 'line',
          data: this.artistsData.values
        }]
      });
    },
    drawVideosChart() {
      const chart = echarts.init(document.getElementById('videosChart'));
      chart.setOption({
        title: { text: '视频类别' },
        tooltip: {},
        xAxis: { data: this.videosData.labels },
        yAxis: {},
        series: [{
          name: '观看次数',
          type: 'bar',
          data: this.videosData.values
        }]
      });
    }
  },
  mounted() {
    this.drawUsersChart();
    this.drawSongsChart();
    this.drawArtistsChart();
    this.drawVideosChart();
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
