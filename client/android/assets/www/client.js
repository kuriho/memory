(function(){
    const imghost   = './img/';
    const ws        = new WebSocket( '' ); //add WS server
    const board     = document.getElementsByClassName('board')[0];
    const modal     = document.getElementsByClassName('modal')[0];
    let   lock      = new Array(24);
    let   turn      = false;
    let   pause     = false;
    let   guesses   = 0;
    let   playerNr  = 0;

    const cards = Array.from(); //add list of cards from json

    ws.onopen = (event) => {
        console.log('WebSocket is connected.');

        const params = new URLSearchParams(document.location.search.substring(1));
        ws.send( JSON.stringify({ action:'join', data: [ params.get("game") || 'Dummy', params.get("name") || 'Anonymous' ] }));
    };

    ws.onmessage = (event) => {
        let json = JSON.parse(event.data);

        switch(json.type){
            case 'cards':
                board.innerHTML = `
                <div class="card">
                    <div class="inside">
                        <div class="front"></div>
                        <div class="back"></div>
                    </div>
                </div>`.repeat(24);

                [...board.getElementsByClassName('card')].forEach((c) => c.addEventListener("touchend", (e) => {
                    if(!turn) return;
                    if(guesses >= 2) return;
                    if(pause) { ws.send( JSON.stringify({ action:'resume' })); return; }

                    let cardIdx = [...c.parentElement.children].indexOf(c);
                    if(lock[cardIdx]){ return; }else{ lock[cardIdx] = true; }

                    let cl = e.currentTarget.getElementsByClassName('inside')[0].classList;
                    if(cl.contains('got') || cl.contains('matched') || cl.contains('picked') ) return;
                    guesses++;

                    ws.send( JSON.stringify({ action:'pick', data: cardIdx }));
                }));

                modal.style.display = "none";
                modal.innerHTML = ``;
                break;

            case 'turn':
                guesses = 0;
                lock    = new Array(24);
                [...board.getElementsByClassName('back')].forEach( back => back.classList.toggle('active'));
                turn = true;
                break;

            case 'pause':
                pause = !pause;
                break;

            case 'gameover':
                modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header"><h2>クリア！</h2></div>
                    <div class="modal-body"><h3><center>${json.data[playerNr]} : ${json.data[1-playerNr]}</center></h3></div>
                    <div class="modal-footer"></div>
                </div>`
                modal.style.display = "block";
            case 'miss':
                turn = false;
                [...board.getElementsByClassName('back')].forEach( back => back.classList.toggle('active'));
                break;

            case 'reveal':
                [...json.data].forEach((idx, i) => { 
                    const inside = board.getElementsByClassName('inside')[idx];
                    const card = cards.find( c => c.id == json.secret[i] );

                    inside.getElementsByClassName('front')[0].innerHTML = 
                    `<img src="${imghost}${card.img}" alt="${card.name}" />`;                        

                    inside.classList.toggle('picked');
                });
                break;

            case 'matched':
                guesses = 0; 
            case 'picked':
            case 'got':
                [...json.data].forEach((idx) => board.getElementsByClassName('inside')[idx].classList.toggle(json.type));
                break;

            case 'greet':
                playerNr = json.data[1];
                modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header"><h2>準備中。。。</h2></div>
                    <div class="modal-body">
                        <p>他のプレイヤーを待っています。<br/>Waiting for another player to join.</p>
                        <p>Link: http://memory.hodi.ch/<b>?game=${json.data[0]}</b></p>
                    </div>
                    <div class="modal-footer"></div>
                </div>`
                modal.style.display = "block";
                break;

            default:
                console.log(json);
                console.log('NYI');
        }    
    };
})();