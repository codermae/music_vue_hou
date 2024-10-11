<template>
  <div class="app-container">
    <song-search v-model="searchQuery" @search="filterUser" placeholder="搜索用户名"></song-search>
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
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="密码" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password_hash }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="权限" width="75" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.privilege }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.regist_date }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="修改时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.update_date }}</span>
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
              <el-input v-model="formData.user_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="formData.password_hash"></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth">
              <el-input v-model="formData.mobile"></el-input>
            </el-form-item>
            <el-form-item label="权限" :label-width="formLabelWidth">
              <el-radio-group v-model="formData.privilege">
                <el-radio label="admin">Admin</el-radio>
                <el-radio label="root">Root</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注册时间" :label-width="formLabelWidth">
              <el-input v-model="formData.regist_date" disabled></el-input>
            </el-form-item>
            <el-form-item label="修改时间" :label-width="formLabelWidth">
              <el-input v-model="formData.update_date" disabled></el-input>
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
import { delItem, getList,updateItem } from '@/api/table'
import SongSearch from '@/components/Search'

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
      filteredList:[],
      searchQuery:''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        console.log(response)
        this.list = response.data
        this.filteredList = this.list;
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
      delItem(this.selectedRow.user_id).then(()=>{
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.list = this.list.filter(item => item.user_id !== this.selectedRow.user_id);
      }).catch(error => {
        console.error('DELETE FAILED',error)
      });
      this.delDialogVisible = false;
      // console.log(this.selectedRow)
    },
    saveChanges(){
      // console.log(this.formData)
      // this.removeFields(this.formData,['regist_date','update_date'])
      // console.log(this.removeFields(this.formData,['regist_date','update_date']))
      //修改用户信息
      updateItem(this.formData.user_id,this.removeFields(this.formData,['regist_date','update_date'])).then(() => {
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
    removeFields(obj,fieldsToRemove){
      const newObj = {...obj};
      fieldsToRemove.forEach(field => {
        delete newObj[field];
      });
      return newObj;
    },
    filterUser(query){
      if(query.trim() === ''){
        this.filteredList = this.list;
      }else{
        this.filteredList = this.list.filter(item => item.username.includes(query))
      }
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
