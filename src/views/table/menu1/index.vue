<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="uploadForm" label-width="120px" style="max-width: 500px; margin: 50px auto;">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password_hash">
        <el-input v-model="formData.password_hash"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="privilege">
        <el-select v-model="formData.privilege" placeholder="请选择用户权限">
          <el-option label="管理员" value="admin"></el-option>
          <el-option label="普通用户" value="user"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createItem } from '@/api/table';

export default {
  data() {
    return {
      formData: {
        username: '',
        password_hash: '',
        mobile: '',
        privilege: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
        ],
        password_hash: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '密码长度至少为3个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
        ],
        privilege: [
          { required: true, message: '请选择用户权限', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          // 表单验证通过，执行提交逻辑
          console.log('表单数据:', this.formData);
          createItem(this.formData).then(() => {
            this.$message({
              type:'success',
              message:'新增成功'
            })
            this.cancelForm();
          }).catch(error => {
            console.error('新增失败',error)
          })
        } else {
          this.message({
            type:'fail',
            message:'表单验证失败'
          })
          return false;
        }
      });
    },
    cancelForm() {
      // 清空表单数据
      this.formData = {
        username: '',
        password_hash: '',
        mobile: '',
        privilege: ''
      };
    }
  }
};
</script>

<style scoped>
.el-form {
  padding: 20px;
  background-color: #f8f8f8;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
