<template>
  <div>
    <CategorySelector :disabled="disabled" />
    <SpuList v-if="isShowView === 1"></SpuList>
    <AddOrUpdateSpu v-if="isShowView === 2"></AddOrUpdateSpu>
    <AddSku v-if="isShowView === 3"></AddSku>
  </div>
</template>

<script>
import SpuList from "./components/SpuList.vue";
import AddOrUpdateSpu from "./components/AddOrUpdateSpu.vue";
import AddSku from "./components/AddSku.vue";

export default {
  name: "Spu",
  data: () => {
    return {
      isShowView: 1, // 1.spu列表，2.spu表单，3.添加sku
      curSpuItem: {
        category3Id: 0,
        description: "",
        id: "",
        spuImageList: [],
        spuName: "spuName",
        spuSaleAttrList: [],
        tmId: "",
      },
    };
  },
  provide: function () {
    return {
      parent: this,
    };
  },
  computed: {
    disabled() {
      return this.isShowView !== 1;
    },
  },

  components: { SpuList, AddOrUpdateSpu, AddSku },
};
</script>

<style lang="scss" scoped></style>
