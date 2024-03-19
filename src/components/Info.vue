<template>
    <div class="info">
        <div v-if="!infoLoading" class="loading">
            <Loading />
        </div>
        <div v-else>
            <div v-if="info.Name">
                <div class="detail-info">
                    <div class="info-img">
                        <img v-if="info.Name !== undefined" :src="`/icons/HR/${info.Icon}_hr1.png`" alt="アイコン"
                            loading="lazy">
                    </div>
                    <div class="info-name" v-if="info.Name !== undefined">
                        {{ info.Name }}
                    </div>
                    <div class="info-clip" v-if="info.Name !== undefined" @click="copyToClipboard"
                        data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                        data-offset="0, 10" title="アイテム名をコピーします。">
                        <i class="far fa-copy fa-lg"></i>
                    </div>
                </div>
                <div class="toggle">
                    <div class="material-info">
                        <div class="toggle-button toggle-left"
                            :class="{ 'button-on': activeButton === 1, 'button-off': activeButton !== 1 }"
                            @click="toggleButton(1)">素材情報
                        </div>
                    </div>
                    <div class="marketprice-info">
                        <div class="toggle-button toggle-right"
                            :class="{ 'button-on': activeButton === 2, 'button-off': activeButton !== 2 }"
                            @click="toggleButton(2)">相場情報
                        </div>
                    </div>
                </div>

                <div class="details">
                    <div v-if="activeButton === 1 && info.Name !== undefined" class="Tree-box scroll_bar">
                        <Tree :materialsJson="materialsJson" />
                    </div>
                    <div v-else-if="activeButton === 2 && info.Name !== undefined" class="History-box">
                        <History :materialsJson="materialsJson" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Tooltip } from 'bootstrap';
import Tree from './Tree.vue';
import Loading from './Loading.vue';
import History from './History.vue';

export default {
    props: {
        materialsJson: {
            type: Object,
            required: true
        },
        infoLoading: {
            type: Boolean
        }
    },
    components: {
        Tree,
        Loading,
        History
    },
    data() {
        return {
            activeButton: 1,
            info: [],
        }
    },
    mounted() {
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        })
    },
    methods: {
        copyToClipboard() {
            const itemName = this.info.Name;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(itemName)
                    .then(() => {
                        console.log('テキストがクリップボードにコピーされました: ', itemName);
                        alert('テキストがクリップボードにコピーされました');
                    })
                    .catch(err => {
                        console.error('クリップボードへのアクセスが拒否されました: ', err);
                        alert('クリップボードへのアクセスが拒否されました');
                    });
            } else {
                console.error('クリップボードAPIがサポートされていません');
                alert('クリップボードAPIがサポートされていません');
            }
        },
        toggleButton(buttonNumber) {
            if (buttonNumber === 1) {
                this.activeButton = 1;
            } else if (buttonNumber === 2) {
                this.activeButton = 2;
            }
        },
        someFunction(data) {
            this.info = data
        },
        skip(num) {
            this.activeButton = num;
        }
    }
}
</script>
<style>
.info {
    display: flex;
    flex-direction: column;
    width: calc(100% - 6.5px);
    height: calc(100% - 45px);
    border-left: 2px solid #555455;
}

.loading {
    background-color: #262626;
    min-width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.detail-info {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    margin: 10px;
}

.info-img {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    background-color: black;
}

.info-img img {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
}

.info-name {
    color: white;
    margin-left: 10px;
    font-size: 24px;
}

.info-clip {
    margin-left: 15px;
    color: white;
    cursor: pointer;
}

.toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}

.toggle-left {
    margin-left: auto;
    margin-right: -2.5px;
}

.toggle-right {
    margin-right: auto;
    margin-left: -2.5px;
}

.material-info {
    flex: 1;
    text-align: right;
}

.marketprice-info {
    flex: 1;
    text-align: left;
}

.toggle-button {
    width: 250px;
    height: 26px;
    cursor: pointer;
    text-align: center;
    font-size: 12px;
    line-height: 26px;
    color: white;
}

.button-on {
    background-image: url('../assets/img/button-on.png');
    background-size: 250px 26px;
    background-color: transparent;
}

.button-off {
    background-image: url('../assets/img/button-off.png');
    background-size: 250px 26px;
    background-color: transparent;
}

.details {
    width: calc(100% - 6px);
    height: calc(100vh - 220px);
    color: white;
    list-style-type: none;
    overflow: hidden;
}

.Tree-box {
    width: 100%;
    height: 100%;
    margin: 20px 0 20px 0;
    box-sizing: border-box;
    overflow-y: scroll;
}

.History-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>
