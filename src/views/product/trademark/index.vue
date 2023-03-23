<template>
  <el-card shadow="hover">
    <el-button type="primary" class="el-icon-plus" @click="addTrademark">
      添加品牌
    </el-button>

    <!-- 
      data 要渲染的数据
      border 带边框
     -->
    <el-table
      v-loading="loading"
      :data="trademarkList"
      border
      class="trademark__table"
    >
      <!--  
        el-table-column 列
          prop="xxx" 要渲染data中哪个数据
          label="序号" 列的标题
          type="index" 渲染从1开始的序号
          width="60" 列的宽度
          align="center" 居中对齐
      -->
      <el-table-column label="序号" type="index" width="60" align="center" />
      <!-- 想渲染纯文本数据，prop="数据名称"，就可以完成 -->
      <el-table-column prop="tmName" label="品牌名称" />
      <!-- 想要渲染别的结构：图片、按钮等，就需要使用插槽 -->
      <el-table-column label="品牌LOGO">
        <!-- 
          row 就是当前行数据
          $index 就是当前行数据的下标
         -->
        <!-- <template #default="{ row }"> -->
        <template v-slot="{ row }">
          <img :src="row.logoUrl" :alt="row.tmName" class="trademark__img" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="warning" size="small" class="el-icon-edit" />
          <el-button type="danger" size="small" class="el-icon-delete" />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[5, 10, 20]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </el-card>
</template>

<script>
import { getTrademarkListApi } from "@/api/product/trademark";
export default {
  name: "Trademark",
  mounted() {
    this.getTrademarkList();
  },
  data() {
    return {
      pageSize: 5,
      currentPage: 1,
      total: 0,
      trademarkList: [],
      loading: false,
    };
  },
  methods: {
    // 封装列表数据请求函数
    async getTrademarkList() {
      this.loading = true;
      const list = await getTrademarkListApi(this.currentPage, this.pageSize);
      const { records, total } = list.data;
      this.trademarkList = records;
      this.total = total;
      this.loading = false;
    },
    addTrademark() {},
    sizeChange(size) {
      this.pageSize = size;
      this.getTrademarkList();
    },
    currentChange(current) {
      this.currentPage = current;
      this.getTrademarkList();
    },
  },
  watch: {},
  computed: {},
};
// import { Pagination } from "element-ui";
</script>

<style lang="scss" scoped>
.trademark__table {
  margin: 20px 0;
}

.trademark__img {
  width: 100px;
  height: 80px;
}

.trademark__input {
  width: 350px;
}

// 有引用说明样式是当前组件的
.avatar-uploader {
  :deep() {
    // 没有引用说明样式是后代组件的
    // 想要操作后代组件的样式，需要使用深度样式选择器
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
