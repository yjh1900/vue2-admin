<template>
  <el-card shadow="hover">
    <el-button
      type="primary"
      class="el-icon-plus"
      @click="showTrademarkModel({ id: 0, tmName: '', logoUrl: '' })"
    >
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
          <el-button
            type="warning"
            size="small"
            class="el-icon-edit"
            @click="showTrademarkModel(row)"
          />

          <el-popconfirm
            icon="el-icon-info"
            icon-color="red"
            :title="`确认删除${row.tmName}吗`"
            @onConfirm="delTrademark(row.id)"
            style="margin-left: 5px"
          >
            <el-button
              slot="reference"
              type="danger"
              size="small"
              class="el-icon-delete"
            />
          </el-popconfirm>
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
    <el-dialog
      :title="`${ruleForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="ruleForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${BASE_URL}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="ruleForm.logoUrl"
              :src="ruleForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  getTrademarkListApi,
  addTrademarkApi,
  updateTrademarkApi,
  delTrademarkApi,
} from "@/api/product/trademark";
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
      dialogVisible: false,
      ruleForm: {
        id: 0,
        logoUrl: "",
        tmName: "",
      },
      rules: {
        logoUrl: [{ required: true, message: "请选择图片" }],
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "品牌名称长度为2-10", trigger: "blur" },
        ],
      },
      BASE_URL: process.env.VUE_APP_BASE_API,
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
    sizeChange(size) {
      this.pageSize = size;
      this.getTrademarkList();
    },
    currentChange(current) {
      this.currentPage = current;
      this.getTrademarkList();
    },
    // 关闭模态框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 添加品牌
    showTrademarkModel(row) {
      this.dialogVisible = true;
      if (row.id) {
        this.ruleForm.logoUrl = row.logoUrl;
        this.ruleForm.tmName = row.tmName;
        this.ruleForm.id = row.id;
      }
      this.$nextTick(() => {
        this.$refs["ruleForm"]?.clearValidate();
      });
    },
    // 上传头像图片成功
    handleAvatarSuccess(res, file) {
      this.ruleForm.logoUrl = res.data;
      this.$refs["ruleForm"].clearValidate(["logoUrl"]);
      console.log(res.data);
    },
    // 上传图片前校验
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            this.$message.success("修改成功");
            this.reqUpdateTrademark();
          } else {
            this.$message.success("添加成功");
            this.reqAddTrademark();
          }
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 添加品牌
    async reqAddTrademark() {
      await addTrademarkApi(this.ruleForm.tmName, this.ruleForm.logoUrl);
      this.getTrademarkList();
    },
    // 更新
    async reqUpdateTrademark() {
      await updateTrademarkApi(this.ruleForm);
      this.getTrademarkList();
    },
    // 删除
    async delTrademark(id) {
      await delTrademarkApi(id);
      this.getTrademarkList();
      console.log(123);
    },
  },
  watch: {},
  computed: {},
};
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #ddd;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 5%;
}
</style>
