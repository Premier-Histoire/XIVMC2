<template>
    <div class="title">
        <img src="../assets/img/title.png">
        <div class="setting" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <i class="fas fa-cog fa-lg"></i>
        </div>
    </div>
    <div class="freesearch">
        <div class="subtext">FREE SEARCH</div>
        <input class="search-input" type="text" v-model="searchQuery" @keyup.enter="ItemSearch">
    </div>
    <div class="main-weapon category-button">
        <div class="subtext">MAIN ARM/SUB ARM</div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="片手剣"
                @click="sendCategoryId(1, 10, '片手剣')">
                <img src="../assets/img/10.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="斧" @click="sendCategoryId(1, 11, '斧')">
                <img src="../assets/img/11.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="両手剣"
                @click="sendCategoryId(1, 76, '両手剣')">
                <img src="../assets/img/76.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="ガンブレード"
                @click="sendCategoryId(1, 86, 'ガンブレード')">
                <img src="../assets/img/86.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="槍" @click="sendCategoryId(1, 13, '槍')">
                <img src="../assets/img/13.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="両手鎌"
                @click="sendCategoryId(1, 88, '両手鎌')">
                <img src="../assets/img/88.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="格闘武器"
                @click="sendCategoryId(1, 9, '格闘武器')">
                <img src="../assets/img/9.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="刀" @click="sendCategoryId(1, 83, '刀')">
                <img src="../assets/img/83.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="双剣"
                @click="sendCategoryId(1, 73, '双剣')">
                <img src="../assets/img/73.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="弓" @click="sendCategoryId(1, 12, '弓')">
                <img src="../assets/img/12.png">
            </button>
        </div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="銃" @click="sendCategoryId(1, 77, '銃')">
                <img src="../assets/img/77.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="投擲武器"
                @click="sendCategoryId(1, 87, '投擲武器')">
                <img src="../assets/img/87.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="呪具"
                @click="sendCategoryId(1, 14, '呪具')">
                <img src="../assets/img/14.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="魔導書"
                @click="sendCategoryId(1, 16, '魔導書')">
                <img src="../assets/img/16.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="細剣"
                @click="sendCategoryId(1, 84, '細剣')">
                <img src="../assets/img/84.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="幻具"
                @click="sendCategoryId(1, 15, '幻具')">
                <img src="../assets/img/15.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="魔導書(学者専用)"
                @click="sendCategoryId(1, 85, '魔導書(学者専用)')">
                <img src="../assets/img/85.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="天球儀"
                @click="sendCategoryId(1, 78, '天球儀')">
                <img src="../assets/img/78.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="賢具"
                @click="sendCategoryId(1, 89, '賢具')">
                <img src="../assets/img/89.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="木工道具"
                @click="sendCategoryId(1, 19, '木工道具')">
                <img src="../assets/img/19.png">
            </button>
        </div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="鍛冶道具"
                @click="sendCategoryId(1, 20, '鍛冶道具')">
                <img src="../assets/img/20.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="甲冑道具"
                @click="sendCategoryId(1, 21, '甲冑道具')">
                <img src="../assets/img/21.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="彫金道具"
                @click="sendCategoryId(1, 22, '彫金道具')">
                <img src="../assets/img/22.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="革細工道具"
                @click="sendCategoryId(1, 23, '革細工道具')">
                <img src="../assets/img/23.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="裁縫道具"
                @click="sendCategoryId(1, 24, '裁縫道具')">
                <img src="../assets/img/24.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="錬金道具"
                @click="sendCategoryId(1, 25, '錬金道具')">
                <img src="../assets/img/25.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="調理道具"
                @click="sendCategoryId(1, 26, '調理道具')">
                <img src="../assets/img/26.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="採掘道具"
                @click="sendCategoryId(1, 27, '裁縫道具')">
                <img src="../assets/img/27.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="園芸道具"
                @click="sendCategoryId(1, 28, '園芸道具')">
                <img src="../assets/img/28.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="漁道具"
                @click="sendCategoryId(1, 29, '漁道具')">
                <img src="../assets/img/29.png">
            </button>
        </div>
        <div class="button-container-last">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="釣り餌"
                @click="sendCategoryId(1, 30, '釣り餌')">
                <img src="../assets/img/30.png">
            </button>
        </div>
        <div class="level-selector-container">
            <div class="level-selector">
                <span class="leveltext">Lv</span>
                <input type="text" class="level-input" v-model="mainArmSubArmLevel">
                <button class="level-up" @click="incrementLevel('main')">+</button>
                <button class="level-down" @click="decrementLevel('main')">-</button>
            </div>
        </div>
    </div>
    <div class="main-weapon category-button">
        <div class="subtext">ARMOR/ACCESSORIES</div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="盾" @click="sendCategoryId(2, 17, '盾')">
                <img src="../assets/img/17.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="頭防具"
                @click="sendCategoryId(2, 31, '頭防具')">
                <img src="../assets/img/31.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="胴防具"
                @click="sendCategoryId(2, 33, '胴防具')">
                <img src="../assets/img/33.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="手防具"
                @click="sendCategoryId(2, 36, '手防具')">
                <img src="../assets/img/36.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="脚防具"
                @click="sendCategoryId(2, 35, '脚防具')">
                <img src="../assets/img/35.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="足防具"
                @click="sendCategoryId(2, 37, '足防具')">
                <img src="../assets/img/37.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="耳飾り"
                @click="sendCategoryId(2, 40, '耳飾り')">
                <img src="../assets/img/40.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="首飾り"
                @click="sendCategoryId(2, 39, '首飾り')">
                <img src="../assets/img/39.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="腕輪"
                @click="sendCategoryId(2, 41, '腕輪')">
                <img src="../assets/img/41.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="指輪"
                @click="sendCategoryId(2, 42, '指輪')">
                <img src="../assets/img/42.png">
            </button>
        </div>
        <div class="level-selector-container">
            <div class="level-selector">
                <span class="leveltext">Lv</span>
                <input type="text" class="level-input" v-model="armorAccessoryLevel">
                <button class="level-up" @click="incrementLevel()">+</button>
                <button class="level-down" @click="decrementLevel()">-</button>
            </div>
        </div>
        <div class="select-job">
            <select class="select-box" v-model="selectedJob">
                <option value="ADV">すべて表示</option>
                <option value="PLD">ナイト</option>
                <option value="GLA">剣術士</option>
                <option value="WAR">戦士</option>
                <option value="MRD">斧術士</option>
                <option value="DRK">暗黒騎士</option>
                <option value="GNB">ガンブレイカー</option>
                <option value="WHM">白魔道士</option>
                <option value="CNJ">幻術士</option>
                <option value="SCH">学者</option>
                <option value="AST">占星術師</option>
                <option value="SGE">賢者</option>
                <option value="MNK">モンク</option>
                <option value="PGL">格闘士</option>
                <option value="DRG">竜騎士</option>
                <option value="LNC">槍術士</option>
                <option value="NIN">忍者</option>
                <option value="ROG">双剣士</option>
                <option value="SAM">侍</option>
                <option value="RPR">リーパー</option>
                <option value="BRD">吟遊詩人</option>
                <option value="MCH">機工士</option>
                <option value="DNC">踊り子</option>
                <option value="BLM">黒魔道士</option>
                <option value="THM">呪術士</option>
                <option value="SMN">召喚士</option>
                <option value="ACN">巴術士</option>
                <option value="RDM">赤魔道士</option>
                <option value="BLU">青魔道士</option>
                <option value="CRP">木工師</option>
                <option value="BSM">鍛冶師</option>
                <option value="ARM">甲冑師</option>
                <option value="GSM">彫金師</option>
                <option value="LTW">革細工師</option>
                <option value="WVR">裁縫師</option>
                <option value="ALC">錬金術師</option>
                <option value="CUL">調理師</option>
                <option value="MIN">採掘師</option>
                <option value="BTN">園芸師</option>
                <option value="FSH">漁師</option>
            </select>
        </div>
    </div>
    <div class="main-weapon category-button">
        <div class="subtext">OTHERS</div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="薬品"
                @click="sendCategoryId(3, 43, '薬品')">
                <img src="../assets/img/43.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="食材"
                @click="sendCategoryId(3, 44, '食材')">
                <img src="../assets/img/44.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="調理品"
                @click="sendCategoryId(3, 45, '調理品')">
                <img src="../assets/img/45.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="水産物"
                @click="sendCategoryId(3, 46, '水産物')">
                <img src="../assets/img/46.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="石材"
                @click="sendCategoryId(3, 47, '石材')">
                <img src="../assets/img/47.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="金属材"
                @click="sendCategoryId(3, 48, '金属材')">
                <img src="../assets/img/48.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="木材"
                @click="sendCategoryId(3, 49, '木材')">
                <img src="../assets/img/49.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="布材"
                @click="sendCategoryId(3, 50, '布材')">
                <img src="../assets/img/50.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="皮革材"
                @click="sendCategoryId(3, 51, '皮革材')">
                <img src="../assets/img/51.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="骨材"
                @click="sendCategoryId(3, 52, '骨材')">
                <img src="../assets/img/52.png">
            </button>
        </div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="錬金術材"
                @click="sendCategoryId(3, 53, '錬金術材')">
                <img src="../assets/img/53.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="染料"
                @click="sendCategoryId(3, 54, '染料')">
                <img src="../assets/img/54.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="部品"
                @click="sendCategoryId(3, 55, '備品')">
                <img src="../assets/img/55.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="マテリア"
                @click="sendCategoryId(3, 57, 'マテリア')">
                <img src="../assets/img/57.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="クリスタル"
                @click="sendCategoryId(3, 58, 'クリスタル')">
                <img src="../assets/img/58.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="触媒"
                @click="sendCategoryId(3, 59, '触媒')">
                <img src="../assets/img/59.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="雑貨"
                @click="sendCategoryId(3, 60, '雑貨')">
                <img src="../assets/img/60.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="雑貨(シーズナル)"
                @click="sendCategoryId(3, 74, '雑貨(シーズナル)')">
                <img src="../assets/img/74.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="雑貨(習得/登録系)"
                @click="sendCategoryId(3, 90, '雑貨(習得/登録系)')">
                <img src="../assets/img/90.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="ミニオン"
                @click="sendCategoryId(3, 75, 'ミニオン')">
                <img src="../assets/img/75.png">
            </button>
        </div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="飛空艇・潜水艦部品"
                @click="sendCategoryId(3, 79, '飛空艇・潜水艦部品')">
                <img src="../assets/img/79.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="オーケストリオン関連品"
                @click="sendCategoryId(3, 80, 'オーケストリオン関連品')">
                <img src="../assets/img/80.png">
            </button>
        </div>
    </div>
    <div class="main-weapon category-button">
        <div class="subtext">HOUSING</div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="外装建材"
                @click="sendCategoryId(4, 65, '外装建材')">
                <img src="../assets/img/65.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="内装建材"
                @click="sendCategoryId(4, 66, '内装建材')">
                <img src="../assets/img/66.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="庭具"
                @click="sendCategoryId(4, 67, '庭具')">
                <img src="../assets/img/67.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="調度品(一般)"
                @click="sendCategoryId(4, 56, '調度品(一般)')">
                <img src="../assets/img/56.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="調度品(椅子・寝台)"
                @click="sendCategoryId(4, 68, '調度品(椅子・寝台)')">
                <img src="../assets/img/68.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="'調度品(台座)"
                @click="sendCategoryId(4, 69, '調度品(台座)')">
                <img src="../assets/img/69.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="調度品(卓上)"
                @click="sendCategoryId(4, 70, '調度品(卓上)')">
                <img src="../assets/img/70.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="調度品(壁掛)"
                @click="sendCategoryId(4, 71, '調度品(壁掛)')">
                <img src="../assets/img/71.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="調度品(敷物)"
                @click="sendCategoryId(4, 72, '調度品(敷物)')">
                <img src="../assets/img/72.png">
            </button>
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="栽培用品"
                @click="sendCategoryId(4, 81, '栽培用品')">
                <img src="../assets/img/81.png">
            </button>
        </div>
        <div class="button-container">
            <button class="button" data-bs-toggle="tooltip" data-bs-placement="top"
                data-bs-custom-class="custom-tooltip" data-offset="0, 10" title="絵画"
                @click="sendCategoryId(4, 82, '絵画')">
                <img src="../assets/img/82.png">
            </button>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">設定</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="data-center-select" class="col-form-label">物理データセンター:</label>
                            <select class="form-select" v-model="selectedPhysicalDataCenter">
                                <option value="">空白</option>
                                <option v-for="(physicalDataCenter, index) in physicalDataCenters"
                                    :value="physicalDataCenter" :key="index">{{ physicalDataCenter }}</option>
                            </select>
                        </div>
                        <div class="mb-3" v-if="selectedPhysicalDataCenter">
                            <label for="data-center-select" class="col-form-label">論理データセンター:</label>
                            <select class="form-select" v-model="selectedLogicalDataCenter">
                                <option value="">空白</option>
                                <option
                                    v-for="(logicalDataCenter, index) in logicalDataCenters[selectedPhysicalDataCenter]"
                                    :value="logicalDataCenter" :key="index">{{ logicalDataCenter }}</option>
                            </select>
                        </div>
                        <div class="mb-3" v-if="selectedLogicalDataCenter">
                            <label for="server-select" class="col-form-label">Server:</label>
                            <select class="form-select" v-model="selectedServer">
                                <option value="">空白</option>
                                <option v-for="(server, index) in servers[selectedLogicalDataCenter]" :value="server"
                                    :key="index">{{ server }}</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                    <button type="button" class="btn btn-primary" @click="cacheSelection">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Tooltip } from 'bootstrap'
