<template>
  <div class="contents">
    <div v-if="!jsonLoading" class="loading-full">
      <Loading />
    </div>
    <div :class="['sidebar', { 'close': !isSearchBoxOpen }]">
      <div class="search-box">
        <Search @send-data="SearchItems" />
      </div>
    </div>
    <div class="result-box">
      <div :class="['result-header', { 'result-header-close': !isSearchBoxOpen }]" @click="toggleSearchBox">
        <div class="toggle-search-box">
          <span v-if="this.isSearchBoxOpen"><i class="fas fa-chevron-left" /></span>
          <span v-else><i class="fas fa-chevron-right" /></span>
        </div>
        <div class="result-img">
          <img v-if="searchinfo.id !== undefined" :src="imageSrc">
        </div>
        <div :class="{ 'result-text': true, 'freesearch-text': searchinfo.id === undefined }">{{ this.searchinfo.text }}
        </div>
      </div>
      <div :class="['result-items scroll_bar', { 'result-items-close': !isSearchBoxOpen }]">
        <div class="result-margin">
          <div ref="scrollableElement" class="result-itemlist scroll_bar">
            <div class="result-item" v-for="(item, index) in searchResults" :key="item" @click="selectItem(item)"
              :class="{ 'last-item': index === searchResults.length - 1 }">
              <div class="item-icon">
                <img :src="`/icons/normal/${item.Icon}.png`" alt="Icon">
              </div>
              <div class="result-name">{{ item.Name }}</div>
              <div class="loadstone" @click.stop="">
                <a :href="'https://jp.finalfantasyxiv.com/lodestone/playguide/db/item/' + item.loadstoneid"
                  class="eorzeadb_link" target="_blank">
                  <img src="./assets/img/lodestone.png">
                </a>
              </div>
              <div class="item-craftable">
                <img v-if="item.isCraftable" src="./assets/img/craft.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info-box">
      <div class="info-header">
        <div class="info-text">詳細情報</div>
      </div>
      <Info ref="infoComponent" :materialsJson="materialsJson" :infoLoading="infoLoading"
        :infoProgress="infoProgress" />
    </div>
  </div>
</template>

<script>
import Search from './components/Search.vue'
import Info from './components/Info.vue'
import Loading from './components/Loading.vue'

