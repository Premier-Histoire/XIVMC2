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
import Loding from './components/Loding.vue';
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