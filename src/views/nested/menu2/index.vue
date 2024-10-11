<template>
  <div class="app-container">
    <song-search placeholder="请输入歌曲名" v-model="searchQuery" @search="filterSongs"></song-search>
    <el-button @click="exportExcel" type="primary" style="margin-left: 10px" >导出Excel</el-button>
    <el-table
      v-loading="listLoading"
      :data="filteredList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.row.song_id }}
        </template>
      </el-table-column>
      <el-table-column label="歌曲名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.song_name }}
        </template>
      </el-table-column>
      <el-table-column label="歌手" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.performer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专辑" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.album_id }}
        </template>
      </el-table-column>
      <el-table-column label="类型" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.genre }}
        </template>
      </el-table-column>
      <el-table-column label="时长" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.duration }}
        </template>
      </el-table-column>
      <el-table-column label="播放量" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.views }}
        </template>
      </el-table-column>
      <el-table-column label="下载量" width="70" align="center">
        <template slot-scope="scope">
          {{ scope.row.downloads }}
        </template>
      </el-table-column>
      <el-table-column label="发布日期" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.publish_date }}
        </template>
      </el-table-column>
      <el-table-column label="歌曲路径" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.file_path }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <button @click="handleEdit(scope.row)">编辑</button>
          <button @click="handleDel(scope.row)">删除</button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑数据" :visible.sync="dialogVisible" width="50%">
      <el-form :model="formData" style="margin-bottom: 0;">
            <el-form-item label="ID" :label-width="formLabelWidth">
              <el-input v-model="formData.song_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="歌曲名" :label-width="formLabelWidth">
              <el-input v-model="formData.song_name"></el-input>
            </el-form-item>
            <el-form-item label="歌手" :label-width="formLabelWidth">
              <el-input v-model="formData.performer"></el-input>
            </el-form-item>
            <el-form-item label="专辑" :label-width="formLabelWidth">
              <el-input v-model="formData.album_id"></el-input>
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth">
              <el-input v-model="formData.genre"></el-input>
            </el-form-item>
            <el-form-item label="时长" :label-width="formLabelWidth">
              <el-input v-model="formData.duration"></el-input>
            </el-form-item>
            <el-form-item label="播放量" :label-width="formLabelWidth">
              <el-input v-model="formData.views"></el-input>
            </el-form-item>
            <el-form-item label="下载量" :label-width="formLabelWidth">
              <el-input v-model="formData.downloads"></el-input>
            </el-form-item>
            <el-form-item label="发布日期" :label-width="formLabelWidth">
              <el-date-picker
                v-model="formData.publish_date"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="歌曲路径" :label-width="formLabelWidth">
              <el-input v-model="formData.file_path"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChanges">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="确认删除" :visible.sync="delDialogVisible" width="30%">
      <span>确定要删除账号吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDel">取消</el-button>
        <el-button type="primary" @click="confirmDel">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delItem, getList,updateItem } from '@/api/nested'
import SongSearch from '@/components/Search/index.vue'
import * as XLSX from 'xlsx'

export default {
  components:{
    SongSearch
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible:false,
      delDialogVisible:false,
      selectedRow:null,
      formData:{},
      formLabelWidth: '120px',
      searchQuery:'',
      filteredList:[]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        // console.log(response)
        this.list = response.data
        this.filteredList = this.list
        this.listLoading = false
      })
    },
    handleEdit(row){
      this.formData = {...row}
      this.dialogVisible = true
    },
    handleDel(row){
      this.selectedRow = row;
      this.delDialogVisible = true;
    },
    cancelDel(){
      this.delDialogVisible=false;
    },
    confirmDel(){
      delItem(this.selectedRow.artist_id).then(()=>{
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.list = this.list.filter(item => item.artist_id !== this.selectedRow.artist_id);
      }).catch(error => {
        console.error('DELETE FAILED',error)
      });
      this.delDialogVisible = false;
      // console.log(this.selectedRow)
    },
    saveChanges(){
      //修改用户信息
      // console.log(this.formData);
      updateItem(this.formData.artist_id,this.formData).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.dialogVisible = false;
        this.fetchData();
      }).catch(error => {
        console.error('UPDATE FAILED',error)
      })
    },
    filterSongs(query){
      if(query.trim() === ''){
        this.filteredList = this.list;
        // console.log(this.searchQuery)
        // console.log(this.filteredList)
      }else {
        this.filteredList = this.list.filter(item => item.song_name.includes(query))
      }
    },
    exportExcel(){
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const formattedTime = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
      // console.log(`歌曲数据_${formattedTime}.xlsx`)
      const ws = XLSX.utils.json_to_sheet(this.filteredList)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb,ws,'sheet1')
      XLSX.writeFile(wb,`歌曲数据_${formattedTime}.xlsx`)
    }
  }
}
</script>
<style scoped>
  ::v-deep .el-dialog {
    margin-top: 1vh !important;
  }
  .el-dialog__body {
    padding: 20px 20px 10px;
  }

  .el-form-item {
    margin-bottom: 3px;
  }

  .el-button--primary {
    background-color: red;
    border-color: red;
  }
</style>
