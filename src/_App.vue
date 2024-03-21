<template>
  <div class="contents">
    <div v-if="!jsonLoading" class="loading-full">
      <Loading />
    </div>
    <div class="search-box">
      <Search @send-data="SearchItems" />
    </div>
    <div class="result-box">
      <div class="result-header">
        <div class="result-img">
          <img v-if="searchinfo.id !== undefined" :src="imageSrc">
        </div>
        <div :class="{ 'result-text': true, 'freesearch-text': searchinfo.id === undefined }">{{ this.searchinfo.text }}
        </div>
      </div>
      <div class="result-items scroll_bar">
        <div class="result-margin">
          <div ref="scrollableElement" class="result-itemlist scroll_bar">
            <div class="result-item" v-for="(item, index) in searchResults" :key="item" @click="selectItem(item)"
              :class="{ 'last-item': index === searchResults.length - 1 }">
              <div class="item-icon">
                <img :src="`/icons/normal/${item.Icon}.png`" alt="Icon">
              </div>
              <div class="result-name">{{ item.Name }}</div>
              <div class="loadstone">
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
      <Info ref="infoComponent" :materialsJson="materialsJson" :infoLoading="infoLoading" />
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
      isSelectBoxOpen: false,
      selectedServer: '',
      selectedInfo: [],
      searchResults: [],
      searchQuery: '',
      searchinfo: [],
      imageSrc: '',
      materialsJson: [],
      Result: ''
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
          console.log(selectedJobId)
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
        this.getMaterialDetails(item);
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
      const response = await fetch(`https://universalis.app/api/${server}/${itemId}`);
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
        const response = await fetch(`https://universalis.app/api/v2/history/${server}/${itemId}`);
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
      this.infoLoading = false;
      this.$refs.infoComponent.skip(1);

      // サブレシピを展開して素材情報を取得
      const retrieveMaterials = async (itemId, quantity) => {
        const recipe = this.recipeData.find(recipe => recipe.ItemResult === itemId);
        if (recipe) {
          const materials = [];
          let totalPrice = 0; // 合計価格を計算するための変数を追加
          for (let i = 0; i <= 9; i++) {
            const ingredientItemId = recipe[`ItemIngredient[${i}]`];
            const ingredientQuantity = recipe[`AmountIngredient[${i}]`];
            if (ingredientItemId && ingredientQuantity > 0) {
              const subrecipe = this.recipeData.find(recipe => recipe.ItemResult === ingredientItemId);
              const amountResult = subrecipe ? subrecipe.AmountResult : 0; // AmountResult をサブレシピから取得
              const materialItem = this.itemsData.find(item => item.ItemId === ingredientItemId);
              if (materialItem) {
                const subMaterialsData = await retrieveMaterials(ingredientItemId, ingredientQuantity);
                // サブレシピの合計価格を修正
                subMaterialsData.totalPrice = subMaterialsData.materials.reduce((sum, material) => sum + material.price * material.quantity, 0);
                const materialPrice = await this.getLowestPrice(ingredientItemId);
                totalPrice += ingredientQuantity * materialPrice;
                materials.push({
                  itemId: ingredientItemId,
                  itemName: materialItem.Name,
                  Icon: materialItem.Icon,
                  price: materialPrice, // 素材の価格を保持
                  totalPrice: subMaterialsData.totalPrice, // サブレシピの合計価格を保持
                  quantity: ingredientQuantity,
                  isCraftable: this.isCraftable(ingredientItemId),
                  subMaterials: subMaterialsData.materials, // subMaterials を直接受け取る
                  amountResult: amountResult
                });
              }
            }
          }
          return { materials, totalPrice }; // 素材と合計価格を返す
        } else {
          return { materials: [], totalPrice: 0 }; // レシピが見つからない場合は空の素材リストと価格 0 を返す
        }
      };

      // 素材情報の取得
      const { materials, totalPrice } = await retrieveMaterials(item.ItemId, 1);

      // レシピ情報からAmountResultを取得
      const amoutrecipe = this.recipeData.find(recipe => recipe.ItemResult === item.ItemId);
      const amountResult = amoutrecipe ? amoutrecipe.AmountResult : 0;

      // 販売履歴と現在の履歴を取得
      const salesHistory = await this.salesHistory(item.ItemId);
      const currentHistory = await this.currentHistory(item.ItemId);

      // 素材情報の取得
      const materialPricePromises = materials.map(material => this.getLowestPrice(material.itemId));
      const materialPrices = await Promise.all(materialPricePromises);

      // 素材情報に価格を追加
      materials.forEach((material, index) => {
        material.price = materialPrices[index];
      });

      // 合計価格を更新
      this.materialsJson = {
        materials,
        totalPrice: materials.reduce((sum, material) => sum + material.price * material.quantity, 0), // 合計価格を更新
        price: 0, // 仮の価格
        amountResult,
        salesHistory,
        currentHistory
      };

      console.log(this.materialsJson);

      setTimeout(() => {
        this.infoLoading = true;
      }, 2000);
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

.search-box {
  width: 300px;
  padding: 5px 0 10px 12.5px;
  margin-right: 12.5px;
}

.search-border {
  border-right: 2px solid #555455;
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
  height: 31px;
  margin-top: 5px;
  background: repeat url("./assets/img/header.png");
  display: flex;
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
  height: 31px;
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
