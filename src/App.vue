<template>
  <div class="contents">
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
          <div class="result-itemlist scroll_bar">
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

export default {
  data() {
    return {
      isLoading: true,
      infoLoading: false,
      isSelectBoxOpen: false,
      selectedServer: '',
      selectedInfo: [],
      searchResults: [],
      searchQuery: '',
      searchinfo: [],
      imageSrc: '',
      materialsJson: ''
    }
  },
  components: {
    Search,
    Info
  },
  created() {
    this.loadJsonData();
  },
  methods: {
    async loadJsonData() {
      try {
        this.isLoading = true;
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
        this.isLoading = false;
      }
    },
    SearchItems(id, typeId, data, level, job) {
      if (id === 'Category') {
        this.FilterSearch(typeId, data, level, job)
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

      try {
        if (job !== undefined) {
          selectedJobId = this.findClassJobId(job); // selectedJobId を設定する
        }
        this.searchResults = this.itemsData.filter(item => {
          if (typeId === 1 || typeId === 2) {
            return parseInt(item.ItemSearchCategory) === data &&
              ((parseInt(item.LevelEquip) <= level) ||
                (parseInt(item.LevelEquip) <= level && selectedJobId.includes(String(item.ClassJobCategory)))
              );
          } else {
            return parseInt(item.ItemSearchCategory) === data;
          }
        }).map(item => ({
          ...item,
          isCraftable: this.isCraftable(item.ItemId)
        }));
        console.log(this.searchResults)
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
      this.getMaterialDetails(item);
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
    async getMaterialDetails(item) {
      const retrieveMaterials = async (itemId, quantity) => {
        const recipe = this.recipeData.find(recipe => recipe.ItemResult === itemId);
        if (recipe) {
          const materials = [];
          for (let i = 0; i <= 9; i++) {
            const ingredientItemId = recipe[`ItemIngredient[${i}]`];
            const ingredientQuantity = recipe[`AmountIngredient[${i}]`];
            if (ingredientItemId && ingredientQuantity > 0) {
              const materialItem = this.itemsData.find(item => item.ItemId === ingredientItemId);
              if (materialItem) {
                const subMaterials = await retrieveMaterials(ingredientItemId, ingredientQuantity);
                materials.push({
                  itemId: ingredientItemId,
                  itemName: materialItem.Name,
                  Icon: materialItem.Icon,
                  quantity: ingredientQuantity,
                  price: await this.getLowestPrice(ingredientItemId),
                  isCraftable: this.isCraftable(ingredientItemId),
                  subMaterials: subMaterials
                });
              }
            }
          }
          return materials;
        } else {
          return [];
        }
      };

      this.materialsJson = await retrieveMaterials(item.ItemId, 1);
      console.log(this.materialsJson)
      this.infoLoading = true;
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
