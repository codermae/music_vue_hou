<template>
  <el-input
    v-model="searchQuery"
    :placeholder="placeholder"
    @keyup.enter="onSearch"
    style="width: 300px; margin-bottom: 10px;"
  >
    <template #append>
      <el-button @click="onSearch" icon="el-icon-search"></el-button>
    </template>
  </el-input>
</template>

<script>
export default {
  name: 'SongSearch',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder:{
      type:String,
      default:'搜索内容'
    }
  },
  data() {
    return {
      searchQuery: this.modelValue
    };
  },
  watch: {
    modelValue(newValue) {
      this.searchQuery = newValue;
    },
    searchQuery(newValue) {
      this.$emit('update:modelValue', newValue);
    }
  },
  methods: {
    onSearch() {
      this.$emit('search', this.searchQuery);
    }
  }
};
</script>
