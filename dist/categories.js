import {shuffle} from './core.js';

export const CATEGORIES = [
 {id:'food',name:'Food & drink',description:'Meals, ingredients, and drinks.',cards:['Hot pot','Cilantro','Pizza','Bubble tea','Sushi','Iced coffee','Cake','Pickles','French fries','Salad','Chocolate','Vanilla ice cream','Noodles','Dumplings','Pineapple pizza','Matcha','Coconut water','Fried chicken','Oysters','Spicy food']},
 {id:'everyday',name:'Everyday life',description:'The things you do on an ordinary day.',cards:['Early mornings','Rainy days','Working out','Cooking','Cleaning','Naps','Grocery shopping','Making plans','Long showers','Doing laundry','Working from home','Taking the stairs','Meal prep','Sleeping in','Gardening','Running errands','Public transport','Walking to work','Reading before bed','Doing nothing']},
 {id:'entertainment',name:'Entertainment',description:'Things to watch, read, listen to, or play.',cards:['Horror movies','Cartoons','Board games','Puzzles','Watching sports','Gaming streams','Podcasts','Short videos','Reading fiction','Reality TV','Documentaries','Romantic comedies','Video games','Audiobooks','True crime','Jazz','Pop music','Movie sequels','Watching reruns','Movie spoilers']},
 {id:'out',name:'Going out',description:'Plans for a free afternoon or evening.',cards:['Karaoke','Escape rooms','Roller coasters','Stand-up comedy','Museums','Cat cafés','Music festivals','Bookstores','Concerts','Club nights','Picnics','Flea markets','Bowling','Brunch','Food markets','Art galleries','Mini golf','Arcades','Street fairs','Trying a new restaurant']},
 {id:'travel',name:'Travel',description:'Places to go and ways to get there.',cards:['Solo travel','Camping','Road trips','City breaks','Beach vacations','Flying','Train journeys','Hiking','Skiing','Cruises','Hostels','Luxury hotels','Guided tours','Traveling with friends','Traveling with family','Packing light','Tourist attractions','Souvenir shopping','Planning every detail','Trips without an itinerary']},
 {id:'habits',name:'People & habits',description:'Social plans and small preferences.',cards:['Phone calls','Voice notes','Group chats','Small talk','Surprise parties','Giving gifts','Receiving gifts','Meeting new people','Hosting friends','Taking photos','Social media','Being early','Being spontaneous','Keeping a journal','Sharing food','Making playlists','Dressing up','Friendly competition','Celebrating birthdays','Spending time alone']}
];
export const cardKey=text=>text.trim().toLocaleLowerCase('en');
export function customCards(text){return [...new Map(text.split('\n').map(s=>s.trim()).filter(Boolean).map(s=>[cardKey(s),s])).values()];}
export function makePools(ids,custom=[]){const pools=CATEGORIES.filter(c=>ids.includes(c.id)).map(c=>({...c,cards:[...c.cards]}));if(ids.includes('custom'))pools.push({id:'custom',name:'Custom cards',description:'Your own topics.',cards:custom});return pools;}
export function poolSize(pools){return new Set(pools.flatMap(p=>p.cards.map(cardKey))).size;}

// Consume unseen cards first. A cycle resets only when its available pool is exhausted.
export function drawRound({pools,mode='category',used=[],categoryQueue=[]},random=Math.random){
 if(!pools.length||pools.some(p=>new Set(p.cards.map(cardKey)).size<5))throw new Error('Each selected category needs at least five different cards.');
 let active=pools,queue=categoryQueue.filter(id=>pools.some(p=>p.id===id)),label='Mixed categories';
 if(mode==='category'){
  if(!queue.length)queue=shuffle(pools.map(p=>p.id),random);
  const id=queue.shift();active=[pools.find(p=>p.id===id)];label=active[0].name;
 }
 const activeKeys=new Set(active.flatMap(p=>p.cards.map(cardKey)));
 let seen=new Set(used.map(cardKey));const picked=[],pickedKeys=new Set();let candidates=[];
 function refill(){
  const fresh=active.map(p=>({...p,cards:shuffle(p.cards.filter(c=>!seen.has(cardKey(c))&&!pickedKeys.has(cardKey(c))),random)}));
  // Interleave categories so a large category cannot dominate a mixed round.
  const groups=shuffle(fresh,random);candidates=[];
  while(groups.some(p=>p.cards.length))for(const p of groups)if(p.cards.length)candidates.push({card:p.cards.pop(),category:p.name});
 }
 refill();
 while(picked.length<5){
  if(!candidates.length){for(const k of activeKeys)seen.delete(k);refill();}
  const item=candidates.shift();if(!item)throw new Error('Not enough unique cards.');
  const key=cardKey(item.card);if(pickedKeys.has(key))continue;
  picked.push(item);pickedKeys.add(key);seen.add(key);
 }
 for(const key of pickedKeys)seen.add(key);
 return {cards:picked.map(x=>x.card),cardCategories:Object.fromEntries(picked.map(x=>[x.card,x.category])),used:[...seen],categoryQueue:queue,label};
}