import { Modal } from 'bootstrap'

export default {
    emits: ['send-data'],
    data() {
        return {
            searchQuery: '',
            mainArmSubArmLevel: 1,
            armorAccessoryLevel: 1,
            selectedJob: 'ADV',
            selectedPhysicalDataCenter: 'Japan',
            selectedLogicalDataCenter: 'Mana',
            selectedServer: 'Chocobo',
            physicalDataCenters: ['Europe', 'Japan', 'America', 'Oceania'],
            logicalDataCenters: {
                'Europe': ['Chaos', 'Light'],
                'Japan': ['Elemental', 'Gaia', 'Mana', 'Meteor'],
                'America': ['Aether', 'Primal', 'Crystal', 'Dynamis'],
                'Oceania': ['Materia']
            },
            servers: {
                'Chaos': ['Cerberus', 'Louisoix', 'Moogle', 'Omega', 'Phantom', 'Ragnarok', 'Sagittarius', 'Spriggan'],
                'Light': ['Alpha', 'Lich', 'Odin', 'Phoenix', 'Raiden', 'Shiva', 'Twintania', 'Zodiark'],
                'Elemental': ['Aegis', 'Atomos', 'Carbuncle', 'Garuda', 'Gungnir', 'Kujata', 'Tonberry', 'Typhon'],
                'Gaia': ['Alexander', 'Bahamut', 'Durandal', 'Fenrir', 'Ifrit', 'Ridill', 'Tiamat', 'Ultima'],
                'Mana': ['Anima', 'Asura', 'Chocobo', 'Hades', 'Ixion', 'Masamune', 'Pandaemonium', 'Titan'],
                'Meteor': ['Belias', 'Mandragora', 'Ramuh', 'Shinryu', 'Unicorn', 'Valefor', 'Yojimbo', 'Zeromus'],
                'Aether': ['Adamantoise', 'Cactuar', 'Faerie', 'Gilgamesh', 'Jenova', 'Midgardsormr', 'Sargatanas', 'Siren'],
                'Primal': ['Behemoth', 'Excalibur', 'Exodus', 'Famfrit', 'Hyperion', 'Lamia', 'Leviathan', 'Ultros'],
                'Crystal': ['Balmung', 'Brynhildr', 'Coeurl', 'Diabolos', 'Goblin', 'Malboro', 'Mateus', 'Zalera'],
                'Dynamis': ['Halicarnassus', 'Maduin', 'Marilith', 'Seraph'],
                'Materia': ['Bismarck', 'Ravana', 'Sephirot', 'Sophia', 'Zurvan']
            }
        }
    },
    mounted() {
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']",
        });
    },
    methods: {
        openModal() {
            this.myModal.show();
        },
        incrementLevel(target) {
            // レベルを増やす
            if (target === 'main') {
                if (this.mainArmSubArmLevel < 90) {
                    this.mainArmSubArmLevel++
                }
            } else {
                if (this.mainArmSubArmLevel < 90) {
                    this.armorAccessoryLevel++
                }
            }
        },
        decrementLevel(target) {
            // レベルを減らす
            if (target === 'main') {
                if (this.mainArmSubArmLevel > 1) {
                    this.mainArmSubArmLevel--;
                } else if (this.mainArmSubArmLevel = 1) {
                    this.mainArmSubArmLevel = 90
                }
            } else {
                if (this.armorAccessoryLevel > 1) {
                    this.armorAccessoryLevel--;
                } else if (this.armorAccessoryLevel = 1) {
                    this.armorAccessoryLevel = 90
                }
            }
        },
        sendCategoryId(typeId, data, text) {
            if (typeId === 1) {
                this.$emit('send-data', 'Category', typeId, data, text, this.mainArmSubArmLevel);
            } else if (typeId === 2) {
                this.$emit('send-data', 'Category', typeId, data, text, this.armorAccessoryLevel, this.selectedJob);
            } else {
                this.$emit('send-data', 'Category', typeId, data, text);
            }
        },
        ItemSearch() {
            if (this.searchQuery.trim() !== '') {
                this.$emit('send-data', 'freeSearch', '0', this.searchQuery)
            }
        },
        cacheSelection() {
            if (this.selectedLogicalDataCenter === '') {
                localStorage.setItem('searchvalue', this.selectedPhysicalDataCenter);
            }
            if (this.selectedServer === '') {
                localStorage.setItem('searchvalue', this.selectedLogicalDataCenter);
            } else {
                localStorage.setItem('searchvalue', this.selectedServer);
            }

            localStorage.setItem('selectedPhysicalDataCenter', this.selectedPhysicalDataCenter);
            localStorage.setItem('selectedLogicalDataCenter', this.selectedLogicalDataCenter);
            localStorage.setItem('selectedServer', this.selectedServer);
        }
    },
    created() {
        this.selectedPhysicalDataCenter = localStorage.getItem('selectedPhysicalDataCenter') || 'Japan';
        this.selectedLogicalDataCenter = localStorage.getItem('selectedLogicalDataCenter') || 'Mana';
        this.selectedServer = localStorage.getItem('selectedServer') || 'CChocobo';
    }
}
</script>

