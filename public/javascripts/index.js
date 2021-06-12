function genBasicElementInput() {
  // 把目前輸入的元件資料抓出來
  let data = $('form').serializeArray();
  data = data.slice(1, data.length-2);
  console.log(data);
  // 用 for 迴圈找出誰的 q-of- 是 0 的，就表示他是基礎元件
  let list = [];
  for(let i = 0; i < data.length; i += 4) {
    console.log(i);
    if(data[i].value == parseInt(0)) {
      list.push(data[i].name);
    }
  }
  console.log(list);
  // 產生輸入的 html
  let inputDiv = $('#basicElement');
  let html = '<h4>基礎元件參數</h4>';
  inputDiv.html(html);
  for(let i = 0; i < list.length; i++) {
    html = `
    <div class="row mt-2">
      <div class="m-auto col-md-12">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="">元件 ${list[i].substr(5)} 訂購單位</span>
          </div>
          <input type="text" class="form-control" name="ord-num-of-${list[i].substr(5)}" id="ord-num-of-${list[i].substr(5)}" placeholder="每次最少訂幾個">
        </div>
      </div>
    </div>
    
    `;
    inputDiv.append(html);
  }

}

function genInput() {
  let n = $('#q-of-element').val();
  let subInput = $('#subInput');
  let html = ``;
  // 產生 n 個輸入選項
  // 每個元件的屬性
  //   - 由哪些、幾個元件組成
  //   - 原料足夠的話需要多久時間生產
  subInput.html(html);
  for (let i = 0; i < n; i++) {
    html = `
    <div class="row mt-2">
      <div class="m-auto col-md-12">
        <h4>元件 ${i+1}</h4>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="">由幾個元件組成</span>
          </div>
          <input type="text" class="form-control" name="q-of-${i+1}" id="q-of-${i+1}">
        </div>
        <div class="input-group mt-2">
          <div class="input-group-prepend">
            <span class="input-group-text" id="">由哪些元件組成</span>
          </div>
          <input type="text" class="form-control" name="c-of-${i+1}" id="c-of-${i+1}" placeholder="EX: 2(3) 3(5)">
        </div>
        <div class="input-group mt-2">
          <div class="input-group-prepend">
            <span class="input-group-text" id="">訂購/生產需要的時間</span>
          </div>
          <input type="text" class="form-control" name="t-of-${i+1}" id="t-of-${i+1}" placeholder="單位: 週">
        </div>
        <div class="input-group mt-2">
          <div class="input-group-prepend">
            <span class="input-group-text" id="">現有庫存量</span>
          </div>
          <input type="text" class="form-control" name="i-of-${i+1}" id="i-of-${i+1}">
        </div>
        
      </div>
    </div>`
    subInput.append(html);
  }
  subInput.append('<div class="mt-3"><button type="button" class="btn btn-blue w-100" onclick="genBasicElementInput()">確定</button></div>');
}

function prepareData() {
  let data = $('form').serializeArray();
  $('form').submit();
}