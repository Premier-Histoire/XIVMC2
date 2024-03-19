<template>
  <div>
    <ul>
      <tree-item v-for="item in materialsJson" :key="item.itemId" :item="item" />
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: ['materialsJson'],
  components: {
    TreeItem: {
      name: 'TreeItem',
      props: ['item'],
      data() {
        return {
          expanded: false // 各アイテムの展開状態を管理するデータ
        };
      },
      template: `
        <li>
          <div @click="toggle" class="tree-item">
            <img v-if="item.Icon" :src="'/icons/normal/' + item.Icon + '.png'" class="icon" /> <!-- アイコンを表示 -->
            <p>{{ item.itemName }}</p> <!-- アイテム名を表示 -->
          </div>
          <ul v-if="expanded && item.subMaterials && item.subMaterials.length > 0">
            <tree-item v-for="subItem in item.subMaterials" :key="subItem.itemId" :item="subItem" />
          </ul>
        </li>
      `,
      methods: {
        toggle() {
          this.expanded = !this.expanded; // 展開状態を反転させる
        }
      }
    }
  }
};
</script>

<style scoped>
.tree-item {
  display: flex; /* flexbox を使って子要素を横並びに配置 */
  align-items: center; /* 子要素を縦方向中央に配置 */
}
.tree-item .icon {
  display: inline-block; /* アイコンを行内要素として表示 */
  margin-right: 10px; /* アイコンとアイテム名の間に余白を追加 */
}
</style>
