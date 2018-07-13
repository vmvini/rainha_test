module.exports = function countPossibleAttacks(boardSize, queenRow, queenColumn, blocks) {
  let reachableSlots = [];
  let unreachableSlots = [];
  const queen = { r: queenRow, c: queenColumn };
  const emptyBlock = { r: 0, c: 0 };
  let result = null;

  if ( !blocks ) {
    result = _countPossibleAttacks(
      queen, 
      emptyBlock, 
      boardSize, 
      reachableSlots, 
      unreachableSlots
    );

    return result.reachableSlots.length;
  }

  blocks
  .forEach( b => {
    const block = { r: b[0], c: b[1] };
    result = _countPossibleAttacks(
      queen, 
      block,
      boardSize,
      reachableSlots, 
      unreachableSlots
    );
    reachableSlots = result.reachableSlots;
    unreachableSlots = result.unreachableSlots;
  });

  reachableSlots = reachableSlots
  .filter( r => {
    return unreachableSlots
    .filter( unr => unr.r === r.r && unr.c === r.c )
    .length === 0;
  });  

  return reachableSlots.length;
}


function _countPossibleAttacks(queen, block, n, reachableSlots, unreachableSlots) {
  let queenInitPos;
  const result = {
    reachableSlots: reachableSlots.map( s => ({...s}) ),
    unreachableSlots: unreachableSlots.map( s => ({...s}))
  };

  resetQueenPos();
  
  const tasks = [
    (cb) => compare( r => --r, c => ++c, cb ), 
    (cb) => compare( r => r, c => ++c, cb ), 
    (cb) => compare( r => ++r, c => ++c, cb ),
    (cb) => compare ( r => ++r, c => c, cb ),
    (cb) => compare( r => ++r, c => --c, cb ),
    (cb) => compare( r => r, c => --c, cb ),
    (cb) => compare( r => --r, c => --c, cb ), 
    (cb) => compare( r => --r, c => c, cb )
  ];

  tasks.forEach( task => whileCondition(task) );

  return result;

  function resetQueenPos() {
    queenInitPos = { ...queen };
  }

  function addReachableSlot() {
    savePos('reachableSlots');
  }

  function addUnreachableSlots() {
    savePos('unreachableSlots');
  }

  function savePos(key) {
    if ( result[key]
      .filter(pos => pos.r === queenInitPos.r && pos.c === queenInitPos.c)
      .length > 0 
    ) {
      return;
    }
    result[key] = [ ...result[key], { ...queenInitPos } ];
  }
  
  function whileCondition(comparator) {
    while (comparator() && isInsideBoard()) {
      addReachableSlot();
    }
    if (queenInitPos.r === block.r && queenInitPos.c === block.c) {
      addUnreachableSlots();
    }
    while (comparator( () => true ) && isInsideBoard()) {
      addUnreachableSlots();
    }
    resetQueenPos();
  }

  function isInsideBoard() {
    return minMax(queenInitPos.r) && minMax(queenInitPos.c)
  }

  function minMax(value) {
    return value <= n && value >= 1;
  }

  function compare(rowOperator, columnOperator, customBehavior) {
    queenInitPos.r = rowOperator(queenInitPos.r);
    queenInitPos.c = columnOperator(queenInitPos.c);
    if ( customBehavior ) return customBehavior();
    return !(queenInitPos.r === block.r && queenInitPos.c === block.c);
  }

};