<style scoped>
.title {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
}

.setting {
    position: absolute;
    color: white;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
}

.title img {
    height: 40px;
}

.subtext {
    color: white;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 2px;
}

.freesearch {
    padding: 3px 10px 3px 10px;
    height: fit-content;
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

.category-button {
    width: 100%;
    padding: 3px 10px 3px 10px;
}

.button-container {
    display: grid;
    grid-template-columns: repeat(10, 20px);
    gap: 6.5px;
    margin-bottom: 6.6px;
}

.button-container-last {
    display: grid;
    grid-template-columns: repeat(10, 20px);
    gap: 6.6px;
    margin-bottom: 3px;
}

.button {
    width: 20px;
    height: 20px;
    padding: 0;
    font-size: 0;
    background-color: #313031;
    border: none;
    cursor: pointer;
}

/* ホバー時のスタイル */
.button:hover {
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.24);
    transform: translate(0, -2px);
}

.level-selector-container {
    display: flex;
    justify-content: center;
}

.level-selector {
    display: flex;
    align-items: center;
}

.leveltext {
    color: white;
}

.level-input {
    margin: 0 0 0 10px;
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
    align-items: center;
    background-color: #202020;
    color: #000;
    border: solid 1px #151515;
    border-radius: 5px;
    cursor: pointer;
    font-size: 23px;
    width: 25px;
    height: 25px;
    margin-left: 2px;
}

.select-job {
    display: flex;
    justify-content: center;
}

.select-box {
    flex-grow: 1;
    text-align: center;
    margin-top: 5px;
    height: 25px;
    appearance: none;
    color: #fff;
    background: linear-gradient(to bottom, #2F2F2F 0%, #272727 50%, #2F2F2F 100%);
    background-color: #2f2f2f;
    border: 1px solid #222222;
    border-radius: 9999px;
    font-size: 12px;
}
</style>