/* Assassin animation controller — CSS-based prototype
   States: idle, walk, jump, 3-hit attack combo. Replace with frame animation later. */
(function(){
  const hero = document.querySelector('#hero');
  if (!hero) return;
  let walkDirection = 0, walkTimer = null, comboStep = 0, comboLock = false;
  const clearMotion = () => hero.classList.remove('anim-idle','anim-walk','anim-jump','anim-hit1','anim-hit2','anim-hit3','attack');
  function setState(state){
    clearMotion();
    hero.classList.add('anim-' + state);
  }
  function startWalk(direction){
    walkDirection = direction;
    hero.classList.remove('facing-left','facing-right');
    hero.classList.add(direction < 0 ? 'facing-left' : 'facing-right');
    setState('walk');
  }
  function stopWalk(){ walkDirection = 0; hero.classList.remove('anim-walk'); hero.classList.add('anim-idle'); }
  function jump(){ setState('jump'); hero.classList.add('jump'); setTimeout(()=>{hero.classList.remove('jump'); if(!walkDirection)setState('idle');},500); }
  function attack(){
    if(comboLock)return;
    comboLock = true; comboStep = comboStep % 3 + 1;
    hero.classList.remove('anim-hit1','anim-hit2','anim-hit3','attack');
    void hero.offsetWidth;
    hero.classList.add('anim-hit'+comboStep,'attack');
    setTimeout(()=>{hero.classList.remove('anim-hit'+comboStep,'attack'); hero.classList.add(walkDirection?'anim-walk':'anim-idle'); comboLock=false;}, comboStep===3?300:230);
  }
  document.querySelectorAll('[data-action]').forEach(button=>{
    const action=button.dataset.action;
    button.addEventListener('pointerdown', e=>{
      e.preventDefault();
      if(action==='left') startWalk(-1);
      if(action==='right') startWalk(1);
      if(action==='jump') jump();
      if(action==='attack') attack();
    });
    button.addEventListener('pointerup', stopWalk);
    button.addEventListener('pointercancel', stopWalk);
    button.addEventListener('pointerleave', stopWalk);
  });
  hero.classList.add('anim-idle');
})();