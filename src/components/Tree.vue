<template>
  <div class="tree scroll_bar">
    <ul class="tree-frame">
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
      <div class="flex20">{{ ((materialsJson.price) / (materialsJson.totalPrice /
        materialsJson.amountResult) * 100).toFixed(2) }}%</div>
    </div>
  </div>
  <div class="bottom-space"></div>
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
            <div v-if="item.subMaterials && item.subMaterials.length > 0" class="expand-mark">
                <div class="expanded_minus" v-if="expanded"><img src="/icons/minus.png"></div>
                <div class="expanded_plus" v-else><img src="/icons/plus.png"></div>
            </div>
            <div class="tree-data">
              <img v-if="item.Icon" :src="'/icons/normal/' + item.Icon + '.png'" class="icon" /> <!-- アイコンを表示 -->
              <p>{{ item.itemName }}</p> <!-- アイテム名を表示 -->
            </div>
            <div class="quantity">{{ item.quantity }}個</div>
            <div class="flex20" :class="{ 'red-text': item.lowestPrice > item.subTotalPrice && item.subTotalPrice !== 0 }">
              {{
                (item.lowestPrice > item.subTotalPrice && item.subTotalPrice !== 0)
                  ? item.subTotalPrice.toLocaleString()
                  : item.lowestPrice.toLocaleString()
              }} ギル
            </div>
            <div class="flex20" :class="{ 'red-text': item.lowestPrice > item.subTotalPrice && item.subTotalPrice !== 0 }">
              {{
                (item.lowestPrice > item.subTotalPrice && item.subTotalPrice !== 0)
                  ? Math.ceil(item.subTotalPrice * item.quantity).toLocaleString()
                  : Math.ceil(item.lowestPrice * item.quantity).toLocaleString()
              }} ギル
            </div>
          <!-- 展開がある場合の条件分岐 -->
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
  font-size: 15px;
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

.tree-frame,
.tree-frame ul {
  margin: 0 0 0 1em;
  /* indentation */
  padding: 0;
  list-style: none;
  color: white;
  position: relative;
}

.tree-frame ul {
  margin-left: .5em
}

/* (indentation/2) */

.tree-frame:before,
.tree-frame ul:before {
  content: "";
  display: block;
  width: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px solid;
}

.tree-frame li {
  margin: 0;
  padding: 0 1em;
  line-height: 2em;
  font-weight: bold;
  position: relative;
  cursor: pointer;
}

.tree-frame li:before {
  content: "";
  display: block;
  width: 15px;
  height: 0;
  border-top: 1px solid;
  margin-top: auto;
  position: absolute;
  top: 20px;
  left: 0;
}

.tree-frame li:last-child:before {
  background: #262626;
  height: auto;
  top: 1em;
  bottom: 0;
}

.bottom-space {
  width: 100%;
  height: 100px;
}

.expand-mark {
  position: absolute;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: -23px;
}

.expanded_plus {
  min-width: 16px;
  min-height: 16px;
  max-width: 16px;
  max-height: 16px;
  margin-bottom: 20px;
}

.expanded_minus {
  min-width: 16px;
  min-height: 16px;
  max-width: 16px;
  max-height: 16px;
  margin-bottom: 20px;
}
</style>