export default {
  data() {
    return {
      jsonLoading: false,
      infoLoading: '',
      infoProgress: '',
      isSelectBoxOpen: false,
      selectedServer: '',
      selectedInfo: [],
      searchResults: [],
      searchQuery: '',
      searchinfo: [],
      imageSrc: '',
      materialsJson: [],
      Result: '',
      isSearchBoxOpen: true,
    }
  },
  components: {
    Loading,
    Search,
    Info
  },
  created() {
    this.loadJsonData();
    const searchValue = localStorage.getItem('searchvalue');
    if (!searchValue) {
      localStorage.setItem('searchvalue', 'Chocobo');
    }
  },
  methods: {
    scrollToTop() {
      this.$refs.scrollableElement.scrollTop = 0;
    },
    toggleSearchBox() {
      this.isSearchBoxOpen = !this.isSearchBoxOpen;
    },
    async loadJsonData() {
      this.jsonLoading = false;
      try {
        const itemsResponse = await fetch('/json/Item.json');
        const recipeResponse = await fetch('/json/Recipe.json');
        const classJobCategoriesResponse = await fetch('/json/ClassJobCategory.json');
        if (!itemsResponse.ok || !recipeResponse.ok || !classJobCategoriesResponse.ok) {
          throw new Error('JSONファイルの読み込みに失敗しました。');
        }
        this.itemsData = await itemsResponse.json();
        this.recipeData = await recipeResponse.json();
        this.classJobCategories = await classJobCategoriesResponse.json();
      } catch (error) {
        console.error('JSON読み込みエラー:', error);
      } finally {
        this.jsonLoading = true;
      }
    },
    SearchItems(id, typeId, data, text, level, job) {
      if (id === 'Category') {
        this.FilterSearch(typeId, data, text, level, job)
      } else {
        this.ItemSearch(data)
      }
    },
    async getImagePath(variable) {
      // 画像のパスを動的に読み込む
      const imageModule = await import(`@/assets/img/${variable}.png`);
      this.imageSrc = imageModule.default;
    },
    isCraftable(itemKey) {
      return this.recipeData.some(recipe => recipe.ItemResult === itemKey);
    },
    ItemSearch(searchQuery) {
      this.selectedInfo = [],
        this.searchinfo.id = undefined;
      this.searchinfo.text = '検索';
      this.scrollToTop();
      try {
        this.searchResults = this.itemsData.filter(item =>
          item.Name.includes(searchQuery)
        ).map(item => ({
          ...item,
          isCraftable: this.isCraftable(item.ItemId)
        }))
      } catch (error) {
        console.error('検索エラー:', error);
      }
    },
    FilterSearch(typeId, data, text, level, job) {
      this.selectedInfo = [],
        this.searchinfo.id = data;
      this.searchinfo.text = text;
      this.getImagePath(data);
      let selectedJobId; // selectedJobId を定義する
      this.scrollToTop();
      try {
        if (job !== undefined) {
          selectedJobId = this.findClassJobId(job); // selectedJobId を設定する
        }
        this.searchResults = this.itemsData.filter(item => {
          if (typeId === 1) {
            return parseInt(item.ItemSearchCategory) === data &&
              parseInt(item.LevelEquip) <= level;
          } else if (typeId === 2) {
            return parseInt(item.ItemSearchCategory) === data &&
              parseInt(item.LevelEquip) <= level &&
              selectedJobId.includes(item.ClassJobCategory);
          } else {
            return parseInt(item.ItemSearchCategory) === data;
          }
        }).map(item => ({
          ...item,
          isCraftable: this.isCraftable(item.ItemId)
        }));
      } catch (error) {
        console.error('検索エラー:', error);
      }
    },
    findClassJobId(selectedJob) {
      const matchingIds = [];
      for (const category of this.classJobCategories) {
        if (category[selectedJob] === "TRUE") {
          matchingIds.push(category.ID);
        }
      }
      return matchingIds;
    },
    selectItem(item) {
      this.selectedInfo = item;
      this.$refs.infoComponent.someFunction(this.selectedInfo);
      if (item.isCraftable === false) {
        this.infoLoading = false;
        this.normaldata(item).then(() => {
          this.$refs.infoComponent.skip(2);
          this.infoLoading = true;
        });
      } else {
        if (this.infoLoading === false) {
          alert("別の詳細検索がすでに実行中です。");
        } else {
          this.getMaterialDetails(item);
        }
      }
    },
    async normaldata(item) {
      try {
        const salesHistory = await this.salesHistory(item.ItemId)
        const currentHistory = await this.currentHistory(item.ItemId)
        this.materialsJson = {
          salesHistory,
          currentHistory
        };
      } catch (error) {
        console.error('salesHistory取得エラー:', error);
        return null;
      }
    },
    async getLowestPrice(itemId) {
      const server = localStorage.getItem('searchvalue')
      const response = await fetch(`https://universalis.app/api/v2/${server}/${itemId}?fields=minPrice%2CminPriceHQ`);
      const data = await response.json();
      if (data.minPriceHQ === 0) {
        return data.minPrice;
      } else {
        return data.minPriceHQ;
      }
    },
    async salesHistory(itemId) {
      try {
        const server = localStorage.getItem('searchvalue')
        const response = await fetch(`https://universalis.app/api/v2/history/${server}/${itemId}?entriesToReturn=100`);
        if (!response.ok) {
          throw new Error('サーバーからの応答がありません');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('salesHistory取得エラー:', error);
        return null;
      }
    },
    async currentHistory(itemId) {
      try {
        const server = localStorage.getItem('searchvalue')
        const response = await fetch(`https://universalis.app/api/v2/${server}/${itemId}`);
        if (!response.ok) {
          throw new Error('サーバーからの応答がありません');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('currentHistory取得エラー:', error);
        return null;
      }
    },
    async getMaterialDetails(item) {
      const startTime = Date.now();
      this.infoLoading = false;
      this.$refs.infoComponent.skip(1);
      this.infoProgress = `必要素材を確認中...`;
      const retrieveMaterials = async (itemId, recipeData, itemsData, check) => {
        const recipe = recipeData.find(recipe => recipe.ItemResult === itemId);
        if (!recipe) return { materials: [], totalPrice: 0 };
        const materials = [];
        let totalPrice = 0;
        const promises = [];
        for (let i = 0; i <= 9; i++) {
          const ingredientItemId = recipe[`ItemIngredient[${i}]`];
          const ingredientQuantity = recipe[`AmountIngredient[${i}]`];
          if (ingredientItemId && ingredientQuantity > 0) {
            const subrecipe = recipeData.find(recipe => recipe.ItemResult === ingredientItemId);
            const amountResult = subrecipe ? subrecipe.AmountResult : 0;
            const materialItem = itemsData.find(item => item.ItemId === ingredientItemId);
            if (materialItem) {
              if (check !== "sub") {
                this.infoProgress = `${materialItem.Name}の情報を問い合わせ中...`;
              }
              const subMaterialsData = await retrieveMaterials(ingredientItemId, recipeData, itemsData, "sub");
              promises.push(this.getLowestPrice(ingredientItemId));
              materials.push({
                itemId: ingredientItemId,
                itemName: materialItem.Name,
                Icon: materialItem.Icon,
                quantity: ingredientQuantity,
                isCraftable: this.isCraftable(ingredientItemId),
                subMaterials: subMaterialsData.materials,
                amountResult
              });
            }
          }
        }
        const lowestPrices = await Promise.all(promises);
        materials.forEach((material, index) => {
          material.lowestPrice = lowestPrices[index];
        });

        const calculateSubMaterialsPrice = (subMaterials) => {
          return subMaterials.reduce((total, subMaterial) => {
            const subMaterialPrice = subMaterial.quantity * subMaterial.lowestPrice;
            const subSubMaterialsPrice = subMaterial.subMaterials ? calculateSubMaterialsPrice(subMaterial.subMaterials) : 0;
            return total + subMaterialPrice + subSubMaterialsPrice;
          }, 0);
        };

        materials.forEach(material => {
          material.subTotalPrice = Math.round(calculateSubMaterialsPrice(material.subMaterials) / material.amountResult);
          material.subTotalPrice = isNaN(material.subTotalPrice) ? 0 : material.subTotalPrice;
          totalPrice += Math.min(material.lowestPrice) * material.quantity;
        });

        return { materials, totalPrice };
      };
      const { materials, totalPrice } = await retrieveMaterials(item.ItemId, this.recipeData, this.itemsData);

      const amoutrecipe = this.recipeData.find(recipe => recipe.ItemResult === item.ItemId);
      const amountResult = amoutrecipe ? amoutrecipe.AmountResult : 0;

      const [salesHistory, currentHistory] = await Promise.all([
        this.salesHistory(item.ItemId),
        this.currentHistory(item.ItemId),
      ]);

      this.materialsJson = {
        materials,
        totalPrice,
        price: currentHistory.minPrice,
        amountResult,
        salesHistory,
        currentHistory
      };
      this.infoProgress = "最終処理中...";
      console.log(this.materialsJson);
      this.infoLoading = true;

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      console.log(`処理が完了するまでの時間：${elapsedTime}ミリ秒`);
    }
  }
}
</script>

<style scoped>
.contents {
  width: 100%;
  height: 100%;
  display: flex;
  border-image-source: url(./assets/img/bordergate.png);
  border-image-slice: 100 fill;
  border-image-width: 100px;
  border-image-outset: 0px;
  border-image-repeat: round;
}

.loading-full {
  min-width: 100%;
  min-height: 100%;
  border-image-source: url(./assets/img/bordergate.png);
  border-image-slice: 100 fill;
  border-image-width: 100px;
  border-image-outset: 0px;
  border-image-repeat: round;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.sidebar {
  width: 300px;
  transition: width 0.3s ease;
}

.close {
  width: 0;
  overflow: hidden;
  border: none;
  transition: width 0.3s ease;
}

.search-box {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 5px 0 10px 12.5px;
  margin-right: 12.5px;
}

.toggle-search-box {
  margin-left: 15px;
  color: white;
}

.modal-body {
  height: 70vh;
}

.result-box {
  flex: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.result-margin {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  margin: 10px 10px 10px 10px;
}

.result-header {
  width: 100%;
  height: 30px;
  margin-top: 5px;
  background: repeat url("./assets/img/header.png");
  display: flex;
}

.result-header-close {
  margin-left: 13px;
}

.result-img img {
  width: 20px;
  height: 20px;
  margin: auto 10px auto 10px;
}

.result-text {
  margin: auto 0 auto 0;
  font-size: 15px;
  color: #CFB47A;
}

.freesearch-text {
  margin-left: 40px;
}

.result-items {
  width: 100%;
  height: calc(100% - 31px);
  margin-bottom: 8px;
  border-left: 2px solid #555455;
}

.result-items-close {
  padding-left: 10px;
  border-left: none;
}

.result-itemlist {
  height: 100%;
  overflow-y: scroll;
  margin-top: 10px;
  margin-bottom: 10px;
}

.result-item {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
}

.last-item {
  margin-bottom: 0;
}

.item-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  background-color: black;
  border-radius: 5px;
}

.result-name {
  margin: 0;
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: white;
  cursor: pointer;
}

.item-craftable {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.loadstone img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  overflow: visible;
}

.info-box {
  flex: 3;
}

.info-header {
  width: calc(100% - 6.5px);
  height: 30px;
  margin-top: 5px;
  background: repeat url("./assets/img/header.png");
  display: flex;
}

.info-text {
  margin: auto 0 auto 0;
  font-size: 15px;
  color: #CFB47A;
  margin-left: 30px;
}
</style>
