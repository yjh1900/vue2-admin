<template>
  <div>
    <!-- <el-card class="category" shadow="hover">
      <el-form :inline="true" class="demo-form-inline" :disabled="disabled">
        <el-form-item label="一级分类">
          <el-select
            v-model="category1Id"
            class="m-2"
            placeholder="请选择一级分类"
          >
            <el-option
              v-for="c1 in categoryStore.category1List"
              :key="c1.id"
              :label="c1.name"
              :value="c1.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="category2Id"
            class="m-2"
            placeholder="请选择二级分类"
          >
            <el-option
              v-for="c2 in categoryStore.category2List"
              :key="c2.id"
              :label="c2.name"
              :value="c2.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="category3Id"
            class="m-2"
            placeholder="请选择三级分类"
          >
            <el-option
              v-for="c3 in categoryStore.category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card> -->
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
};
</script>

<style lang="scss" scoped>
.category {
  .el-card__body {
    .el-form-item {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
