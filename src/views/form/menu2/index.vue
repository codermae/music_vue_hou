<template>
  <div class="app-container">
    <song-search placeholder="请输入歌手名" v-model="searchQuery" @search="filterArtist"></song-search>
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
          {{ scope.row.artist_id }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.artist_name }}
        </template>
      </el-table-column>
      <el-table-column label="国籍" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nationality }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.image_url }}
        </template>
      </el-table-column>
      <el-table-column label="网站" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.official_website }}
        </template>
      </el-table-column>
      <el-table-column label="简介" width="450" align="center">
        <template slot-scope="scope">
          {{ scope.row.biography }}
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
              <el-input v-model="formData.artist_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="formData.artist_name"></el-input>
            </el-form-item>
            <el-form-item label="国籍" :label-width="formLabelWidth">
              <el-input v-model="formData.nationality"></el-input>
            </el-form-item>
            <el-form-item label="头像地址" :label-width="formLabelWidth">
              <el-input v-model="formData.image_url"></el-input>
            </el-form-item>
            <el-form-item label="网站" :label-width="formLabelWidth">
              <el-input v-model="formData.official_website"></el-input>
            </el-form-item>
            <el-form-item label="简介" :label-width="formLabelWidth">
              <el-input v-model="formData.biography"></el-input>
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
import { delItem, getList,updateItem } from '@/api/form'
import SongSearch from '@/components/Search'
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
    filterArtist(query){
      if(query.trim() === ''){
        this.filteredList = this.list;
      }else {
        this.filteredList = this.list.filter(item => item.artist_name.includes(query))
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
      XLSX.writeFile(wb,`歌手数据_${formattedTime}.xlsx`)
      this.$message({
        type: 'success',
        message: '导出成功!'
      })
    }
  }
}
</script>
<style scoped>
  ::v-deep .el-dialog {
    margin-top: 7vh !important;
  }
  .el-dialog__body {
    padding: 20px 20px 10px;
  }

  .el-form-item {
    margin-bottom: 5px;
  }

  .el-button--primary {
    background-color: red;
    border-color: red;
  }
</style>
