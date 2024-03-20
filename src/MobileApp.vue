<template>
    <div class="title">
        <img src="./assets/img/title.png">
    </div>
    <div class="container">
        <div class="block block-1">
            <select id="servers" class="select-box select-box-mobile" @focus="isSelectBoxOpen = true"
                @blur="isSelectBoxOpen = false" ref="servers" @change="onServerSelect" v-model="selectedServer">
                <option disabled="" value="">- Please Choose a Server -</option>
                <optgroup v-for="(group, label) in servers" :label="label">
                    <option v-for="server in group" :value="server">{{ server }}</option>
                </optgroup>
            </select>
            <input class="search-input search-input-mobile" placeholder="アイテム名" type="text" v-model="searchQuery"
                @keyup.enter="ItemSearch" />
        </div>
        <div class="block block-2" :class="{ expanded: expandedBlock === 1 }">
            <p class="block-nav" @click="toggleBlock(1)">リスト</p>
            <div class="content" v-if="expandedBlock === 1">
                <div class="result-box result-box-mobile">
                    <div v-for="item in searchResults" :key="item" @click="selectItem(item)">
                        <img :src="item.iconUrl" alt="アイコン" class="item-icon" loading="lazy">
                        <div class="item-info">
                            <div class="item-name item-name-mobile">{{ item.Name }}</div>
                            <div v-if="item.isCraftable" class="item-craftable"><img class="craft"
                                    src="https://xivapi.com/cj/1/blacksmith.png"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="block block-3" :class="{ expanded: expandedBlock === 2 }">
            <p class="block-nav">詳細</p>
            <div class="content" v-if="expandedBlock === 2">
                <div class="craft-box craft-box-mobile">
                    <div v-if="isLoading || (selectedInfo === null)" class="info-loading-indicator">
                        <loding></loding>
                    </div>
                    <div v-if="selectedInfo && selectedInfo.isCraftable" class="d-flex flex-column px-3 px-3-mobile">
                        <p class="info-memo">必要素材</p>
                        <p class="info-memo">(素材を作成したほうが安い場合赤文字で表示されます。)</p>
                        <div v-for="material in selectedInfo.materials" :key="material.name" class="material-mobile">
                            <div class="material-row material-row-mobile">
                                <button class="material-button" v-if="material.hasSubMaterials"
                                    @click="material.expanded = !material.expanded">
                                    {{ material.expanded ? '▼' : '▶' }}
                                </button>
                                <div v-else class="button-placeholder"></div>
                                <img v-if="material.iconUrl" :src="material.iconUrl" alt="アイコン"
                                    class="material-icon material-icon-mobile">
                                <span class="material-name">{{ material.name }}</span>
                                <span class="material-quantity">{{ material.quantity }}個</span>
                                <span
                                    v-if="material.subMaterials && material.subMaterials.length > 0 && material.isCheaper"
                                    class="material-price cheaper-price">
                                    {{ material.subMaterialsTotalCost.toLocaleString() }} 
                                </span>
                                <span v-else class="material-price">
                                    {{ material.price.toLocaleString() }} 
                                </span>
                            </div>
                            <div v-if="material.expanded" class="sub-materials">
                                <div v-for="subMaterial in material.subMaterials" :key="subMaterial.name"
                                    class="sub-material-row">
                                    <img v-if="subMaterial.iconUrl" :src="subMaterial.iconUrl" alt="アイコン"
                                        class="material-icon material-icon-mobile">
                                    <span class="material-name">{{ subMaterial.name }}</span>
                                    <span class="material-quantity">{{ subMaterial.quantity }}個</span>
                                    <span class="material-price">{{ subMaterial.price.toLocaleString() }} </span>
                                </div>
                            </div>
                        </div>
                        <div class="material-row material-row-mobile price-info border-top">
                            <div class="button-placeholder"></div> <!-- 位置合わせ用のプレースホルダー -->
                            <span class="material-name">総合計価格</span>
                            <span class="material-price">{{ selectedInfo.totalCost.toLocaleString() }} </span>
                        </div>
                        <div class="material-row material-row-mobile price-info">
                            <div class="button-placeholder"></div> <!-- 位置合わせ用のプレースホルダー -->
                            <span class="material-name">マーケット価格</span>
                            <span class="material-price">{{ selectedInfo.finalProductPrice.toLocaleString() }} </span>
                        </div>
                        <div class="material-row material-row-mobile price-info">
                            <div class="button-placeholder"></div>
                            <span class="material-name">利益率</span>
                            <span class="material-price">{{ ((selectedInfo.finalProductPrice -
                    selectedInfo.totalCost) /
                    selectedInfo.totalCost * 100).toFixed(2) }}%</span>
                        </div>
                    </div>
                    <div class="px-4-mobile xivfont">
                        <div v-if="selectedInfo && selectedInfo.sales" class="history-section">
                            <h5>販売履歴</h5>
                            <div class="history-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="_sticky">#</th>
                                            <th class="_sticky">HQ</th>
                                            <th class="_sticky">単価</th>
                                            <th class="_sticky">販売日</th>
                                            <th class="_sticky">購入者</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(sale, index) in selectedInfo.sales.entries" :key="sale.timestamp">
                                            <td>{{ index + 1 }}</td>
                                            <td v-if="sale.hq"></td>
                                            <td v-else></td>
                                            <td>{{ sale.pricePerUnit.toLocaleString() }}</td>
                                            <td>{{ new Date(sale.timestamp * 1000).toLocaleDateString() }}
                                            </td>
                                            <td>{{ sale.buyerName }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-if="selectedInfo && selectedInfo.current" class="history-section">
                            <h5>現在の市場価格</h5>
                            <div class="history-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="_sticky">#</th>
                                            <th class="_sticky">HQ</th>
                                            <th class="_sticky">単価</th>
                                            <th class="_sticky">最終確認日</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(listing, index) in selectedInfo.current.listings"
                                            :key="listing.listingID">
                                            <td>{{ index + 1 }}</td>
                                            <td v-if="listing.hq"></td>
                                            <td v-else></td>
                                            <td>{{ listing.pricePerUnit.toLocaleString() }} </td>
                                            <td>{{ new Date(listing.lastReviewTime *
                    1000).toLocaleDateString() }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="copyright">
        <p>FINAL FANTASY XIV</p>
        <p> (C) SQUARE ENIX CO., LTD. All Rights Reserved.</p>
    </div>
</template>

<script>
import Loding from './components/Loading.vue';
export default {
    components: {
        Loding,
    },
    data() {
        return {
            isLoading: false,
            expandedBlock: null,
            searchResults: [],
            searchQuery: '',
            selectedInfo: null,
            servers: {
                'Chaos - Europe': ['Cerberus', 'Louisoix', 'Moogle', 'Omega', 'Phantom', 'Ragnarok', 'Sagittarius', 'Spriggan'],
                'Light - Europe': ['Alpha', 'Lich', 'Odin', 'Phoenix', 'Raiden', 'Shiva', 'Twintania', 'Zodiark'],
                'Elemental - Japan': ['Aegis', 'Atomos', 'Carbuncle', 'Garuda', 'Gungnir', 'Kujata', 'Tonberry', 'Typhon'],
                'Gaia - Japan': ['Alexander', 'Bahamut', 'Durandal', 'Fenrir', 'Ifrit', 'Ridill', 'Tiamat', 'Ultima'],
                'Mana - Japan': ['Anima', 'Asura', 'Chocobo', 'Hades', 'Ixion', 'Masamune', 'Pandaemonium', 'Titan'],
                'Meteor - Japan': ['Belias', 'Mandragora', 'Ramuh', 'Shinryu', 'Unicorn', 'Valefor', 'Yojimbo', 'Zeromus'],
                'Aether - America': ['Adamantoise', 'Cactuar', 'Faerie', 'Gilgamesh', 'Jenova', 'Midgardsormr', 'Sargatanas', 'Siren'],
                'Primal - America': ['Behemoth', 'Excalibur', 'Exodus', 'Famfrit', 'Hyperion', 'Lamia', 'Leviathan', 'Ultros'],
                'Crystal - America': ['Balmung', 'Brynhildr', 'Coeurl', 'Diabolos', 'Goblin', 'Malboro', 'Mateus', 'Zalera'],
                'Dynamis - America': ['Halicarnassus', 'Maduin', 'Marilith', 'Seraph'],
                'Materia - Oceania': ['Bismarck', 'Ravana', 'Sephirot', 'Sophia', 'Zurvan'],
                '陆行鸟 - 中国': ['宇宙和音', '幻影群岛', '神意之地', '萌芽池', '沃仙曦染', '拉诺西亚', '晨曦王座', '红玉海'],
                '莫古力 - 中国': ['神拳痕', '潮风亭', '白金幻象', '白银乡', '旅人栈桥', '梦羽宝境', '拂晓之间', '龙巢神殿'],
                '猫小胖 - 中国': ['延夏', '海猫茶屋', '紫水栈桥', '柔风海湾', '静语庄园', '摩杜纳', '琥珀原', ''],
                '豆豆柴 - 中国': ['伊修加德', '黄金谷', '月牙湾', '水晶塔', '雪松原', '太阳海岸', '红茶川', '银泪湖'],
                '한국 - 한국': ['모그리', '초코보', '카벙클', '톤베리', '펜리르']
            }
        };
    },
    created() {
        this.loadJsonData(); // コンポーネント作成時にJSONデータを読み込む
        const savedServer = localStorage.getItem('selectedServer');
        if (savedServer) {
            this.selectedServer = savedServer;
        } else {
            this.selectedServer = 'Chocobo'; // 'selectedServer'がない場合、'chocobo'に設定
            localStorage.setItem('selectedServer', 'chocobo'); // 'chocobo'をローカルストレージに保存
        }
    },
    methods: {
        toggleBlock(index) {
            if (this.expandedBlock === index) {
                this.expandedBlock = null;
            } else if (index !== 0) { // ブロック1以外のクリックのみ展開
                this.expandedBlock = index;
            }
            console.log(this.expandedBlock)
        },
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
        ItemSearch() {
            try {
                // 検索処理を行い、結果をsearchResultsに格納する
                this.searchResults = this.itemsData.filter(item =>
                    item.Name.includes(this.searchQuery)
                ).map(item => ({
                    ...item,
                    iconUrl: this.getIconUrl(item.Icon),
                    isCraftable: this.isCraftable(item.ItemId),
                }));

                // 検索結果があればブロック2を展開する
                if (this.searchResults.length > 0) {
                    this.expandedBlock = 1;
                } else {
                    // 検索結果がない場合はブロック2を閉じる
                    this.expandedBlock = null;
                }

                // キーボードを閉じる
                document.activeElement.blur();
            } catch (error) {
                console.error('検索エラー:', error);
            }
        },
        getIconUrl(imageId) {
            const baseId = Math.floor(imageId / 1000) * 1000; // 1万の位を基にベースIDを算出
            const formattedImageId = imageId.toString().padStart(6, '0'); // 画像IDを6桁でフォーマット
            return `https://xivapi.com/i/0${baseId}/${formattedImageId}.png`; // 完全なURLを生成
        },
        isCraftable(itemKey) {
            return this.recipeData.some(recipe => recipe.ItemResult === itemKey);
        },
        onServerSelect() {
            this.selectedServer = this.$refs.servers.value;
            // 選択されたサーバーをローカルストレージに保存
            localStorage.setItem('selectedServer', this.selectedServer);
        },
        async getLowestPrice(itemId) {
            // Universalis APIを使用してアイテムの価格を取得
            const response = await fetch(`https://universalis.app/api/${this.selectedServer}/${itemId}`);
            const data = await response.json();
            if (data.minPriceHQ === 0) {
                return data.minPrice;
            } else {
                return data.minPriceHQ;
            }
        },
        async salesHistory(itemId) {
            try {
                const response = await fetch(`https://universalis.app/api/v2/history/${this.selectedServer}/${itemId}`);
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
                const response = await fetch(`https://universalis.app/api/v2/${this.selectedServer}/${itemId}`);
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
        async selectItem(item) {
            this.expandedBlock = 2;
            try {
                this.isLoading = true;
                this.selectedInfo = undefined;
                const selectedItem = { ...item, materials: [] }; // 空の配列で materials を初期化
                if (item.isCraftable) {
                    const recipe = this.recipeData.find(recipe => recipe.ItemResult === item.ItemId);
                    if (recipe) {
                        let totalCost = 0;
                        const materialsPromises = [];

                        for (let i = 0; i <= 9; i++) {
                            const ingredientItemId = recipe[`ItemIngredient[${i}]`];
                            const quantity = recipe[`AmountIngredient[${i}]`];
                            if (ingredientItemId && quantity > 0) {
                                materialsPromises.push(this.getMaterialDetails(ingredientItemId, quantity));
                            }
                        }

                        const materials = await Promise.all(materialsPromises);
                        materials.forEach(material => {
                            if (material) {
                                selectedItem.materials.push(material); // ここで push する
                                totalCost += material.price * material.quantity;
                            }
                        });

                        selectedItem.totalCost = totalCost;
                        selectedItem.finalProductPrice = await this.getLowestPrice(item.ItemId);
                        selectedItem.sales = await this.salesHistory(item.ItemId);
                        selectedItem.current = await this.currentHistory(item.ItemId);
                    }
                } else {
                    selectedItem.sales = await this.salesHistory(item.ItemId);
                    selectedItem.current = await this.currentHistory(item.ItemId);
                }
                this.selectedInfo = selectedItem;
                console.log(this.selectedInfo)
            } catch (error) {
                console.error('アイテム選択エラー:', error);
            }
            finally {
                this.isLoading = false; // ローディング終了
            }
        },
        async getMaterialDetails(ingredientItemId, quantity) {
            const price = await this.getLowestPrice(ingredientItemId);
            const materialItem = this.itemsData.find(i => i.ItemId === ingredientItemId);
            const subMaterials = await this.getSubMaterials(ingredientItemId);
            const subMaterialsTotalCost = subMaterials.reduce(
                (total, subMaterial) => total + (subMaterial.price * subMaterial.quantity),
                0
            );

            return {
                name: materialItem ? materialItem.Name : '不明な素材',
                quantity: quantity,
                iconUrl: materialItem ? this.getIconUrl(materialItem.Icon) : null,
                price: price,
                isCheaper: subMaterialsTotalCost < price,
                subMaterialsTotalCost: subMaterialsTotalCost,
                expanded: false,
                hasSubMaterials: subMaterials.length > 0, // subMaterialsが存在する場合はtrue, そうでなければfalse
                subMaterials: subMaterials
            };
        },
        async getSubMaterials(itemId) {
            const recipe = this.recipeData.find(recipe => recipe.ItemResult === itemId);
            if (!recipe) return [];

            const subMaterialsPromises = [];
            for (let i = 0; i <= 9; i++) {
                const ingredientItemId = recipe[`ItemIngredient[${i}]`];
                const quantity = recipe[`AmountIngredient[${i}]`];
                if (ingredientItemId && quantity > 0) {
                    subMaterialsPromises.push(this.getMaterialDetails(ingredientItemId, quantity));
                }
            }

            return await Promise.all(subMaterialsPromises);
        },
        copyText() {
            // selectedInfo.Nameのテキストをコピー
            navigator.clipboard.writeText(this.selectedInfo.Name).then(() => {
            })
                .catch(err => {
                    console.error('コピーに失敗しました:', err);
                });
        }
    },
};
</script>

<style scoped>
body {
    font-family: 'NotoSansJP', sans-serif;
    width: 100vw;
    height: 100vh;
    overflow-y: hidden;
    background-color: #313031;
}

#app {
    width: 100vw !important;
    height: 100vh !important;
    background-color: #313131;
    margin: 0;
}

@font-face {
    font-family: 'NotoSansJP';
    src: url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap') format('truetype');
}

.xivfont {
    font-family: 'Xivfont', sans-serif;
}

button {
    cursor: pointer;
}

.loading-indicator {
    position: fixed;
    /* 画面に固定 */
    top: 0;
    left: 0;
    width: 100vw;
    /* ビューポートの全幅 */
    height: 100vh;
    /* ビューポートの全高 */
    background-color: #313031;
    /* 半透明の背景 */
    display: flex;
    justify-content: center;
    /* 中央揃え */
    align-items: center;
    /* 中央揃え */
    z-index: 1000;
    /* 他の要素より上に表示 */
}

.info-loading-indicator {
    top: 0;
    left: 0;
    width: 100%;
    /* infoセクションの幅に合わせる */
    height: 100%;
    /* infoセクションの高さに合わせる */
    padding: 0;
    background-color: rgba(45, 48, 45, 1);
    /* 半透明の背景色 */
    display: flex;
    justify-content: center;
    /* 中央揃え */
    align-items: center;
    /* 中央揃え */
    z-index: 10;
    /* 必要に応じてz-indexを調整 */
}

.wrapper {
    display: flex;
    width: 100%;
    height: 100%;
}

.search-box {
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    flex: 0 0 auto;
    position: relative;
    width: 280px;
    padding-left: 10px;
    padding-right: 10px;
    height: 100%;
    padding-top: 10px;
}

.serverselect {
    padding: 3px 10px 7px 10px;
    height: fit-content;
    border: 2px solid #515151;
    border-radius: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

.serverselect p {
    color: #7D7463;
    font-size: 15px;
    margin-bottom: 0;
    margin-left: 10px;
}

.select-box-container {
    display: flex;
    align-items: center;
}

.dropdown-icon {
    position: absolute;
    color: #fff;
    top: 48px;
    left: 30px;
    z-index: 100;
    font-size: 10px;
    /* セレクトボックスの上に表示 */
}

.select-box {
    flex-grow: 1;
    padding: 3px 0;
    padding-left: 30px;
    height: 25px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    color: #fff;
    background: linear-gradient(to bottom, #2F2F2F 0%, #272727 50%, #2F2F2F 100%);
    background-color: #2F2F2F;
    border: 1px solid #222222;
    border-radius: 9999px;
    font-size: 12px;
}

.freesearch {
    padding: 3px 10px 7px 10px;
    height: fit-content;
    border: 2px solid #515151;
    border-radius: 10px;
    padding-bottom: 10px;
}

.freesearch p {
    color: #7D7463;
    font-size: 15px;
    margin-bottom: 0;
    margin-left: 10px;
}

.search-input {
    flex-grow: 1;
    width: 100%;
    border-radius: 5px;
    height: 25px;
    font-size: 13px;
    background-color: #545454;
    border: solid 1px #454044;
    color: #fff;
}

.category-text {
    color: #7D7463;
    font-size: 15px;
    margin-bottom: 0;
    margin-left: 10px;
}

.AD {
    height: 330px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    /* 要素を垂直方向に配置 */
}

.btn-discord {
    width: 100%;
    height: 50px;
    background-color: #7289da !important;
    /* Discordの青色 */
    border-color: #7289da !important;
    /* 枠線の色 */
    color: white !important;
    /* テキストの色 */
    border-radius: 5px !important;
    /* 角の丸み */
    margin-bottom: 10px;
    padding: 10px 20px !important;
    /* 内側の余白 */
    font-size: 16px !important;
    /* テキストのフォントサイズ */
}

.btn-discord:hover {
    background-color: #677bc4 !important;
    /* マウスオーバー時の背景色 */
    border-color: #677bc4 !important;
    /* マウスオーバー時の枠線の色 */
}

.btn-x {
    width: 100%;
    height: 50px;
    background-color: #1DA1F2 !important;
    /* Twitter Xの青色 */
    border-color: #1DA1F2 !important;
    /* 枠線の色 */
    color: white !important;
    /* テキストの色 */
    border-radius: 5px !important;
    /* 角の丸み */
    margin-bottom: 10px;
    padding: 10px 20px !important;
    /* 内側の余白 */
    font-size: 16px !important;
    /* テキストのフォントサイズ */
}

.btn-x:hover {
    background-color: #0F7AE5 !important;
    /* マウスオーバー時の背景色 */
    border-color: #0F7AE5 !important;
    /* マウスオーバー時の枠線の色 */
}



.copyright {
    position: absolute;
    bottom: 0;
    margin-bottom: 10px;
    font-size: 10px;
    color: #FFF;
    width: 100%;
    text-align: center;
}

.copyright p {
    margin-bottom: 0;
    color: #fff;
}

.result-box {
    flex: 0 0 auto;
    height: 100%;
    width: calc(calc(100vw - 300px)* 0.35);
    font-size: 14px;
    overflow-y: auto;
    padding: 10px;
    border-left: solid #575757 2px;
    border-right: solid #575757 2px;
}

.result-box>div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.item-icon {
    width: 30px;
    /* アイコンのサイズを設定 */
    height: 30px;
    margin-right: 10px;
}

.item-icon-lg {
    width: 50px;
    /* アイコンのサイズを設定 */
    height: 50px;
    margin-right: 10px;
    margin-left: 10px;
}

.item-name,
.item-craftable {
    color: #FFF;
}

.item-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.item-craftable {
    color: #FFF;
    margin-left: auto;
    /* クラフト可能テキストを右に寄せる */
}

.craft {
    width: 20px;
    height: 20px;
}

.info-box {
    flex: 0 0 auto;
    height: 100%;
    width: calc(calc(100vw - 300px)* 0.65);
    font-size: 14px;
    overflow-y: auto;
    padding: 10px;
}

.info-text {
    display: flex;
    align-items: center;
    color: #fff;
    margin-bottom: 20px;
}

.info-item h3,
.info-item h6 {
    margin-bottom: 0px;
}

.copy-icon:hover {
    color: #eee;
    /* ホバー時の色 */
}

.info-contents {
    flex-grow: 1;
    width: 100%;
    height: fit-content;
    color: #fff;
}

.info-main {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.info-data {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.info-memo {
    font-size: 12px;
    color: yellow;
    vertical-align: bottom;
    margin-top: 6px;
    margin-bottom: 0;
}

.craft-box {
    overflow-y: scroll;
    height: calc(100% - 60px);
    margin: 10px;
}

.material-button {
    width: 30px;
    height: 30px;
    color: #fff;
    background: none;
    border: none;
}

.button-placeholder {
    width: 30px;
    /* ボタンと同じサイズ */
    height: 30px;
    /* ボタンと同じサイズ */
    display: inline-block;
    /* ブロックレベル要素として表示 */
}

.sub-material-row {
    margin-left: 50px;
}

li {
    margin-bottom: 5px;
}

ul {
    padding-left: 10px;
    list-style: none;
}

.material-row,
.sub-material-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.material-icon,
.sub-material-row .material-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}

.material-name,
.sub-material-row .material-name {
    flex-grow: 1;
    margin-right: 10px;
}

.material-quantity,
.sub-material-row .material-quantity {
    width: 50px;
    text-align: right;
    margin-right: 10px;
}

.material-price,
.sub-material-row .material-price {
    width: 80px;
    text-align: right;
}

.sub-material-row {
    margin-left: 70px;
    /* サブ素材のインデント */
}

.border-top {
    border-top: solid #fff 2px;
}


.history {
    width: 100%;
    height: 95%;
    padding: 0px 10px 0px 10px;
    display: flex;
    gap: 10px;
}

.history-section {
    flex: 0 0 50%;
    /* 各セクションを横幅の50%に設定 */
    color: #fff;
    margin-bottom: 10px;
    background-color: #313031;
}

.history-table {
    overflow-y: scroll;
    height: 100%;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
}

th,
td {
    vertical-align: middle;
    padding: 5px;
    border: 1px solid #fff;
    color: #fff;
    font-size: 14px;
    text-align: center;
    white-space: nowrap;
}

th {
    background: #795548;
    border-left: 1px solid #434857 !important;
    border-right: 1px solid #434857 !important;
}

td {
    background: #17191E;
    border: 1px solid #434857 !important;
}

._sticky {
    position: sticky;
    top: 0;
    left: 0;
    background: none;
    border-top: none;
    border-bottom: none;
    text-align: center;
}

._sticky:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #434857;
    z-index: -1;
}

/*===========
.scroll-box
===========*/

.scroll-box {
    height: 300px;
    overflow-y: auto;
    padding-right: 10px;
    -webkit-overflow-scrolling: touch;
}

/*===========
scrollbar
===========*/


/*スクロールバー全体の高さ*/

.scroll-box::-webkit-scrollbar {
    width: 4px;
}

/*スクロールバー全体の背景*/

.scroll-box::-webkit-scrollbar-track {
    background: #eee;
}

/*スクロールバーの動く部分*/

.scroll-box::-webkit-scrollbar-thumb {
    background: #aaa;
    border: none;
}

/*スクロールバーの動く部分のホバー（マウスオーバー）*/

.scroll-box::-webkit-scrollbar-thumb:hover {
    background: #999;
}

/* ホバー時の行の背景色 */

.cheaper-price {
    color: red;
}

/* 選択されているタブのスタイル */
.nav-tabs .nav-link.active {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
    height: 110%;
}

/* 選択されていないタブのスタイル */
.nav-tabs .nav-link {
    color: #495057;
    background-color: #868788;
    border: 1px solid transparent !important;
    border-top-left-radius: 0.25rem !important;
    border-top-right-radius: 0.25rem !important;
    height: 110%;
}

/* ホバー時のタブのスタイル */
.nav-tabs .nav-link:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
}

.tab-content {
    height: calc(100vh - 120px) !important;
}

.tab-menu {
    height: 100%;
}

.tab-pane {
    padding: 5px;
    height: 100%;
}

.container-fluid {
    --bs-gutter-x: 0 !important;
}

.tooltip.show {
    opacity: 1 !important;
}

.custom-tooltip {
    padding: 0 !important;
}

.custom-tooltip .tooltip-inner {
    background-color: white;
    font-family: 'NotoSansJP';
    margin: 0;
    padding: 2px;
    font-size: 11.5px;
    min-width: 30px;
    color: black;
}

.tooltip-arrow,
.tooltip-arrow::before {
    border-top-color: white !important;
    border-bottom-color: white !important;
}

@font-face {
    font-family: 'NotoSansJP';
    src: url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&display=swap') format('truetype');
}

.searchpanel {
    height: 100%;
}

.category {
    border: 2px solid #515151;
    border-radius: 10px;
    padding: 3px 10px 10px 10px;
    margin: 0 auto 5px auto;
}

.category p {
    font-size: 12px;
    color: #9A9A9A;
    margin-bottom: 5px !important;
}

.button-grid {
    display: grid;
    grid-template-columns: repeat(10, 20px);
    gap: 4px;
}

.button-icon {
    width: 20px;
    height: 20px;
}

.button-grid button {
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
}

.level-selector-container {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.level-selector {
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 2px 6px;
}

.leveltext {
    color: #6A6A6A;
}

.level-input {
    margin: 0 0 0 10px;
    /* ボタンとの余白 */
    width: 35px;
    height: 25px;
    color: #fff;
    background-color: #545454;
    border: solid 1px #454044;
    border-radius: 5px;
    text-align: center;
}

.level-up,
.level-down {
    display: flex;
    justify-content: center;
    /* 水平方向の中央揃え */
    align-items: center;
    /* 垂直方向の中央揃え */
    background-color: #202020;
    color: black;
    border: solid 1px #151515;
    border-radius: 5px;
    cursor: pointer;
    font-size: 23px;
    width: 25px;
    height: 25px;
}

.triangle-icon {
    width: 0;
    height: 0;
    margin: 0 10px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 10px solid #FFFDC6;
    position: relative;
}

.select-box-container {
    display: flex;
    align-items: center;
}

.select-icon {
    margin-right: 10px;
    /* アイコンとセレクトボックスの間隔 */
}

.dropdown-icon-bougu {
    position: absolute;
    color: #fff;
    top: 446px;
    left: 30px;
    z-index: 100;
    font-size: 10px;
    /* セレクトボックスの上に表示 */
}

.select-box {
    flex-grow: 1;
    margin-top: 5px;
    padding: 3px 0;
    padding-left: 30px;
    width: 246px;
    height: 25px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    color: #fff;
    background: linear-gradient(to bottom, #2F2F2F 0%, #272727 50%, #2F2F2F 100%);
    background-color: #2F2F2F;
    border: 1px solid #222222;
    border-radius: 9999px;
    font-size: 12px;
}

.select-box:focus {
    outline: none;
}

::-webkit-scrollbar {
    width: 7px;
}

::-webkit-scrollbar-thumb {
    background: #7A7A7A;
    border-radius: 3px;
}

@font-face {
    font-family: 'XivFont';
    src: url('fonts/xivfont.ttf') format('truetype');
}

@font-face {
    font-family: 'NotoSansJP';
    src: url('fonts/NotoSansJP-VariableFont_wght.ttf') format('truetype');
}

body {
    color: white;
}

.xivfont {
    font-family: 'Xivfont', sans-serif;
}

.container {
    display: flex;
    height: calc(100vh - 40px);
    flex-direction: column;
    /* 縦に並べる */
}

.block {
    border-bottom: 1px solid #ccc;
    padding: 0px 0px 5px 0px;
    height: 40px;
    cursor: pointer;
    transition: flex-grow 0.3s;
    /* アニメーションを追加 */
    position: relative;
}

.block p {
    margin: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    height: auto;
    color: white;
    position: sticky;
    background-color: #2D302D;
    box-sizing: border-box;
}

.block-nav {
    margin: 0;
    /* マージンをゼロに設定 */
    padding-top: 5px;
    padding-bottom: 5px;
    height: auto;
    color: white;
    position: sticky;
    /* 要素を固定する */
    top: 0;
    /* ブロック内の上端に固定 */
    background-color: #2D302D;
    /* 背景色を設定（任意） */
    z-index: 1;
    /* 必要に応じて他の要素よりも前面に表示 */
    box-sizing: border-box;
    /* ボックスモデルを調整 */
}

.block-1 {
    height: 80px;
    /* block-1 の高さを設定 */
}

.block.expanded {
    border-bottom: 1px solid #ccc;
    flex-grow: 1;
    max-height: calc(100vh - 220px);
    /* 画面サイズを基準として収まるように修正 */
    overflow-y: auto;
    /* コンテンツがはみ出た場合はスクロールバーを表示 */
}

.block .content {
    display: none;
}

.block.expanded .content {
    display: block;
    width: 100%;
    height: calc(100% - 40px);
}

.search-input-mobile {
    height: 45% !important;
    padding-left: 10px;
    margin-bottom: 5px;
}

.select-box-mobile {
    height: 45%;
    margin-bottom: 5px;
    width: 100%;
    border-radius: 5px;
    background-color: #545454;
    border: solid 1px #454044;
    color: #fff;
    padding-left: 10px;
    background: #545454;
}

.result-box-mobile {
    width: 100% !important;
    padding: 0px;
    border: none;
}

.item-name-mobile {
    font-size: 0.5rem;
}

.title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 50px;
    padding: 5px;
}

.title img {
    width: 100vw;
    height: 50px;
}

.title h1 {
    color: white;
    margin-bottom: 0px;
}

.craft-box-mobile {
    color: white;
    font-size: 0.5rem;
    height: calc(100% - 50px);
    margin: 0;
}

.material-mobile {
    color: white;
    font-size: 0.5rem;
}

.material-row-mobile {
    margin: 0;
    height: 30px;
}

.material-icon-mobile {
    width: 25px;
    height: 25px;
}

.px-3-mobile {
    padding-right: 0.5rem !important;
    padding-left: 0.5rem !important;
}

.px-4-mobile {
    padding-left: 0.5rem !important;
}
</style>