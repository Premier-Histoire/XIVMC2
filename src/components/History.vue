<template>
    <div class="history">
        <div v-if="materialsJson.salesHistory" class="history-section">
            <h5>販売履歴</h5>
            <div class="history-table  scroll_bar">
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
                        <tr v-for="(sale, index) in materialsJson.salesHistory.entries" :key="sale.timestamp">
                            <td>{{ index + 1 }}</td>
                            <td class="xivfont" v-if="sale.hq"><span class="xivfont"></span></td>
                            <td v-else></td>
                            <td class="xivfont">{{ sale.pricePerUnit.toLocaleString() }}<span class="xivfont"></span>
                            </td>
                            <td>{{ new Date(sale.timestamp * 1000).toLocaleDateString()
                                }}
                            </td>
                            <td>{{ sale.buyerName }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div v-if="materialsJson.currentHistory" class="history-section">
            <h5>現在の市場価格</h5>
            <div class="history-table  scroll_bar">
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
                        <tr v-for="(listing, index) in materialsJson.currentHistory.listings" :key="listing.listingID">
                            <td>{{ index + 1 }}</td>
                            <td class="xivfont" v-if="listing.hq"><span class="xivfont"></span></td>
                            <td v-else></td>
                            <td class="xivfont">{{ listing.pricePerUnit.toLocaleString() }}<span
                                    class="xivfont"></span></td>
                            <td>{{ new Date(listing.lastReviewTime *
                                1000).toLocaleDateString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="item-info">
        <div class="tree-item-info" style="margin-top: 10px">
            <div class="tree-data"></div>
            <div class="quantity"></div>
            <div class="flex20">1個単価:</div>
            <div class="flex20">{{ (materialsJson.currentHistory.minPrice).toLocaleString() }}<span
                    class="xivfont"></span></div>
        </div>
        <div class="tree-item-info" style="margin-top: 10px">
            <div class="tree-data"></div>
            <div class="quantity"></div>
            <div class="flex20">週平均売上数:</div>
            <div class="flex20">{{ (materialsJson.currentHistory.regularSaleVelocity).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }) }}個</div>
        </div>
        <div class="tree-item-info" style="margin-top: 10px">
            <div class="tree-data"></div>
            <div class="quantity"></div>
            <div class="flex20">1日の販売額:</div>
            <div class="flex20">{{
                (materialsJson.currentHistory.regularSaleVelocity *
                    materialsJson.currentHistory.minPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                maximumFractionDigits: 0
                }) }}<span class="xivfont"></span></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'History',
    props: {
        materialsJson: {
            type: Object,
            required: true
        }
    },
}
</script>

<style>
.history {
    width: 100%;
    height: calc(100% - 110px);
    padding: 0px 10px 0px 10px;
    display: flex;
    gap: 10px;
}

.item-info {
    height: 100px;
    font-size: 14px;
    margin-top: 5px;
    margin-right: 10px;
}

.history-section {
    flex: 0 0 50%;
    /* 各セクションを横幅の50%に設定 */
    color: #fff;
    margin-bottom: 10px;
    height: 100%;
}

.history-table {
    overflow-y: scroll;
    height: calc(100% - 30px);
}

table {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    border-radius: 5px;
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
</style>