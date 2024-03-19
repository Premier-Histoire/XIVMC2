<template>
  <div>
    <ul>
      <tree-item v-for="item in materialsJson" :key="item.itemId" :item="item" :price="price" />
    </ul>
    <div class="info-bar border-top">
      <div class="spaceflex"></div>
      <div>1個当たりの単価: {{ Math.ceil(calculateTotalPrice(materialsJson) / materialsJson.amountResult).toLocaleString() }}ギル</div>
    </div>
    <div class="info-bar">
      <div class="spaceflex"></div>
      <div>相場価格: {{ materialsJson.price.toLocaleString() }}ギル</div>
    </div>
    <div class="info-bar">
      <div class="spaceflex"></div>
      <div>利益率: {{ (materialsJson.price/Math.ceil(calculateTotalPrice(materialsJson) / materialsJson.amountResult)*100).toFixed(2) }}%</div>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: ['materialsJson'],
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
            <div :class="['price', { 'red-text': this.subprice }]" >{{ Math.ceil(price(item)).toLocaleString() }}ギル</div>
            <div class="totalprice">{{ Math.ceil(item.quantity * price(item)).toLocaleString() }}ギル</div>
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
  methods: {
    isPriceLower(item) {
      if (item.subMaterials && item.subMaterials.length > 0) {
        const parentPrice = item.price;
        let subMaterialsTotalPrice = 0;
        for (const subItem of item.subMaterials) {
          subMaterialsTotalPrice += subItem.price * subItem.quantity;
        }
        const totalPriceRatio = subMaterialsTotalPrice / item.amountResult;
        return totalPriceRatio;
      }
      return false; // サブ素材がない場合は false を返す
    },
    price(item) {
      if (item.isCraftable === false) {
        return item.price;
      } else if (item.price > this.isPriceLower(item)) {
        this.subprice = true;
        return this.isPriceLower(item);
      } else {
        this.subprice = true;
        return item.price;
      }
    },
    calculateTotalPrice(materials) {
      let totalPrice = 0;
      for (const item of materials) {
        totalPrice += item.quantity * this.price(item);
        if (item.subMaterials && item.subMaterials.length > 0) {
          totalPrice += this.calculateTotalPrice(item.subMaterials);
        }
      }
      return totalPrice;
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
  width: calc(100% - 40px);
  display: flex;
  /* flexbox を使って子要素を横並びに配置 */
  align-items: center;
  /* 子要素を縦方向中央に配置 */
  margin-bottom: 10px;
}

.tree-data {
  flex: 5;
  display: flex;
}

.tree-data p {
  margin-bottom: 0;
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

.price {
  flex: 1.5;
  text-align: right;
}

.totalprice {
  flex: 1.5;
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
  flex: 2;
  height: 24px;
}

.space {
  width: 100%;
  height: 300px;
}
</style>
