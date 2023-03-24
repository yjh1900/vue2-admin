<template>
  <div>
    <el-card class="category" shadow="hover">
      <!-- :disabled="disabled" -->
      <el-form :inline="true" class="demo-form-inline" :disabled="disabled">
        <el-form-item label="一级分类">
          <el-select
            v-model="category1Id"
            class="m-2"
            placeholder="请选择一级分类"
          >
            <el-option
              v-for="c1 in category1List"
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
              v-for="c2 in category2List"
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
            @change="setCategory3Id"
          >
            <el-option
              v-for="c3 in category3List"
              :key="c3.id"
              :label="c3.name"
              :value="c3.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import store from "@/store";
import { mapState, mapActions } from "vuex";
export default {
  name: "CategorySelector",
  props: ["disabled"],
  mounted() {
    this.getCategory1List();
    console.log(this.getCategory1List, "attr");
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
    };
  },
  computed: {
    ...mapState("category", [
      "category1List",
      "category2List",
      "category3List",
    ]),
  },
  methods: {
    ...mapActions("category", [
      "getCategory1List",
      "getCategory2List",
      "getCategory3List",
    ]),
    // 更新3category3Id
    setCategory3Id() {
      // 直接commit一个mutation,去更新id值
      this.$store.commit("category/CHANGE_3ID", this.category3Id);
    },
  },
  watch: {
    category1Id: {
      handler(newV) {
        this.getCategory2List(this.category1Id);
        // 这里置为undefine会报错，待解决
        this.category2Id = "";
        this.category3Id = "";
      },
    },
    category2Id: {
      handler(newV) {
        this.getCategory3List(this.category2Id);
        this.category3Id = "";
      },
    },
  },
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
