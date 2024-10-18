<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="uploadForm" label-width="120px" style="max-width: 500px; margin: 10px auto;">
      <el-form-item label="歌曲名" prop="song_name">
        <el-input v-model="formData.song_name"></el-input>
      </el-form-item>
      <el-form-item label="演唱者" prop="performer">
        <el-input v-model="formData.performer"></el-input>
      </el-form-item>
      <el-form-item label="歌手ID" prop="artist_id">
        <el-input v-model="formData.artist_id"></el-input>
      </el-form-item>
      <el-form-item label="专辑ID" prop="album_id">
        <el-input v-model="formData.album_id"></el-input>
      </el-form-item>
      <el-form-item label="歌曲时长" prop="duration">
        <el-input v-model="formData.duration" placeholder="04:15:00"></el-input>
      </el-form-item>
      <el-form-item label="歌曲类型" prop="genre">
        <el-input v-model="formData.genre"></el-input>
      </el-form-item>
      <el-form-item label="播放量" prop="views">
        <el-input v-model="formData.views"></el-input>
      </el-form-item>
      <el-form-item label="下载量" prop="downloads">
        <el-input v-model="formData.downloads"></el-input>
      </el-form-item>
      <el-form-item label="歌曲路径" prop="file_path">
        <el-input v-model="formData.file_path"></el-input>
      </el-form-item>
      <el-form-item label="发布日期"  prop="publish_date">
              <el-date-picker
                v-model="formData.publish_date"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createItem } from '@/api/nested';

export default {
  data() {
    return {
      formData: {
        song_name: '',
        performer: '',
        artist_id:'',
        album_id:'',
        duration:'',
        genre:'',
        views:'',
        downloads:'',
        file_path:'',
        publish_date:''
      },
      rules: {
        song_name: [
          { required: true, message: '请输入歌曲名', trigger: 'blur' },
        ],
        performer: [
          { required: true, message: '请输入歌手', trigger: 'blur' },
        ],
        artist_id: [
          { required: true, message: '请输入ID', trigger: 'blur' },
          {pattern:/^\d+$/,message:'请输入正确的歌手ID',trigger:'blur'}
        ],
        album_id: [
          { required: true, message: '请输入专辑ID', trigger: 'blur' },
          {pattern:/^\d+$/,message:'请输入正确的专辑ID',trigger:'blur'}
        ],
        genre: [
          { required: true, message: '请输入专辑ID', trigger: 'blur' },
        ],
        duration: [
          { required: true, message: '请输入歌曲时长', trigger: 'blur' },
          {pattern:/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,message:'请输入正确的时间格式04:15:00',trigger:'blur'}
        ],
        views:[
          {required:true,message:'请输入播放量',trigger:'blur'}
          ,{pattern:/^\d+$/,message:'请输入正确的播放量',trigger:'blur'}
        ],
        downloads:[
          {required:true,message:'请输入下载量',trigger:'blur'}
          ,{pattern:/^\d+$/,message:'请输入正确的下载量',trigger:'blur'}
        ],
        file_path:[
          {required:true,message:'请输入歌曲路径',trigger:'blur'}
        ],
        publish_date:[
          {required:true,message:'请选择日期',trigger:'blur'}
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
        song_name: '',
        performer: '',
        artist_id:'',
        album_id:'',
        duration:'',
        genre:'',
        views:'',
        downloads:'',
        file_path:'',
        publish_date:''
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
