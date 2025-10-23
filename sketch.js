// =================================================================
// 步驟一：模擬成績數據接收
// -----------------------------------------------------------------


// 確保這是全域變數
let finalScore = 0; 
let maxScore = 0;
let scoreText = ""; // 用於 p5.js 繪圖的文字

// *** 新增：用於煙火特效的全域變數 ***
let fireworks = []; // 儲存所有的煙火粒子

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
        // 關鍵步驟 2: 呼叫重新繪製 (此處不需要 if (typeof redraw === 'function'))
        // 由於我們讓 draw() 持續運行 (loop)，所以這裡不需要特別呼叫 redraw()
        // 但如果您的環境強制了 noLoop，那麼保留 redraw() 也可以。
        // 為確保動畫流暢，我們將依賴 draw() 的持續運行。
        // ----------------------------------------
    }
}, false);


// =================================================================
// 步驟二：p5.js 繪製分數與動畫
// -----------------------------------------------------------------

// *** Particle 類別 (用於煙火顆粒) ***
class Particle {
    constructor(x, y, color) {
        this.pos = createVector(x, y);
        // 賦予隨機初始速度，模擬爆炸擴散
        this.vel = p5.Vector.random2D(); 
        this.vel.mult(random(2, 10)); // 爆炸速度
        this.acc = createVector(0, 0);
        this.lifespan = 255;
        this.color = color;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.lifespan -= 4; // 逐漸消失
    }

    done() {
        return this.lifespan < 0;
    }

    show() {
        colorMode(RGB);
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.lifespan);
        ellipse(this.pos.x, this.pos.y, 4, 4);
    }
}


function setup() { 
    // 建立 Canvas
    createCanvas(windowWidth / 2, windowHeight / 2); 
    // 預設是 loop()，讓 draw() 持續執行，這是動畫的基礎！
    // 除非您明確呼叫 noLoop()，否則 p5.js 會自動持續執行 draw()。
} 

function draw() { 
    // *** 調整一：讓背景透明，並保持拖尾效果 ***
    // 這裡我們維持 alpha = 0，讓背景完全透明。
    background(255, 255, 255, 0); 

    // 計算百分比
    let percentage = 0;
    if (maxScore > 0) {
        percentage = (finalScore / maxScore) * 100;
    }

    textSize(80); 
    textAlign(CENTER);
    
    // -----------------------------------------------------------------
    // A. 根據分數區間改變文本顏色和內容
    // -----------------------------------------------------------------
    
    if (percentage === 100) {
        // 1. 總分數為一百分 (100%)：產生放煙火的特效
        fill(255, 165, 0); // 橘色
        text("!!! 完美分數，放煙火囉 !!!", width / 2, height / 2 - 50);
        
        // 煙火生成邏輯：這部分是正確的，因為 draw() 迴圈持續運行，
        // 所以 random(1) < 0.1 會持續觸發新煙火的生成。
        if (random(1) < 0.1) { 
            let x = random(width / 4, width * 3 / 4);
            let y = random(height / 8, height / 2); 
            let fireworkColor = [random(100, 255), random(100, 255), random(100, 255)];
            
            // 每次發射 30 個粒子
            for (let i = 0; i < 30; i++) {
                fireworks.push(new Particle(x, y, fireworkColor));
            }
        }
        
    } else if (percentage >= 90) {
        // 2. >= 90% (但 < 100%)：顯示「讚喔」
        fill(0, 200, 50); // 綠色
        text("讚喔", width / 2, height / 2 - 50);
        fireworks = []; // 清除煙火
        
    } else if (percentage >= 60) {
        // 3. >= 60% (但 < 90%)：顯示「再加油」
        fill(255, 181, 35); // 黃色
        text("再加油", width / 2, height / 2 - 50);
        fireworks = []; // 清除煙火
        
    } else if (percentage > 0) {
        // 4. >= 0% (但 < 60%)：顯示「爛」
        fill(200, 0, 0); // 紅色
        text("爛", width / 2, height / 2 - 50);
        fireworks = []; // 清除煙火
        
    } else {
        // 尚未收到分數或分數為 0/maxScore=0 的情況
        fill(150);
        text(scoreText, width / 2, height / 2);
        fireworks = []; // 清除煙火
    }

    // 顯示具體分數
    textSize(50);
    fill(50);
    text(`得分: ${finalScore}/${maxScore}`, width / 2, height / 2 + 50);

    // -----------------------------------------------------------------
    // C. 煙火動畫渲染與更新
    // -----------------------------------------------------------------
    
    // 應用重力 (模擬粒子下落)
    let gravity = createVector(0, 0.1); 

    for (let i = fireworks.length - 1; i >= 0; i--) {
        let p = fireworks[i];
        
        p.applyForce(gravity);
        p.update();
        p.show();
        
        // 如果粒子壽命結束，從陣列中移除
        if (p.done()) {
            fireworks.splice(i, 1);
        }
    }
}
