<template>
  <div>
    <el-card class="mt-20" shadow="hover">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="SPU名称" prop="spuName">
          <el-input v-model="ruleForm.spuName" placeholder="请输入SPU名称" />
        </el-form-item>

        <el-form-item label="品牌" prop="tmId">
          <el-select v-model="ruleForm.tmId" placeholder="请选择">
            <el-option
              v-for="item in trademarkList"
              :key="item.id"
              :label="item.tmName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="SPU描述" prop="description">
          <el-input v-model="ruleForm.description" type="textarea" />
        </el-form-item>

        <el-form-item label="SPU图片" prop="spuImageList">
          <el-upload
            v-model:file-list="ruleForm.spuImageList"
            :action="`${BASE_URL}/admin/product/fileUpload`"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="handleUploadExceed"
            :on-success="handleUploadSuccess"
            :before-upload="beforeImageUpload"
            :limit="10"
          >
            <el-icon>
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-icon> </el-upload
          ><el-dialog :value="dialogVisible">
            <img
              v-if="ruleForm.logoUrl"
              w-full
              :src="dialogImageUrl"
              alt="Preview Image"
            />
          </el-dialog>
        </el-form-item>

        <el-form-item label="销售属性" prop="spuSaleAttrList">
          <el-select placeholder="请选择" class="mr-10" v-model="saleAttr">
            <el-option
              v-for="item in filterSaleAttrList"
              :key="item.id"
              :label="item.name"
              :value="`${item.name}:${item.id}`"
            />
          </el-select>
          <el-button
            type="primary"
            class="el-icon-plus"
            @click="addSaleAttr"
            :disabled="!saleAttr"
            >添加销售属性</el-button
          >

          <el-table
            v-loading="loading"
            :data="ruleForm.spuSaleAttrList"
            class="mt-20"
            border
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
            />
            <el-table-column prop="saleAttrName" label="属性名" width="150" />
            <el-table-column label="属性值名称列表">
              <template #default="scope">
                <el-tag
                  v-for="tag in scope.row.spuSaleAttrValueList"
                  :key="tag.id"
                  class="mx-1 mr-10"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, scope.row)"
                >
                  {{ tag.saleAttrValueName }}
                </el-tag>
                <el-input
                  v-if="scope.row.inputVisible"
                  ref="InputRef"
                  v-model="inputValue"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                />
                <el-button
                  v-else
                  class="button-new-tag ml-1"
                  size="small"
                  @click="showInput(scope.row)"
                >
                  + 添加
                </el-button>
              </template></el-table-column
            >
            <el-table-column label="操作" width="150">
              <template v-slot="{ row }">
                <el-popconfirm
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  :title="`确认删除属性${row.saleAttrName}吗`"
                  @confirm="deleteHandle(row)"
                >
                  <template #reference>
                    <el-button
                      type="danger"
                      class="el-icon-delete"
                      size="small"
                    />
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleFormRef')">
            保存
          </el-button>
          <el-button @click="resetForm('ruleFormRef')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getAllTrademarkListApi } from "@/api/product/trademark";
import {
  getBaseSaleAttrListApi,
  saveSpuInfoApi,
  getSpuInfoApi,
  getSpuImageListApi,
  getSpuSaleAttrListApi,
  postSpuInfoApi,
} from "@/api/product/spu";
import { mapState } from "vuex";
import { beforeLOGOUpload as beforeImageUpload } from "@/utils/tools";

