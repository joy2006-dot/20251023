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
        
        // !!! 關鍵步驟 1：更新全域變數 !!!
        finalScore = data.score; // 更新全域變數
        maxScore = data.maxScore;
        scoreText = `最終成績分數: ${finalScore}/${maxScore}`;
        
        // ----------------------------------------
        // 關鍵修正：收到成績後，顯示 p5.js 畫面
        // ----------------------------------------
        const canvasContainer = document.getElementById('p5-canvas-container');
        if (canvasContainer) {
            canvasContainer.style.display = 'block'; // 將畫面從 hidden 變為 block
        }
        
        console.log("新的分數已接收:", scoreText); 
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
    // 修正：讓 Canvas 覆蓋整個容器/視窗
    let canvas = createCanvas(windowWidth, windowHeight); 
    
    // *** 新增：將 Canvas 附加到指定的容器 ***
    // 這是讓 CSS 定位 (#p5-canvas-container) 生效的關鍵
    canvas.parent('p5-canvas-container'); 
} 

// 當視窗大小改變時，重新調整 Canvas 大小以保持全屏覆蓋
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function draw() { 
    // 讓背景完全透明 (alpha=0)，避免覆蓋 H5P 內容
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
        
        if (random(1) < 0.1) { // 調整這個值來改變發射頻率
            let x = random(width / 4, width * 3 / 4);
            let y = random(height / 8, height / 2); 
            let fireworkColor = [random(100, 255), random(100, 255), random(100, 255)];
            
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
    
    let gravity = createVector(0, 0.1); 

    for (let i = fireworks.length - 1; i >= 0; i--) {
        let p = fireworks[i];
        
        p.applyForce(gravity);
        p.update();
        p.show();
        
        if (p.done()) {
            fireworks.splice(i, 1);
        }
    }
}
