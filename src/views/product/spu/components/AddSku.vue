<template>
  <div class="addSku">
    <el-card class="mt-20" shadow="hover">
      <el-form ref="form" :model="skuForm" label-width="80px">
        <el-form-item label="SPU名称">
          {{ this.parent.curSpuItem.spuName }}
        </el-form-item>
        <el-form-item label="SKU名称">
          <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input v-model="skuForm.price" placeholder="价格(元)"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <el-input
            v-model="skuForm.weight"
            placeholder="重量(千克)"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input
            type="textarea"
            v-model="skuForm.skuDesc"
            placeholder="规格描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-col
            :xs="8"
            :sm="6"
            :md="6"
            :lg="4"
            :xl="1"
            v-for="(attr, i) in attrList"
            :key="attr.id"
            style="margin-right: 20px; margin-bottom: 10px"
          >
            <span> {{ attr.attrName }}</span>
            <el-select
              v-model="skuForm.skuAttrValueList[i]"
              placeholder="请选择"
            >
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attr.attrName}:${attrValue.id}:${attrValue.valueName}`"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="销售属性">
          <div v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
            <span class="mr-10">{{ saleAttr.saleAttrName }}</span>
            <el-select
              v-model="skuForm.skuSaleAttrValueList[index]"
              placeholder="请选择"
            >
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttr.saleAttrName}:${saleAttrValue.id}:${saleAttrValue.saleAttrValueName}`"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table
            border
            ref="multipleTable"
            :data="spuImageList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="照片" width="120">
              <template slot-scope="scope">
                <img :src="scope.row.imgUrl" class="img" />
              </template>
            </el-table-column>
            <el-table-column width="280" prop="imgName" label="名称">
            </el-table-column>
            <el-table-column prop="address" label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  @click="setDefaultImg(scope.row)"
                  type="primary"
                  size="small"
                  v-if="!scope.row.isDefault"
                  >设为默认图片</el-button
                >
                <span v-if="scope.row.isDefault">默认</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getSpuSaleAttrListApi,
  getSpuImageListApi,
  postSpuInfoApi,
  postSkuInfoApi,
} from "@/api/product/spu";
import { getAttrListApi } from "@/api/product/attr";
import { addSkuApi } from "@/api/product/sku";
export default {
  name: "AddSpu",
  inject: ["parent"],
  async mounted() {
    try {
      // allSettled
      const [responseSpuSaleAttrList, responseSpuImageList, responseAttrList] =
        await Promise.all([
          getSpuSaleAttrListApi(this.parent.curSpuItem.id),
          getSpuImageListApi(this.parent.curSpuItem.id),
          getAttrListApi(),
        ]);
      this.attrList = responseAttrList.data;
      this.spuSaleAttrList = responseSpuSaleAttrList.data;
      this.spuImageList = responseSpuImageList.data;
    } catch (err) {
      this.$message.error(err.message);
    }
  },
  data() {
    return {
      attrList: [],
      spuImageList: [],
      spuSaleAttrList: [],
      skuForm: {
        skuName: "",
        price: undefined,
        weight: undefined,
        skuDesc: "",
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
        skuDefaultImg: "",
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      //向skuForm中存入父组件传入的三级分类Id
      this.skuForm.category3Id = this.parent.curSpuItem.category3Id;
      //向skuForm中存入当前Spu的品牌Id
      this.skuForm.tmId = this.parent.curSpuItem.tmId;
      //向skuForm中存入当前Spu的id
      this.skuForm.spuId = this.parent.curSpuItem.id;
      //处理平台属性列表
      //skuForm.skuAttrValueList中的每个对象都必须要有attrId(平台属性id)和valueId(平台属性值id)
      (this.skuForm.skuAttrValueList = this.skuForm.skuAttrValueList
        .filter(Boolean)
        .map((attr) => {
          const [attrId, attrName, valueId, valueName] = attr.split(":");
          return {
            attrId: +attrId,
            attrName,
            valueId: +valueId,
            valueName,
          };
        })),
        (this.skuForm.skuSaleAttrValueList = this.skuForm.skuSaleAttrValueList
          .filter(Boolean)
          .map((attr) => {
            const [
              saleAttrId,
              saleAttrName,
              saleAttrValueId,
              saleAttrValueName,
            ] = attr.split(":");
            return {
              saleAttrId: +saleAttrId,
              saleAttrName,
              saleAttrValueId: +saleAttrValueId,
              saleAttrValueName,
            };
          })),
        await addSkuApi(this.skuForm);
      this.$message.success("添加完成");
      // 回到spu列表
      this.parent.isShowView = 1;
    },
    cancel() {
      this.parent.curSpuItem = {
        category3Id: 0,
        description: "",
        id: "",
        spuImageList: [],
        spuName: "spuName",
        spuSaleAttrList: [],
        tmId: "",
      };
      this.parent.isShowView = 1;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.skuForm.skuImageList = val.map(
        ({ imgName, imgUrl, isDefault, id: spuImgId }) => {
          return {
            imgName,
            imgUrl,
            isDefault,
            spuImgId,
          };
        }
      );
    },
    // 设置默认图片
    setDefaultImg(row) {
      // 找到当前默认图片下标
      const index = this.spuImageList.findIndex(
        (item) => item.isDefault === true
      );
      // 若不为负一，就将默认取消
      if (index !== -1) {
        this.spuImageList[index].isDefault = false;
      }
      // this.row.isDefault = true;
      this.$set(row, "isDefault", true);
      this.skuForm.skuDefaultImg = row.imgUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
.addSku ::v-deep .el-row {
  margin-bottom: 20px;
  background-color: aqua;
  &:last-child {
    margin-bottom: 0;
  }
}
.img {
  width: 100px;
}
</style>