export default {
  name: "AddOrUpdateSpu",
  // 注入
  inject: ["parent"],
  async mounted() {
    this.ruleForm = {
      ...this.parent.curSpuItem,
      category3Id: this.category3Id,
      spuSaleAttrList: [],
      spuImageList: [],
    };
    try {
      // 请求品牌和销售属性列表
      const [responseTrademarkList, responseBaseSaleAttrList] =
        await Promise.all([getAllTrademarkListApi(), getBaseSaleAttrListApi()]);
      this.trademarkList = responseTrademarkList.data;
      this.saleAttrList = responseBaseSaleAttrList.data;
      if (this.ruleForm.id) {
        // 请求图片和销售属性表格
        const [responseSpuImageList, responseSpuSaleAttrList] =
          await Promise.all([
            getSpuImageListApi(this.ruleForm.id),
            getSpuSaleAttrListApi(this.ruleForm.id),
          ]);
        console.log(responseSpuImageList.data, "ImageList");
        this.ruleForm.spuImageList = responseSpuImageList.data.map((item) => {
          return {
            name: item.imgName,
            url: item.imgUrl,
            imgUrl: item.imgUrl,
            imgName: item.imgName,
          };
        });
        this.ruleForm.spuSaleAttrList = responseSpuSaleAttrList.data;
      }
    } catch (err) {
      this.$message.error("获取属性失败了...");
    }
  },
  data: () => {
    var spuSaleAttrListValidator = (rule, value, callback) => {
      /*
        rule 规则信息对象
        value 校验数据的值
        callback 是一个函数，必须要调用
          callback(); 校验通过
          callback(new Error('错误信息')); 校验失败
      */
      //  条件判断不同情况
      if (!value.length) {
        callback(new Error("请至少添加一个销售属性"));
        return;
      }
      if (value.some((item) => !item.spuSaleAttrValueList.length)) {
        callback(new Error("每个属性至少添加一个属性值"));
        return;
      }
      // 一定要调用，校验通过
      callback();
    };
    return {
      ruleFormRef: {},
      // process.env:
      // BASE_URL:"/"
      // NODE_ENV:"development"
      // VUE_APP_BASE_API:"/dev-api"
      BASE_URL: process.env.VUE_APP_BASE_API,
      trademarkList: [],
      saleAttrList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      loading: false,
      saleAttr: "", // 销售属性，字符串拼接了名字和id
      inputValue: "",
      rules: {
        spuName: [
          { required: true, message: "请输入spu名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2-10之间", trigger: "blur" },
        ],
        tmId: [
          {
            required: true,
            message: "请选择一个品牌",
            trigger: "change",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入spu描述",
            trigger: "blur",
          },
        ],
        spuImageList: [
          {
            required: true,
            message: "请上传SPU图片",
          },
        ],
        // prop的值和rules的属性名要一一对应
        spuSaleAttrList: [
          {
            required: true,
            validator: spuSaleAttrListValidator,
          },
        ],
      },
      // 定义表单数据
      ruleForm: {
        category3Id: 0,
        spuName: "",
        tmId: "",
        description: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
    };
  },
  computed: {
    ...mapState("category", ["category3Id"]),
    /*
      销售属性功能
      对saleAttrList进行过滤，判断基础销售属性在不在spuSaleAttrList中
        在，过滤
        不在，保留
    */
    // const filteredBaseSaleAttrList = computed(() => {
    //   return baseSaleAttrList.value.filter((baseSaleAttr) => {
    //     if (
    //       spuFormData.spuSaleAttrList.some(
    //         (spuSaleAttr) => spuSaleAttr.baseSaleAttrId === baseSaleAttr.id
    //       )
    //     ) {
    //       // 在，过滤
    //       return false;
    //     }
    //     // 不在，保留
    //     return true;
    //   });
    // });
    filterSaleAttrList() {
      // 根据销售属性表格中的属性来计算，表格里已添加的属性就在下拉框中过滤
      return this.saleAttrList.filter((item) => {
        return !this.ruleForm.spuSaleAttrList.some(
          (i) => i.saleAttrName == item.name
        );
      });
    },
  },
  methods: {
    handleClose(tag, row) {
      row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(tag), 1);
    },
    handleInputConfirm(row) {
      if (this.inputValue) {
        row.spuSaleAttrValueList.push({
          saleAttrValueName: this.inputValue,
        });
        this.inputValue = "";
        row.inputVisible = false;
        console.log(row);
      }
      // if (inputValue.value) {
      //   console.log(row, "row");
      //   // 根据接口数据，向属性值tags列表中添加数据对象
      //   row.spuSaleAttrValueList.push({
      //     saleAttrValueName: inputValue.value,
      //     baseSaleAttrId: row.baseSaleAttrId,
      //     saleAttrName: row.saleAttrName,
      //   });
      // }
      // row.inputVisible = false;
      // inputValue.value = "";
    },
    // 图片预览窗口
    handlePictureCardPreview(uploadFile) {
      console.log("Preview");
      dialogImageUrl.value = uploadFile.url;
      dialogVisible.value = true;
    },
    // 删除
    handleRemove(uploadFile, uploadFiles) {
      // console.log(uploadFile, uploadFiles);
    },
    handleUploadExceed() {
      this.$message.error("上传图片总数最多10张");
    },
    // 上传成功，清空表单校验结果
    handleUploadSuccess(uploadFile, res) {
      // console.log(this.ruleForm.spuImageList, "ruleFormRef.spuImageList");
      // console.log(uploadFile, "uploadFile");
      this.ruleForm.spuImageList.push({
        imgName: res.name,
        imgUrl: res.response.data,
      });
      console.log(this.ruleForm.spuImageList);
      // ruleFormRef.value.clearValidate(["spuImageList"]);
    },
    // 取消提交重置表单
    resetForm(refForm) {
      if (!refForm) return;
      (this.parent.curSpuItem = {
        category3Id: 0,
        description: "",
        id: "",
        spuImageList: [],
        spuName: "",
        spuSaleAttrList: [],
        tmId: "",
      }),
        (this.parent.isShowView = 1);
    },
    beforeImageUpload() {},

    // 添加spuSaleAttrList
    addSaleAttr() {
      this.ruleForm.spuSaleAttrList.forEach((item) => {
        item.inputVisible = false;
      });
      this.ruleForm.spuSaleAttrList.push({
        inputVisible: true,
        saleAttrName: this.saleAttr.split(":")[0],
        spuSaleAttrValueList: [],
      });
      // // 找到当前点击的行数
      // const index = this.ruleForm.spuSaleAttrList.indexOf(row);
      // // 将其他行的input可见置为false
      // this.ruleForm.spuSaleAttrList = this.ruleForm.spuSaleAttrList.map(
      //   (item, ind) => {
      //     if (index === ind) return item;
      //     item.inputVisible = false;
      //     return item;
      //   }
      // );
      this.$nextTick(() => {
        this.$refs["InputRef"].focus();
      });
      this.saleAttr = "";
    },
    showInput(row) {
      console.log(row, "showInput");

      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs["InputRef"].focus();
      });
    },
    // 保存表单
    submitForm(formEL) {
      this.$refs[formEL].validate(async (valid) => {
        if (valid) {
          if (!this.ruleForm.id) {
            await saveSpuInfoApi(this.ruleForm);
          } else {
            await postSpuInfoApi(this.ruleForm);
          }
          // 回到spu列表
          this.parent.isShowView = 1;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
// 依赖注入
// const isComponentShow = inject("isComponentShow")
// const curSpuItem = inject("curSpuItem")

// const categoryStore = useCategoryStore();

// const inputValue = ref("");
// const InputRef = ref<InstanceType<typeof ElInput>>();
// const BASE_URL = import.meta.env.VITE_API_URL;

// const trademarkList = ref<TrademarkList>([]);
// const saleAttrList = ref([]);
// const dialogImageUrl = ref("");
// const dialogVisible = ref(false);

// // 销售属性，字符串拼接了名字和id
// const saleAttr = ref();

// const filterSaleAttrList = computed(() => {
//   // 筛选销售属性列表，遍历每一条，看看在当前属性有没有加入表格中
//   return saleAttrList.value.filter((item) => {
//     return !ruleForm.spuSaleAttrList?.some(
//       (spu) => spu.baseSaleAttrId === item.id
//     );
//   });
// });

// // 属性值列表修改的输入框聚焦与显示
// const showInput = (row) => {
//   row.inputVisible = true;
//   nextTick(() => {
//     InputRef.value!.input!.focus();
//   });
// };

// // 添加属性值列表
// const handleInputConfirm = (row) => {
//   if (inputValue.value) {
//     console.log(row, "row");
//     // 根据接口数据，向属性值tags列表中添加数据对象
//     row.spuSaleAttrValueList.push({
//       saleAttrValueName: inputValue.value,
//       baseSaleAttrId: row.baseSaleAttrId,
//       saleAttrName: row.saleAttrName,
//     });
//   }
//   row.inputVisible = false;
//   inputValue.value = "";
// };

// onMounted(async () => {
//   try {
//     const [responseTrademarkList, responseBaseSaleAttrList] = await Promise.all(
//       [getAllTrademarkListApi(), getBaseSaleAttrListApi()]
//     );
//     trademarkList.value = responseTrademarkList;
//     saleAttrList.value = responseBaseSaleAttrList;
//   } catch (err) {
//     ElMessage.error("获取属性失败了...");
//   }
// });
// // 获取更新的页面数据
// onMounted(async () => {
//   console.log(curSpuItem);

//   if (!curSpuItem.value) return;

//   const imgList = await getSpuImageListApi(curSpuItem.value.id as number);
//   const attrValueList = await getSpuSaleAttrListApi(
//     curSpuItem.value.id as number
//   );

//   ruleForm.spuImageList = imgList.map((item) => {
//     return {
//       name: item.imgName,
//       url: item.imgUrl,
//       response: {
//         data: item.imgUrl,
//       },
//     };
//   });
//   console.log(ruleForm.spuImageList);

//   ruleForm.spuSaleAttrList = attrValueList;
// });

// const resetSaleAttr = () => {
//   // 重置销售列表的当前选中项，若列表还有值那就选中第一项
//   saleAttr.value = filterSaleAttrList.value.length
//     ? `${filterSaleAttrList.value[0].name}:${filterSaleAttrList.value[0].id}`
//     : undefined;
// };

// // 修改销售属性选项
// const addSaleAttr = () => {
//   // 将选中的销售属性删除
//   //   saleAttrList.value = saleAttrList.value.filter(
//   //     (item) => item.id !== parseInt(saleAttr.value.split(":")[1])
//   //   );
//   // 将删除的属性添加到表格中
//   ruleForm.spuSaleAttrList.push({
//     baseSaleAttrId: +saleAttr.value.split(":")[1], // '+'转number类型
//     saleAttrName: saleAttr.value.split(":")[0],
//     spuSaleAttrValueList: [],
//     inputVisible: false,
//   });
//   resetSaleAttr();
// };

// // 删除销售属性
// const deleteHandle = (val) => {
//   //  删除销售属性列表数据
//   ruleForm.spuSaleAttrList = ruleForm.spuSaleAttrList.filter(
//     (item) => item.baseSaleAttrId !== val.baseSaleAttrId
//   );
//   //  重新添加到select中
//   //   saleAttrList.value.push({
//   //     id: val.baseSaleAttrId,
//   //     name: val.saleAttrName,
//   //   });
//   resetSaleAttr();
// };

// // const fileList = ref<UploadUserFile[]>([
// //   {
// //     name: "food.jpeg",
// //     url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
// //   },
// // ]);

// const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
//   console.log(uploadFile, uploadFiles);
// };

// const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
//   dialogImageUrl.value = uploadFile.url!;

//   dialogVisible.value = true;
// };
// const handleUploadExceed: UploadProps["onExceed"] = () => {
//   ElMessage.error("上传图片总数最多10张");
// };

// // 上传成功，清空表单校验结果
// const handleUploadSuccess: UploadProps["onSuccess"] = (uploadFile) => {
//   console.log(ruleForm.spuImageList, "ruleFormRef.spuImageList");
//   ruleFormRef.value.clearValidate(["spuImageList"]);
// };

// const loading = ref(false);

// const ruleFormRef = ref<FormInstance>();

// // 定义表单数据
// const ruleForm = reactive<SpuItem>({
//   category3Id: categoryStore.category3Id as number,
//   spuName: curSpuItem.value?.spuName,
//   tmId: curSpuItem.value?.tmId,
//   description: curSpuItem.value?.description,
//   spuImageList: [],
//   spuSaleAttrList: <SpuSaleAttrList>[],
// });

// const submitForm = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   await formEl.validate(async (valid, fields) => {
//     if (valid) {
//       const id = curSpuItem.value?.id;
//       const { spuName, tmId, description, spuImageList, spuSaleAttrList } =
//         ruleForm;
//       const data = {
//         category3Id: categoryStore.category3Id,
//         spuName,
//         tmId,
//         description,
//         spuImageList: spuImageList.map((item) => {
//           return { imgName: item.name, imgUrl: item.response.data };
//         }),
//         spuSaleAttrList,
//       };
//       console.log(data.spuImageList, "imglist");

//       if (id) {
//         await postSpuInfoApi({ ...data, id });
//       } else {
//         await saveSpuInfoApi(data);
//       }
//       isComponentShow.value = 0;
//     } else {
//       console.log("error submit!", fields);
//     }
//   });
// };
// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   formEl.resetFields();
//   curSpuItem.value = null;
//   isComponentShow.value = 0;
// };
</script>

<style lang="scss" scoped></style>
