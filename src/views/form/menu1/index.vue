<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="uploadForm" label-width="120px" style="max-width: 500px; margin: 50px auto;">
      <el-form-item label="姓名" prop="artist_name">
        <el-input v-model="formData.artist_name"></el-input>
      </el-form-item>
      <el-form-item label="国籍" prop="nationality">
        <el-input v-model="formData.nationality"></el-input>
      </el-form-item>
      <el-form-item label="头像地址" prop="image_url">
        <el-input v-model="formData.image_url"></el-input>
      </el-form-item>
      <el-form-item label="网站" prop="official_website">
        <el-input v-model="formData.official_website"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="biography">
        <el-input v-model="formData.biography"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createItem } from '@/api/form';

export default {
  data() {
    return {
      formData: {
        artist_name: '',
        nationality: '',
        image_url: '',
        official_website: '',
        biography:''
      },
      rules: {
        artist_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        nationality: [
          { required: true, message: '请输入国籍', trigger: 'blur' },
        ],
        image_url: [
          { required: true, message: '请输入头像地址', trigger: 'blur' },
        ],
        official_website: [
          { required: true, message: '请输入网站', trigger: 'blur' }
        ],
        biography:[
          {required:true,message:'请输入简介',trigger:'blur'}
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
        artist_name: '',
        nationality: '',
        image_url: '',
        official_website: '',
        biography:''
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
