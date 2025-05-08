const audio = document.querySelector("audio");
const ul = document.querySelector("ul");
const container = document.querySelector(".container");

const parseTime = (timeStr) => {
  const timePairs = timeStr.split(":");
  return +timePairs[0] * 60 + +timePairs[1];
};

const parseLrc = () => {
  const lines = lrc.split("\n");
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const lrcPairs = lines[i].split("]");
    const lrcTime = lrcPairs[0].substring(1);

    const lrcObj = {
      time: parseTime(lrcTime),
      words: lrcPairs[1],
    };

    result.push(lrcObj);
  }

  return result;
};

const lrcData = parseLrc();

const findActiveIndex = () => {
  const currTime = audio.currentTime;
  for (let i = 0; i < lrcData.length; i++) {
    if (currTime < lrcData[i].time) {
      return i - 1;
    }
  }
  return lrcData.length - 1;
};

const createLrcElement = () => {
  // 由于多次直接添加 DOM 元素会影响性能，我们先将 DOM 添加到一个文档片段中，再将文档片段加入页面
  // 类似于批量更新
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < lrcData.length; i++) {
    const li = document.createElement("li");
    li.textContent = lrcData[i].words;
    fragment.appendChild(li);
  }

  ul.appendChild(fragment);
};

createLrcElement();

const containerHeight = container.clientHeight;
const liHeight = ul.children[0].clientHeight;
const maxOffset = ul.clientHeight - container.clientHeight;

const setOffset = () => {
  const index = findActiveIndex();
  let offset = liHeight * index + liHeight / 2 - containerHeight;
  if (offset < 0) {
    offset = 0;
  }

  if (offset > maxOffset) {
    offset = maxOffset;
  }

  const activeLi = document.querySelector(".active");
  if (activeLi) {
    activeLi.classList.remove("active");
  }

  ul.style.transform = `translateY(${offset}px)`;

  const li = ul.children[index];
  if (li) {
    li.classList.add("active");
  }
};

setOffset();
audio.addEventListener("timeupdate", setOffset);
