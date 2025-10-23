// =================================================================
// 步驟一：模擬成績數據接收
// -----------------------------------------------------------------


// let scoreText = "成績分數: " + finalScore + "/" + maxScore;
// 確保這是全域變數
let finalScore = 0; 
let maxScore = 0;
let scoreText = ""; // 用於 p5.js 繪圖的文字


window.addEventListener('message', function (event) {
    // 執行來源驗證...
    // ...
    const data = event.data;
    
    if (data && data.type === 'H5P_SCORE_RESULT') {
        
        // !!! 關鍵步驟：更新全域變數 !!!
        finalScore = data.score; // 更新全域變數
        maxScore = data.maxScore;
        scoreText = `最終成績分數: ${finalScore}/${maxScore}`;
        
        console.log("新的分數已接收:", scoreText); 
        
        // ----------------------------------------
        // 關鍵步驟 2: 呼叫重新繪製 (見方案二)
        // ----------------------------------------
        if (typeof redraw === 'function') {
            redraw(); 
        }
    }
}, false);


// =================================================================
// 步驟二：使用 p5.js 繪製分數 (在網頁 Canvas 上顯示)
// -----------------------------------------------------------------

function setup() { 
    // ... (其他設置)
    createCanvas(windowWidth / 2, windowHeight / 2); 
    background(255); 
    noLoop(); // 如果您希望分數只有在改變時才繪製，保留此行
} 

// score_display.js 中的 draw() 函數片段

function draw() { 
    background(255); // 清除背景

    // 計算百分比
    let percentage = 0;
    if (maxScore > 0) {
        percentage = (finalScore / maxScore) * 100;
    }

    textSize(80); 
    textAlign(CENTER);
    
    // -----------------------------------------------------------------
    // A. 根據分數區間改變文本顏色和內容 (畫面反映一)
    // -----------------------------------------------------------------
    
    // *** 根據您的要求進行邏輯修改：
    
    if (percentage === 100) {
        // 1. 總分數為一百分 (100%)：產生放煙火的特效 (視覺模擬)
        fill(255, 165, 0); // 橘色
        text("!!! 完美分數，放煙火囉 !!!", width / 2, height / 2 - 50);
        
        // 煙火特效模擬: 繪製多個發散的小圓點
        // 注意: 為了保持 noLoop() 的使用，這裡的「煙火」是靜態的視覺效果。
        randomSeed(42); // 固定隨機種子，讓靜態「煙火」看起來一樣
        for (let i = 0; i < 50; i++) {
            let angle = random(TWO_PI);
            let radius = random(50, 150);
            let x = width / 2 + cos(angle) * radius;
            let y = height / 2 + sin(angle) * radius;
            fill(random(255), random(255), random(255), 180);
            noStroke();
            circle(x, y, random(5, 15));
        }
        
    } else if (percentage >= 90) {
        // 2. >= 90% (但 < 100%)：顯示「讚喔」
        fill(0, 200, 50); // 綠色
        text("讚喔", width / 2, height / 2 - 50);
        
    } else if (percentage >= 60) {
        // 3. >= 60% (但 < 90%)：顯示「再加油」
        fill(255, 181, 35); // 黃色
        text("再加油", width / 2, height / 2 - 50);
        
    } else if (percentage > 0) {
        // 4. >= 0% (但 < 60%)：顯示「爛」
        fill(200, 0, 0); // 紅色
        text("爛", width / 2, height / 2 - 50);
        
    } else {
        // 尚未收到分數或分數為 0/maxScore=0 的情況
        fill(150);
        text(scoreText, width / 2, height / 2);
    }

    // 顯示具體分數 (在煙火狀態下，我們可能需要調整它的位置或顏色)
    textSize(50);
    fill(50);
    // 如果是 100% 煙火狀態，將分數稍微下移
    let scoreYPos = (percentage === 100) ? height / 2 + 150 : height / 2 + 50;
    text(`得分: ${finalScore}/${maxScore}`, width / 2, scoreYPos);
    
    
    // -----------------------------------------------------------------
    // B. 根據分數觸發不同的幾何圖形反映 (畫面反映二)
    // -----------------------------------------------------------------
    
    // 為了保持畫面的簡潔性，我將 B 區段的幾何圖形反映在 A 區段已經處理了 (煙火特效)。
    // 如果您想保留舊的幾何圖形，可以將其放回。這裡我將其移除或註解掉，
    // 以避免與煙火特效重疊。
    
    /*
    if (percentage >= 90 && percentage < 100) {
        // 畫一個大圓圈代表優異
        fill(0, 200, 50, 150); // 帶透明度
        noStroke();
        circle(width / 2, height / 2 + 150, 150);
        
    } else if (percentage >= 60 && percentage < 90) {
        // 畫一個方形
        fill(255, 181, 35, 150);
        rectMode(CENTER);
        rect(width / 2, height / 2 + 150, 150, 150);
    }
    */
}
