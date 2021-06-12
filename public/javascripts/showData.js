function makingBOM(nodes) {
  let parentTbl = {};
  let config = [];
  let chart = {
    container: "#bom",
    connectors: {
      type: 'step',
      style: {
        stroke: 'aliceblue'
      }
    },
    node: {
      HTMLclass: 'node'
    }
  }
  config.push(chart);
  // 製作其他 node 的 config
  let nodes_Keys = Object.keys(nodes);
  // 會從 元件 1 開始(索引值 1)
  for (let i = 0; i < nodes_Keys.length; i++) {
    config.push({ text: {} });
    config[i + 1]['text']['name'] = nodes[nodes_Keys[i]]['name'];
    // 檢查由幾個元件組成
    if (nodes[nodes_Keys[i]][`q-of-${nodes_Keys[i]}`] != 0) {
      // 把 c-of- 裡的數字加進去
      let arr = nodes[nodes_Keys[i]][`c-of-${nodes_Keys[i]}`];
      let children;
      for (let k = 0; k < arr.length; k++) {
        // 先把括號拆掉再加進去
        children = arr[k].substr(0, arr[k].indexOf('('));
        if (children in parentTbl) {
          parentTbl[children].parent.push(nodes_Keys[i]);
          parentTbl[children].num.push(arr[k].substr(arr[k].indexOf('(')));
        } else {
          parentTbl[children] = {};
          parentTbl[children].parent = [];
          parentTbl[children].parent.push(nodes_Keys[i]);
          parentTbl[children].num = [];
          parentTbl[children].num.push(arr[k].substr(arr[k].indexOf('(')));
        }
      }
    }
  }
  // 最後再把節點的 parent 啥的處理一下
  let each = Object.keys(parentTbl);
  for (let i = 0; i < each.length; i++) {
    config[parseInt(each[i])]['parent'] = config[parentTbl[each[i]].parent[0]];
    config[each[i]]['text']['title'] = parentTbl[each[i]].num[0];
    // 如果這個節點的 parent > 1
    if (parentTbl[each[i]].parent.length > 1) {
      // 新增節點
      for (let n = 1; n < parentTbl[each[i]].parent.length; n++) {
        config.push({ text: {} });
        config[config.length - 1]['text']['name'] = config[each[i]]['text']['name'];
        config[config.length - 1]['text']['title'] = parentTbl[each[i]].num[n];
        config[config.length - 1]['parent'] = config[parentTbl[each[i]].parent[n]];
      }
    }
  }
  let bom = new Treant(config);
}

function showSchedule(timeline) {
  let scheduleDiv = $('#schedule');
  let html = '';
  $('#schedule').html(html);
  for(let i = 0; i < timeline.length; i++) {
    html = `
    <div class="timelineBlock pt-2">
      <h5>週次 ${i+1}</h5>
      ${timeline[i]}
    </div>`
    $('#schedule').append(html);
  }
}

function tracking(nodes, key, timeline, curDate, orderNum) {
  // 推算要開始訂購或製造當前元件的日期
  curDate -= parseInt(nodes[key][`t-of-${key}`])
  // 取出當前元件的子元件陣列
  let consist = nodes[key][`c-of-${key}`];
  // 先計算需要多少(需求減去庫存)
  orderNum -= nodes[key][`i-of-${key}`];
  // 如果沒有子元件(表示當前元件為基礎元件)就直接 return
  if(consist.length == 1 && consist[0] == "0") {
    // 把 timeline 的那天加入"製造元件"的動作
    // 但是基礎元件需要計算一次訂購多少
    if(orderNum < nodes[key][`ord-num-of-${key}`]) {
      orderNum = nodes[key][`ord-num-of-${key}`];
    } else if(orderNum > nodes[key][`ord-num-of-${key}`]) {
      // 計算當前訂購量是否為規定訂購量的倍數
      // 如果不是就把他補上去
      if(orderNum % nodes[key][`ord-num-of-${key}`] != 0) {
        orderNum = orderNum - orderNum % nodes[key][`ord-num-of-${key}`] + nodes[key][`ord-num-of-${key}`];
      }
    }
    timeline[curDate] += `訂購 ${orderNum} 個 ${nodes[key]['name']}<br>`;
    return;
  }
  // 把 timeline 的那天加入"製造元件"的動作
  timeline[curDate] += `開始生產 ${orderNum} 個 ${nodes[key]['name']}<br>`;
  // 跑這個元件的子元件
  for(let i = 0; i < consist.length; i++) {
    // 回推當前元件應該開始製造的時間
    let nextKey = consist[i].substr(0, consist[i].indexOf('('));
    let nextOrderNum = parseInt(consist[i].substring(consist[i].indexOf('(')+1, consist[i].indexOf(')'))) * orderNum;
    tracking(nodes, nextKey, timeline, curDate, nextOrderNum);
  }
}

function schedule(nodes, data) {
  // 建立一個 array，長度為交貨期限
  // 每一格等於一週，從最後一格開始填入該做的事情
  let timeline = new Array(parseInt(data.deadline)).fill('');
  timeline[timeline.length - 1] = '交貨';
  // 開始回推
  let curDate = timeline.length - 1;
  tracking(nodes, "1", timeline, curDate, parseInt(data['orderNum']));
  console.log(timeline);
  showSchedule(timeline);
}

function init(nodes, data) {
  console.log('nodes:', nodes);
  console.log('data:', data);
  makingBOM(nodes);
  schedule(nodes, data);
}