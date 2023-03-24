<template>
  <div>
    <CategorySelector :disabled="disabled" />
    <SpuList></SpuList>
  </div>
</template>

<script>
import SpuList from "./components/SpuList.vue";

export default {
  name: "Spu",
  data: () => {
    return {
      disabled: false,
    };
  },
  components: { SpuList },
};
</script>

<style lang="scss" scoped></style>
