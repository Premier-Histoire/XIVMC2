<template>
    <div class="info">
        <div class="detail-info">
            <div v-if="info.Name !== undefined" class="info-img">
                <img :src="info.iconHrUrl" alt="アイコン" loading="lazy">
            </div>
            <div v-if="info.Name !== undefined" class="info-name">
                {{ info.Name }}
            </div>
            <div v-if="info.Name !== undefined" class="info-clip" @click="copyToClipboard" data-bs-toggle="tooltip"
                data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="アイテム名をコピーします。">
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
            <div v-if="activeButton === 1">
                <!-- 素材情報の表示 -->
                <!-- 例えば、以下に素材情報のコンテンツを記述 -->
                <p>ここに素材情報が表示されます。</p>
            </div>
            <div v-else-if="activeButton === 2">
                <!-- 相場情報の表示 -->
                <!-- 例えば、以下に相場情報のコンテンツを記述 -->
                <p>ここに相場情報が表示されます。</p>
            </div>
        </div>
    </div>
</template>

<script>
import { Tooltip } from 'bootstrap'

export default {
    props: {
        info: Object,
    },
    data() {
        return {
            activeButton: 1
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
        }
    }
}
</script>

<style>
.info {
    display: flex;
    flex-direction: column;
    border-left: 2px solid #555455;
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
    height: calc(100vh - 195px);
    background-color: rgb(70, 95, 95, 0.3);
    color: white;
}
</style>
