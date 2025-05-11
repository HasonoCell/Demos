// 单件商品数据
class UIGood {
  constructor(good) {
    this.rawData = good;
    this.choose = 0;
  }

  // 获取总价
  getTotalPrice() {
    return this.rawData.price * this.choose;
  }

  // 是否选中
  isChosen() {
    return this.choose > 0;
  }

  // 添加数量
  increase() {
    this.choose++;
  }

  // 减少数量
  decrease() {
    if (this.choose > 0) this.choose--;
  }
}

// 整个界面数据
class UIData {
  constructor() {
    this.uiGood = goods.map((good) => new UIGood(good));
    // 写死的一些数据
    this.thresholdCost = 30;
    this.deliveryCost = 5;
  }

  // 获取所有商品总价
  getTotalPrice() {
    return this.uiGood.reduce((acc, good) => acc + good.getTotalPrice(), 0);
  }

  // 获取所有选择商品总数
  getTotalChosenNum() {
    return this.uiGood.reduce((acc, good) => acc + good.choose, 0);
  }

  // 添加数量
  increase(index) {
    this.uiGood[index].increase();
  }

  // 减少数量
  decrease(index) {
    this.uiGood[index].decrease();
  }

  // 购物车中有无商品
  isGoodsInCar() {
    return this.getTotalChosenNum() > 0;
  }

  // 是否达到配送费
  isCrossThreshold() {
    return this.getTotalPrice() > this.thresholdCost;
  }

  // 是否选中
  isChosen(index) {
    return this.uiGood[index].isChosen();
  }
}

// 整个界面
class UI {
  constructor() {
    this.uiData = new UIData();
    this.doms = {
      goodsListDom: document.querySelector(".goods-list"),
      footerDeliveryCostDom: document.querySelector(".footer-car-tip"),
      footerPayDom: document.querySelector(".footer-pay"),
      footerPaySpanDom: document.querySelector(".footer-pay span"),
      totalPriceDom: document.querySelector(".footer-car-total"),
      priceCarDom: document.querySelector(".footer-car"),
      priceCarBadgeDom: document.querySelector(".footer-car-badge"),
    };
    const carRect = this.doms.priceCarDom.getBoundingClientRect();
    this.jumpTo = {
      x: carRect.left + carRect.width / 2,
      y: carRect.top + carRect.height / 5,
    };

    this.createHTML();
    this.updatePageFooter();
    this.listenEvent();
  }

  // 监听各种事件
  listenEvent() {
    this.doms.priceCarDom.addEventListener("animationend", () => {
      this.doms.priceCarDom.classList.remove("animate");
    });
  }

  // 根据商品数据创建商品列表元素
  createHTML() {
    let html = "";
    for (let i = 0; i < this.uiData.uiGood.length; i++) {
      const good = this.uiData.uiGood[i];
      html += `<div class="goods-item">
            <img src="${good.rawData.pic}" alt="" class="goods-pic" />
            <div class="goods-info">
              <h2 class="goods-title">${good.rawData.title}</h2>
              <p class="goods-desc">
                ${good.rawData.desc}
              </p>
              <p class="goods-sell">
                <span>月售 ${good.rawData.sellNumber}</span>
                <span>好评率${good.rawData.favorRate}%</span>
              </p>
              <div class="goods-confirm">
                <p class="goods-price">
                  <span class="goods-price-unit">￥</span>
                  <span>${good.rawData.price}</span>
                </p>
                <div class="goods-btns">
                  <i index="${i}" class="iconfont i-jianhao"></i>
                  <span>${good.choose}</span>
                  <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
                </div>
              </div>
            </div>
          </div>`;
    }
    this.doms.goodsListDom.innerHTML = html;
  }

  // 增加数量
  increase(index) {
    this.uiData.increase(index);
    this.updateGoodsItem(index);
    this.updatePageFooter();
    this.jump(index);
  }

  // 减少数量
  decrease(index) {
    this.uiData.decrease(index);
    this.updateGoodsItem(index);
    this.updatePageFooter();
  }

  // 更新某个商品元素的显示状态
  updateGoodsItem(index) {
    const goodsDom = this.doms.goodsListDom.children[index];
    if (this.uiData.isChosen(index)) {
      goodsDom.classList.add("active");
    } else {
      goodsDom.classList.remove("active");
    }

    const span = goodsDom.querySelector(".goods-btns span");
    span.textContent = this.uiData.uiGood[index].choose;
  }

  // 更新页脚
  updatePageFooter() {
    // 得到总价
    const totalPrice = this.uiData.getTotalPrice();
    // 得到数量
    const totalNum = this.uiData.getTotalChosenNum();
    // 设置配送费
    this.doms.footerDeliveryCostDom.textContent = `配送费￥${this.uiData.deliveryCost}`;
    if (this.uiData.isCrossThreshold()) {
      // 到达起送门槛
      this.doms.footerPayDom.classList.add("active");
    } else {
      this.doms.footerPayDom.classList.remove("active");
      // 设置还差多少钱
      const distance = Math.round(this.uiData.thresholdCost - totalPrice);
      this.doms.footerPaySpanDom.textContent = `还差￥${distance}元起送`;
    }
    // 设置总价
    this.doms.totalPriceDom.textContent = totalPrice.toFixed(2);
    // 设置购物车
    if (this.uiData.isGoodsInCar()) {
      this.doms.priceCarDom.classList.add("active");
    } else {
      this.doms.priceCarDom.classList.remove("active");
    }
    this.doms.priceCarBadgeDom.textContent = totalNum;
  }

  // 购物车动画
  priceCarAnimate() {
    this.doms.priceCarDom.classList.add("animate");
  }

  // 抛物线跳跃效果
  jump(index) {
    const addBtn = this.doms.goodsListDom.children[index].querySelector(
      ".i-jiajianzujianjiahao"
    );
    const btnRect = addBtn.getBoundingClientRect();
    const jumpStart = {
      x: btnRect.left,
      y: btnRect.top,
    };
    const div = document.createElement("div");
    div.className = "add-to-car";
    const i = document.createElement("i");
    i.className = "iconfont i-jiajianzujianjiahao";
    // 设置初始位置
    div.style.transform = `translateX(${jumpStart.x}px)`;
    i.style.transform = `translateY(${jumpStart.y}px)`;
    div.appendChild(i);
    document.body.appendChild(div);

    // 强行渲染,引起 reflow
    div.clientWidth;

    // 设置结束位置
    div.style.transform = `translateX(${this.jumpTo.x}px)`;
    i.style.transform = `translateY(${this.jumpTo.y}px)`;

    div.addEventListener(
      "transitionend",
      () => {
        if (div) {
          div.remove();
        }
        this.priceCarAnimate();
      },
      { once: true }
    );
  }
}

const ui = new UI();

ui.doms.goodsListDom.addEventListener("click", (e) => {
  if (e.target.classList.contains("i-jiajianzujianjiahao")) {
    const index = +e.target.getAttribute("index");
    console.log(index);
    ui.increase(index);
  } else if (e.target.classList.contains("i-jianhao")) {
    const index = +e.target.getAttribute("index");
    ui.decrease(index);
    console.log(index);
  }
});
