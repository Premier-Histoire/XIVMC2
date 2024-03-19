<template>
  <div class="tree">
    <ul>
      <tree-item v-for="item in materialsJson.materials" :key="item.itemId" :item="item" />
    </ul>
    <div class="tree-item border-top">
      <div class="tree-data"></div>
      <div class="quantity"></div>
      <div class="flex20">1個単価:</div>
      <div class="flex20">{{ (materialsJson.totalPrice / materialsJson.amountResult).toLocaleString() }}ギル</div>
    </div>
    <div class="tree-item">
      <div class="tree-data"></div>
      <div class="quantity"></div>
      <div class="flex20">相場価格:</div>
      <div class="flex20">{{ (materialsJson.price).toLocaleString() }}ギル</div>
    </div>
    <div class="tree-item">
      <div class="tree-data"></div>
      <div class="quantity"></div>
      <div class="flex20">利益率:</div>
      <div class="flex20">{{ ((materialsJson.price)/(materialsJson.totalPrice / materialsJson.amountResult)*100).toFixed(2) }}%</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    materialsJson: {
      type: Object,
      required: true
    }
  },
  components: {
    TreeItem: {
      name: 'TreeItem',
      props: ['item', 'price'],
      data() {
        return {
          expanded: false,
          subprice: '',
        };
      },
      template: `
        <li>
          <div @click="toggle" class="tree-item">
            <div class="tree-data">
              <img v-if="item.Icon" :src="'/icons/normal/' + item.Icon + '.png'" class="icon" /> <!-- アイコンを表示 -->
              <p>{{ item.itemName }}</p> <!-- アイテム名を表示 -->
            </div>
            <div class="quantity">{{ item.quantity }}個</div>
            <div class="flex20" v-if="item.totalPrice === 0 || item.price < item.totalPrice">{{ item.price }} ギル</div>
            <div class="flex20 red-text" v-else>{{ item.totalPrice }} ギル</div>
            <div class="flex20">{{ Math.ceil(item.quantity * item.price).toLocaleString() }}ギル</div>
          </div>
          <ul v-if="expanded && item.subMaterials && item.subMaterials.length > 0">
            <tree-item v-for="subItem in item.subMaterials" :key="subItem.itemId" :item="subItem" :price="price" />
          </ul>
        </li>
      `,
      methods: {
        toggle() {
          this.expanded = !this.expanded; // 展開状態を反転させる
        },
      },
    },
  },
};
</script>

<style>
li {
  list-style-type: none;
}

ul {
  padding-left: 0px !important;
}

li ul {
  padding-left: 2rem !important;
}

.tree-item {
  width: 100%;
  display: flex;
  /* flexbox を使って子要素を横並びに配置 */
  align-items: center;
  /* 子要素を縦方向中央に配置 */
  margin-bottom: 10px;
}

.padding-top {
  padding-top: 5px
}

.tree {
  padding: 0px 20px 0px 20px;
  font-size: 16px;
}

.tree-data {
  flex: 5;
  display: flex;
}

.tree-data p {
  margin-top: auto;
  margin-bottom: auto;
}

.tree-data .icon {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}

.quantity {
  flex: 1;
  text-align: right;
}

.flex20 {
  flex: 2;
  text-align: right;
}

.red-text {
  color: red;
}

.info-bar {
  width: calc(100% - 40px);
  height: 24px;
  display: flex;
  margin-bottom: 10px;
}

.border-top {
  border-top: 1px solid white;
}

.spaceflex {
  flex: 7;
  height: 24px;
}

.flex20 {
  flex: 1.5;
  text-align: right;
}

.space {
  width: 100%;
  height: 300px;
}
</style>